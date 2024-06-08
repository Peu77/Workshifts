import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {getFormatedTime, Shift} from "@/admin/shiftsApi.ts";
import {ShiftDay, useAddShiftToDay, useDeleteShiftFromDay, useGetShiftsForDay} from "@/app/shiftDayApi.ts";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {MinusCircleIcon, PlusCircleIcon} from "lucide-react";
import {Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue} from "@/components/ui/select.tsx";
import {useMemo, useState} from "react";

interface ShiftDayProps {
    name: string,
    date: Date,
    shifts: Shift[],
    isToday: boolean
    isAdmin: boolean,
}

export default (props: ShiftDayProps) => {
    const shiftsDays = useGetShiftsForDay(props.date)
    const addShiftToDayMutation = useAddShiftToDay(props.date)
    const deleteShiftFromDayMutation = useDeleteShiftFromDay(props.date)
    const [selectedShift, setSelectedShift] = useState<string | null>(null)

    function addShiftToDay() {
        if (!selectedShift) return

        addShiftToDayMutation.mutate(parseInt(selectedShift))
        setSelectedShift(null)
    }

    const availableShiftsToAssign = useMemo<Shift[]>(() => {
        return props.shifts.filter(shift => !shiftsDays.data?.some(shiftDay => shiftDay.shift.id === shift.id))
    }, [shiftsDays.data]);

    return (
        <Card className={cn("flex-grow min-w-[300px] max-w-[400px]", props.isToday ? "border-blue-400" : "")}>
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
                <CardDescription>{props.date?.toDateString()}</CardDescription>
                {props.isAdmin && availableShiftsToAssign.length > 0 && (
                    <div className="flex gap-2">
                        <Select value={selectedShift || ""} onValueChange={setSelectedShift}>
                            <SelectTrigger>
                                <SelectValue placeholder="select shift"/>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    {availableShiftsToAssign && availableShiftsToAssign
                                        .map((shift) => (
                                            <SelectItem key={shift.id} value={shift.id.toString()}>
                                                {shift.name}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button onClick={addShiftToDay}>
                            <PlusCircleIcon/>
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {shiftsDays.isLoading && <p>Loading...</p>}
                {shiftsDays.isError && <p>Error</p>}

                <div className="space-y-4">
                    {shiftsDays.data && shiftsDays.data.map((shiftDay: ShiftDay) => (
                        <div key={shiftDay.id}
                             className={cn(shiftDay.users.length < shiftDay.shift.minEmployees ? "bg-red-200 " : "", "p-3 rounded-lg relative")}>

                            <h3>{shiftDay.shift.name}</h3>
                            <p>{getFormatedTime(shiftDay.shift.startTime)} - {getFormatedTime(shiftDay.shift.endTime)}</p>
                            <p>Users: {shiftDay.users.length}/{shiftDay.shift.minEmployees}</p>

                            {props.isAdmin && <MinusCircleIcon
                                onClick={() => deleteShiftFromDayMutation.mutate(shiftDay.id)}
                                className="absolute right-[-5px] top-[-5px] cursor-pointer hover:text-red-300"/>}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}