import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPageBefore from "./components/MainPageLoginBefore/MainPageLoginBefore";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <MainPageBefore />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
