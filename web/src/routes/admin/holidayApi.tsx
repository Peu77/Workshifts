import api from "@/api.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const KEY = "holidays"

interface Holiday {
    id: number;
    name: string;
    date: Date;
}

export function useGetHolidays(year: number) {
    return useQuery<Holiday[]>({
        queryKey: [KEY],
        queryFn: async () => {
            const response = await api.get<Holiday[]>(`/holiday/${year}`)
            return response.data
        }
    })
}

export function useCreateHoliday() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createHoliday"],
        mutationFn: async (dto: {
            name: string,
            date: string
        }) => {
            const response = await api.post<Holiday>("/holiday", dto)
            return response.data
        },
        onSuccess: (data: Holiday) => {
            queryClient.setQueryData([KEY], (old: Holiday[] | undefined) => {
                return old ? [...old, data] : [data]
            })
        }
    })
}

export function useDeleteHoliday() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["removeHoliday"],
        mutationFn: async (id: number) => {
            await api.delete(`/holiday/${id}`)
            return id
        },
        onSuccess: (id) => {
            queryClient.setQueryData([KEY], (old: Holiday[] | undefined) => {
                return old ? old.filter(holiday => holiday.id !== id) : old
            })
        }
    })
}

export function useIsHoliday(date: Date) {
    return useQuery<boolean>({
        queryKey: ["isHoliday", date],
        queryFn: async () => {
            const response = await api.get<boolean>(`/holiday/is-holiday/${date.toISOString()}`)
            return response.data
        }
    })
}