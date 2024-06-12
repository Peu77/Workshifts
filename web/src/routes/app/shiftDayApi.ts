import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/api.ts";
import {User} from "@/routes/admin/usersApi.ts";
import {Shift} from "@/routes/admin/shiftsApi.ts";
import {useToast} from "@/components/ui/use-toast.ts";
import {AxiosError} from "axios";

export const KEY = "shiftDay";

export interface ShiftDay {
    id: number;
    date: Date;
    shift: Shift
    users: User[];
}

export function useAddShiftToDay(date: Date) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [KEY, date],
        mutationFn: async (shiftId: number): Promise<ShiftDay> => {
            const response = await api.post(`/shift/${date.toISOString()}/shift/${shiftId}`)
            return response.data
        },
        onSuccess: (data: ShiftDay) => {
            queryClient.setQueryData([KEY, date], (old: Shift[] | undefined) => {
                return old ? [...old, data] : old
            })
        }
    })
}

export function useGetShiftsForDay(date: Date) {
    return useQuery<ShiftDay[]>({
        queryKey: [KEY, date],
        queryFn: async () => {
            const response = await api.get(`/shift/date/${date.toISOString()}`)
            return response.data
        }
    })
}

export function useDeleteShiftFromDay(date: Date) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [KEY, date],
        mutationFn: async (shiftDayId: number) => {
            await api.delete(`/shift/shiftDay/${shiftDayId}`)
            return shiftDayId
        },
        onSuccess: (id) => {
            queryClient.setQueryData([KEY, date], (old: ShiftDay[] | undefined) => {
                return old ? old.filter(shiftDay => shiftDay.id !== id) : old
            })
        }
    })
}

export function useJoinShiftDay(date: Date) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["joinShiftDay"],
        mutationFn: async (data: {
            shiftDayId: number,
            user: User
        }) => {
            await api.put(`/shift/shiftDay/${data.shiftDayId}/join`)
            return data
        },
        onSuccess: (data) => {
            queryClient.setQueryData([KEY, date], (old: ShiftDay[] | undefined) => {
                console.log(old, data)
                return old ? old.map(shiftDay => {
                    if (shiftDay.id === data.shiftDayId) {
                        return {...shiftDay, users: [...shiftDay.users, data.user]}
                    }
                    return shiftDay
                }) : old
            })
        }
    })
}

export function useQuitShiftDay(date: Date) {
    const queryClient = useQueryClient()
    const {toast} = useToast();

    return useMutation({
        mutationKey: ["quitShiftDay"],
        mutationFn: async (data: {
            shiftDayId: number,
            user: User
        }) => {
            await api.put(`/shift/shiftDay/${data.shiftDayId}/quit`)
            return data
        },
        onSuccess: (data) => {
            queryClient.setQueryData([KEY, date], (old: ShiftDay[] | undefined) => {
                console.log(old, data)
                return old ? old.map(shiftDay => {
                    if (shiftDay.id === data.shiftDayId) {
                        return {...shiftDay, users: shiftDay.users.filter(user => user.id !== data.user.id)}
                    }
                    return shiftDay
                }) : old
            })
        },
        onError: (error: AxiosError) => {
            toast({
                title: "Error quitting shift",
                description: (error?.response?.data as any)?.message,
                variant: "destructive"
            })
        }
    })
}