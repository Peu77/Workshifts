import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Shift} from "@/admin/shiftsApi.ts";
import {ShiftDay, useAddShiftToDay, useGetShiftsForDay} from "@/app/shiftDayApi.ts";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {MinusCircleIcon, PlusCircleIcon} from "lucide-react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useMemo, useState} from "react";
import ShiftOnDay from "./shiftOnDay";

interface ShiftDayProps {
    name: string,
    date: Date,
    shifts: Shift[],
    isToday: boolean
    isAdmin: boolean,
    defaultOpen: boolean
}

export default (props: ShiftDayProps) => {
    const shiftsDays = useGetShiftsForDay(props.date)
    const addShiftToDayMutation = useAddShiftToDay(props.date)
    const [selectedShift, setSelectedShift] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(props.defaultOpen)

    function addShiftToDay() {
        if (!selectedShift) return

        addShiftToDayMutation.mutate(parseInt(selectedShift))
        setSelectedShift(null)
    }

    const availableShiftsToAssign = useMemo<Shift[]>(() => {
        return props.shifts.filter(shift => !shiftsDays.data?.some(shiftDay => shiftDay.shift.id === shift.id))
    }, [shiftsDays.data]);

    return (
        <Card className={cn("flex-grow min-w-[300px] max-w-[400px] relative", props.isToday ? "border-blue-400" : "")}>
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
                <CardDescription>{props.date?.toDateString()}</CardDescription>

                {isOpen ? <MinusCircleIcon className="absolute top-0 right-0 cursor-pointer" onClick={() => setIsOpen(false)}/> :
                    <PlusCircleIcon className="absolute top-0 right-0 cursor-pointer" onClick={() => setIsOpen(true)}/>}

                {isOpen && props.isAdmin && availableShiftsToAssign.length > 0 && (
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
                )
                }
            </CardHeader>
            <CardContent>
                {isOpen && (
                    <>
                        {shiftsDays.isLoading && <p>Loading...</p>}
                        {shiftsDays.isError && <p>Error</p>}

                        <div className="space-y-4">
                            {shiftsDays.data && shiftsDays.data.sort((a, b) => a.shift.startTime.hours - b.shift.startTime.hours).map((shiftDay: ShiftDay) => (
                                <ShiftOnDay key={shiftDay.id} shiftDay={shiftDay} isAdmin={props.isAdmin}
                                            date={props.date}/>
                            ))}
                        </div>
                    </>
                )}

            </CardContent>
        </Card>
    )
}