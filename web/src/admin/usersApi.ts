import api from "@/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const KEY = "users"

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

export function useGetMe() {
    return useQuery<User>({
        queryKey: ["me"],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300))
            const response = await api.get("/user/me")
            return response.data
        }
    })
}

export function useGetUsers() {
    return useQuery<User[]>({
        queryKey: [KEY],
        queryFn: async () => {
            const response = await api.get("/user/list")
            return response.data
        },
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["removeUser"],
        mutationFn: async (id: number) => {
            await api.delete(`/user/${id}`)
            return id
        },
        onSuccess: (id) => {
            queryClient.setQueryData([KEY], (old: User[] | undefined) => {
                return old ? old.filter(user => user.id !== id) : old
            })
        }
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createUser"],
        mutationFn: async (user: {
            name: string,
            email: string
        }) => {
            const response = await api.post("/user/user", user)
            return response.data
        },
        onSuccess: (data) => {
            queryClient.setQueryData([KEY], (old: User[] | undefined) => {
                return old ? [...old, data] : old
            })
        }
    })
}