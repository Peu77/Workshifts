import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Shift} from "@/routes/admin/shiftsApi.ts";
import {ShiftDay, useAddShiftToDay, useGetShiftsForDay} from "@/routes/app/shiftDayApi.ts";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {MinusCircleIcon, PlusCircleIcon, TrafficConeIcon} from "lucide-react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useMemo, useState} from "react";
import ShiftOnDay from "./shiftOnDay.tsx";
import {useGetVacationsOnDay} from "@/routes/vacation/vacationApi.tsx";
import {getWeekOfYear} from "@/utils.ts";
import {useSearchParams} from "react-router-dom";

interface ShiftDayProps {
    name: string,
    date: Date,
    shifts: Shift[],
    isToday: boolean
    isAdmin: boolean,
}

export default (props: ShiftDayProps) => {
    const shiftsDays = useGetShiftsForDay(props.date)
    const vacations = useGetVacationsOnDay(props.date)
    const addShiftToDayMutation = useAddShiftToDay(props.date)
    const [selectedShift, setSelectedShift] = useState<string | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()

    function addShiftToDay() {
        if (!selectedShift) return

        addShiftToDayMutation.mutate(parseInt(selectedShift))
        setSelectedShift(null)
    }

    const availableShiftsToAssign = useMemo<Shift[]>(() => {
        return props.shifts.filter(shift => !shiftsDays.data?.some(shiftDay => shiftDay.shift.id === shift.id))
    }, [shiftsDays.data]);

    const weekOfYear = useMemo<number | undefined>(() => {
        if (!props.date) return

        return getWeekOfYear(props.date)
    }, [props.date, props.name]);

    const allShiftsMinEmployees = useMemo<boolean>(() => {
        if (!shiftsDays.data) return false

        return shiftsDays.data.every(shiftDay => shiftDay.users.length >= shiftDay.shift.minEmployees)
    }, [shiftsDays])

    function open() {
        if (!weekOfYear) return
        setSearchParams(prev => {
            const openWeeks = prev.get("openWeeks")?.split(",") || []
            openWeeks.push(weekOfYear.toString())
            prev.set("openWeeks", openWeeks.join(","))
            return prev;
        })
    }

    function close() {
        if (!weekOfYear) return

        setSearchParams(prev => {
            const openWeeks = prev.get("openWeeks")?.split(",") || []
            prev.set("openWeeks", openWeeks.filter(week => week !== weekOfYear.toString()).join(","))
            return prev;
        })
    }

    const isWeekRange = useMemo(() => {
        return searchParams.get("timeRange") === "1"
    }, [searchParams]);

    const isOpen = useMemo<boolean>(() => {
        if (isWeekRange) return true;
        if (!weekOfYear) return false;

        const openWeeks = searchParams.get("openWeeks")?.split(",") || []
        return openWeeks.includes(weekOfYear.toString())
    }, [searchParams])

    return (
        <Card className={cn("flex-grow-0 flex-shrink-0 basis-[19%]  relative", props.isToday ? "border-blue-400" : "")}>
            <CardHeader>
                <CardTitle className="text-sm lg:text-lg flex gap-2">
                    {props.name}
                    {!allShiftsMinEmployees && <TrafficConeIcon className="text-red-400"/>}
                </CardTitle>
                <CardDescription>{props.date?.toLocaleDateString("de")}</CardDescription>

                {props.name === "Mo" && weekOfYear && (
                    <>
                        {<p onClick={() => {
                            setSearchParams(prev => {
                                prev.set("week", weekOfYear.toString())
                                prev.set("timeRange", "1")
                                return prev;
                            })
                        }}
                            className="cursor-pointer hover:scale-125 absolute top-0 left-2 font-bold">{weekOfYear + 1}</p>}

                        {!isWeekRange && (
                            isOpen ? <MinusCircleIcon className="absolute top-0 right-0 cursor-pointer"
                                                      onClick={close}/> :
                                <PlusCircleIcon className="absolute top-0 right-0 cursor-pointer"
                                                onClick={open}/>
                        )}

                    </>
                )}

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
                            {vacations.data && vacations.data.map(vacation => (
                                <div key={vacation.id} className="bg-yellow-200 p-2 rounded-lg">
                                    <p>{vacation.user.name}</p>
                                    <p>{vacation.startDate.toLocaleDateString("de")} - {vacation.endDate.toLocaleDateString("de")}</p>
                                </div>
                            ))}

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