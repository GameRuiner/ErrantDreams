import ReactDOM from "react-dom/client";

import "./css/index.css";
import IndexPage from "./views/IndexPage.tsx";
import AboutPage from "./views/AboutPage.tsx";
import AuthPage from "./views/AuthPage.tsx";

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
    path: "/about",
    element: <AboutPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
