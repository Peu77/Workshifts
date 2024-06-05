import React from 'react'
import ReactDOM from 'react-dom/client'
import "./globals.css"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./globals.css"

const Test = () => {
    return <div>Test</div>
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Test/>
    },
    {}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);
