from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

from ...models import User, Token
from ...serializers import UserSerializer, TokenSerializer

from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

import hashlib
import uuid
import logging
logger = logging.getLogger(__name__)


class HelloAPIView(APIView):
    def get(self, request: Request):
        return Response({"message": "Hello, world!"})


class DateAPIView(APIView):
    def get(self, request: Request):
        return Response({"date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
    

SALT = "8b4f6b2cc1868d75ef79e5cfb8779c11b6a374bf0fce05b485581bf4e1e25b96c8c2855015de8449"
URL = "http://localhost:3000"


def mail_template(content, button_url, button_text):
    return f"""<!DOCTYPE html>
            <html>
            <body style="text-align: center; font-family: "Verdana", serif; color: #000;">
                <div style="max-width: 600px; margin: 10px; background-color: #fafafa; padding: 25px; border-radius: 20px;">
                <p style="text-align: left;">{content}</p>
                <a href="{button_url}" target="_blank">
                    <button style="background-color: #444394; border: 0; width: 200px; height: 30px; border-radius: 6px; color: #fff;">{button_text}</button>
                </a>
                <p style="text-align: left;">
                    If you are unable to click the above button, copy paste the below URL into your address bar
                </p>
                <a href="{button_url}" target="_blank">
                    <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">{button_url}</p>
                </a>
                </div>
            </body>
            </html>"""


class ResetPasswordView(APIView):
    def post(self, request, format=None):
        user_id = request.data["id"]
        token = request.data["token"]
        password = request.data["password"]

        token_obj = Token.objects.filter(
            user_id=user_id).order_by("-created_at")[0]
        if token_obj.expires_at < timezone.now():
            return Response(
                {
                    "success": False,
                    "message": "Password Reset Link has expired!",
                },
                status=status.HTTP_200_OK,
            )
        elif token_obj is None or token != token_obj.token or token_obj.is_used:
            return Response(
                {
                    "success": False,
                    "message": "Reset Password link is invalid!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            token_obj.is_used = True
            hashed_password = make_password(password=password, salt=SALT)
            ret_code = User.objects.filter(
                id=user_id).update(password=hashed_password)
            if ret_code:
                token_obj.save()
                return Response(
                    {
                        "success": True,
                        "message": "Your password reset was successfully!",
                    },
                    status=status.HTTP_200_OK,
                )


class ForgotPasswordView(APIView):
    def post(self, request, format=None):
        try:
            email = request.data["email"]
            user = User.objects.get(email=email)
            created_at = timezone.now()
            expires_at = timezone.now() + timezone.timedelta(1)
            salt = uuid.uuid4().hex
            token = hashlib.sha512(
                (str(user.id) + user.password + created_at.isoformat() + salt).encode(
                    "utf-8"
                )
            ).hexdigest()
            token_obj = {
                "token": token,
                "created_at": created_at,
                "expires_at": expires_at,
                "user_id": user.id,
            }
            serializer = TokenSerializer(data=token_obj)
            if serializer.is_valid():
                serializer.save()
                subject = "Forgot Password Link"
                content = mail_template(
                    "We have received a request to reset your password. Please reset your password using the link below.",
                    f"{URL}/resetPassword?id={user.id}&token={token}",
                    "Reset Password",
                )
                logger.error(f"Email host user: {settings.EMAIL_HOST_USER}")
                send_mail(
                    subject=subject,
                    message=content,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    html_message=content,
                )
                return Response(
                    {
                        "success": True,
                        "message": "A password reset link has been sent to your email.",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                error_msg = ""
                for key in serializer.errors:
                    error_msg += serializer.errors[key][0]
                return Response(
                    {
                        "success": False,
                        "message": error_msg,
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")


class RegistrationView(APIView):
    def post(self, request, format=None):
        try:
            logger.info(f"Registration attempt with data: {request.data}")
            request.data["password"] = make_password(
                password=request.data["password"], salt=SALT
            )
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"success": True, "message": "You are now registered on our website!"},
                    status=status.HTTP_200_OK,
                )
            else:
                error_msg = ""
                for key in serializer.errors:
                    error_msg += serializer.errors[key][0]
                return Response(
                    {"success": False, "message": error_msg},
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")


class LoginView(APIView):
    def post(self, request, format=None):
        email = request.data["email"]
        password = request.data["password"]
        hashed_password = make_password(password=password, salt=SALT)
        user = User.objects.get(email=email)
        if user is None or user.password != hashed_password:
            return Response(
                {
                    "success": False,
                    "message": "Invalid Login Credentials!",
                },
                status=status.HTTP_200_OK,
            )
        else:
            created_at = timezone.now()
            expires_at = timezone.now() + timedelta(days=7)  # Token expires in 7 days
            salt = uuid.uuid4().hex
            token = hashlib.sha512(
                (str(user.id) + user.password + created_at.isoformat() + salt).encode("utf-8")
            ).hexdigest()
            token_obj = {
                "token": token,
                "created_at": created_at,
                "expires_at": expires_at,
                "user_id": user.id,
                "is_used": False
            }
            serializer = TokenSerializer(data=token_obj)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True, 
                        "message": "You are now logged in!",
                        "token": token,
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email
                           }
                    },
                    status=status.HTTP_200_OK,
                )    
            else:
                return Response(
                    {
                        "success": False,
                        "message": "Failed to create session. Please try again.",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
