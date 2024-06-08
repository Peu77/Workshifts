import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/api.ts";
import {User} from "@/admin/usersApi.ts";
import {Shift} from "@/admin/shiftsApi.ts";

const KEY = "shiftDay";

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