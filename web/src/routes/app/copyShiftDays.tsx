import {DatePickerWithRange} from "@/components/ui/datePickerWithRange.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {useToast} from "@/components/ui/use-toast.ts";
import api from "@/api.ts";
import {DateRange} from "react-day-picker";
import {useQueryClient} from "@tanstack/react-query";
import {KEY} from "@/routes/app/shiftDayApi.ts";

export default () => {
    const [date, setDate] = useState<DateRange | null>(null)

    const {toast} = useToast()
    const queryClient = useQueryClient()

    function copyWeek() {
        if (!date || !date?.from || !date?.to) {
            toast({
                title: "Please select a date range",
                variant: "destructive"
            })
            return
        }

        api.post(`/shift/shiftDay/copyWeek/${date.from.toISOString()}/${date.to.toISOString()}`, {}).then(() => {
            toast({
                title: "Success",
                description: "The week has been copied",
            })

            queryClient.invalidateQueries({
                predicate: query => query.queryKey[0] === KEY
            })
        }).catch(() => {
            toast({
                title: "Error",
                description: "An error occurred",
                variant: "destructive"
            })
        })
    }

    return (
        <>
            <DatePickerWithRange onChange={setDate}/>
            <Button onClick={copyWeek}>copy week</Button>
        </>
    )
}