import React from 'react'
import ReactDOM from 'react-dom/client'
import "./globals.css"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import "./globals.css"
import Login from "@/auth/Login.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "@/components/ui/toaster.tsx";
import App from "@/app/App.tsx";
import {Admin} from "@/admin/Admin.tsx";
import DialogProvider from "@/provider/DialogProvider.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/app",
        element: <App/>
    },
    {
        path: "/admin",
        element: <Admin/>
    },
    {
        path: "*",
        element: <h1>404</h1>
    }
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Toaster/>
            <DialogProvider>
                <RouterProvider router={router}/>
            </DialogProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
