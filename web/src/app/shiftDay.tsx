import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {getFormatedTime} from "@/admin/shiftsApi.ts";
import {ShiftDay, useAddShiftToDay, useGetShiftsForDay} from "@/app/shiftDayApi.ts";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {PlusCircleIcon, PlusIcon, PlusSquareIcon} from "lucide-react";

interface ShiftDayProps {
    name: string,
    date: Date,
    admin: boolean
}

const shiftDay = (props: ShiftDayProps) => {
    const shiftsDays = useGetShiftsForDay(props.date)
    const addShiftToDayMutation = useAddShiftToDay(props.date)

    function addShiftToDay(shiftId: number) {
        addShiftToDayMutation.mutate(shiftId)
    }

    return (
        <Card className="w-[200px]">
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
                <CardDescription>{props.date?.toDateString()}</CardDescription>
                {props.admin && <Button>
                    <PlusCircleIcon onClick={() => addShiftToDay(1)}/>
                </Button>}
            </CardHeader>
            <CardContent>
                {shiftsDays.isLoading && <p>Loading...</p>}
                {shiftsDays.isError && <p>Error</p>}

                <div className="space-y-4">
                    {shiftsDays.data && shiftsDays.data.map((shiftDay: ShiftDay) => (
                        <div key={shiftDay.id}
                             className={cn(shiftDay.users.length < shiftDay.shift.minEmployees ? "bg-red-200 " : "", "p-3 rounded-lg")}>
                            <h3>{shiftDay.shift.name}</h3>
                            <p>{getFormatedTime(shiftDay.shift.startTime)} - {getFormatedTime(shiftDay.shift.endTime)}</p>
                            <p>Users: {shiftDay.users.length}/{shiftDay.shift.minEmployees}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default shiftDay