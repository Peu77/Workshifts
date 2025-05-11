import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/api.ts";
import {User} from "@/routes/admin/usersApi.ts";

const KEY = 'vacation';

export interface Vacation {
    id: number;
    user: User;
    description: string,
    startDate: Date;
    endDate: Date;
}

export function useGetVacations() {
    return useQuery<Vacation[]>({
        queryKey: [KEY],
        queryFn: async () => {
            return (await api.get<Vacation[]>('/vacation')).data;
        },
    })
}

interface CreateVacationDto {
    description: string,
    startDate: Date;
    endDate: Date;
}

export function useCreateVacation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['createVacation'],
        mutationFn: async (dto: CreateVacationDto) => {
            const response = await api.post<Vacation>('/vacation', {
                description: dto.description,
                startDate: dto.startDate.getTime(),
                endDate: dto.endDate.getTime()
            });
            return response.data;

        },
        onSuccess: (data: Vacation) => {
            queryClient.setQueryData([KEY], (old: Vacation[] | undefined) => {
                return old ? [...old, data] : old;
            })
        }
    })
}

export function useDeleteVacation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['deleteVacation'],
        mutationFn: async (id: number) => {
            await api.delete(`/vacation/${id}`);
            return id;
        },
        onSuccess: (id) => {
            queryClient.setQueryData([KEY], (old: Vacation[] | undefined) => {
                return old ? old.filter(vacation => vacation.id !== id) : old;
            })
        }
    })
}

export function useGetVacationsOnDay(day: Date) {
    return useQuery<Vacation[]>({
        queryKey: [KEY, day],
        queryFn: async () => {
            return (await api.get<Vacation[]>(`/vacation/day/${day.toISOString()}`)).data;
        }
    })
}