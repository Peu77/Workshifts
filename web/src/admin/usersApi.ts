import api from "@/api";
import {useMutation, useQuery} from "@tanstack/react-query";

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}


export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export function useGetUsers() {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await api.get("/user/list")
            return response.data
        },
    })
}

export function useDeleteUser(){
    return useMutation({
        mutationKey: ["removeUser"],
        mutationFn: async (id: number) => {
            await api.delete(`/user/${id}`)
            return id
        }
    })
}