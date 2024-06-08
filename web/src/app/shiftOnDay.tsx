import {cn} from "@/lib/utils.ts";
import {getFormatedTime} from "@/admin/shiftsApi.ts";
import {MinusCircleIcon} from "lucide-react";
import {ShiftDay, useDeleteShiftFromDay} from "@/app/shiftDayApi.ts";

interface ShiftDayProps {
    shiftDay: ShiftDay,
    isAdmin: boolean,
    date: Date
}

export default ({shiftDay, isAdmin, date}: ShiftDayProps) => {
    const deleteShiftFromDayMutation = useDeleteShiftFromDay(date)
    return (
        <div
            className={cn(shiftDay.users.length < shiftDay.shift.minEmployees ? "bg-red-200 " : "", "p-3 rounded-lg relative")}>

            <h3>{shiftDay.shift.name}</h3>
            <p>{getFormatedTime(shiftDay.shift.startTime)} - {getFormatedTime(shiftDay.shift.endTime)}</p>
            <p>Users: {shiftDay.users.length}/{shiftDay.shift.minEmployees}</p>

            {isAdmin && <MinusCircleIcon
                onClick={() => deleteShiftFromDayMutation.mutate(shiftDay.id)}
                className="absolute right-[-5px] top-[-5px] cursor-pointer hover:text-red-300"/>}
        </div>
    )
}