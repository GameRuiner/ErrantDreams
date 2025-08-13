import ReactDOM from "react-dom/client";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/index.css";
import IndexPage from "./views/IndexPage.tsx";
import StartPage from "./views/StartPage.tsx";
import AuthPage from "./views/Auth/AuthPage.tsx";
import ForgotPasswordPage from "./views/Auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./views/Auth/ResetPasswordPage.tsx";
import FactionSelectionPage from "./views/FactionSelectionPage.tsx";


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
    element: <StartPage />,
  },
  {
    path: "/faction-selection",
    element: <FactionSelectionPage />,
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
