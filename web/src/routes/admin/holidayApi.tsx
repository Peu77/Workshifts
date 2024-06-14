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