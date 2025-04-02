import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPageBefore from "./components/MainPageLoginBefore/MainPageLoginBefore";
import Login from "./components/Login/Login";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <MainPageBefore />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
