import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import api from "@/api";

const KEY = "shifts"

export function getFormatedTime(time: ShiftTime) {
    return `${time.hours.toString().padStart(2, "0")}:${time.minutes.toString().padStart(2, "0")}`
}

export interface ShiftTime {
    hours: number
    minutes: number
}

export interface Shift {
    id: number,
    name: string,
    startTime: ShiftTime,
    endTime: ShiftTime,

    minEmployees: number
}

export function useGetShifts() {
    return useQuery<Shift[]>({
        queryKey: [KEY],
        queryFn: async () => {
            const response = await api.get("/shift")
            return response.data
        }
    })
}

export function useDeleteShift() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["removeShift"],
        mutationFn: async (id: number) => {
            // 1000ms delay
            await new Promise((resolve) => setTimeout(resolve, 1000))
            await api.delete(`/shift/${id}`)
            return id
        },
        onSuccess: (id) => {
            queryClient.setQueryData(["shifts"], (old: Shift[] | undefined) => {
                return old ? old.filter(shift => shift.id !== id) : old
            })
        }
    })
}

export interface ShiftDto {
    id?: number
    name: string;

    minEmployees: number;

    startTime: {
        hours: number;
        minutes: number;
    }

    endTime: {
        hours: number;
        minutes: number;
    }
}

export function useCreateShift() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createShift"],
        mutationFn: async (shift: ShiftDto) => {
            const response = await api.post("/shift", shift)
            return response.data
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["shifts"], (old: Shift[] | undefined) => {
                return old ? [...old, data] : old
            })
        }
    })
}

export function useUpdateShift() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateShift"],
        mutationFn: async (shift: ShiftDto) => {
            await api.put(`/shift/${shift.id}`, shift)
            return shift
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["shifts"], (old: Shift[] | undefined) => {
                return old ? old.map(shift => shift.id === data.id ? data : shift) : old
            })
        }
    })
}