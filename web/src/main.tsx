import React from 'react'
import ReactDOM from 'react-dom/client'
import "./globals.css"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./globals.css"
import Login from "@/auth/login.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/toaster.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {}
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Toaster/>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </React.StrictMode>
);
