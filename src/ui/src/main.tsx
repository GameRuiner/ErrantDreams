import ReactDOM from "react-dom/client";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./css/index.css";
import IndexPage from "./views/IndexPage.tsx";
import AboutPage from "./views/AboutPage.tsx";
import AuthPage from "./views/AuthPage.tsx";
import ForgotPasswordPage from "./views/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./views/ResetPasswordPage.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/resetPassword",
    element: <ResetPasswordPage />,
  },
  {
    path: "/game",
    element: <AboutPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </>
);
