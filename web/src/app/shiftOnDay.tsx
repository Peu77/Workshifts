import {cn} from "@/lib/utils.ts";
import {getFormatedTime} from "@/admin/shiftsApi.ts";
import {MinusCircleIcon} from "lucide-react";
import {ShiftDay, useDeleteShiftFromDay, useJoinShiftDay} from "@/app/shiftDayApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useMemo} from "react";
import {useGetMe} from "@/admin/usersApi.ts";

interface ShiftDayProps {
    shiftDay: ShiftDay,
    isAdmin: boolean,
    date: Date
}

export default ({shiftDay, isAdmin, date}: ShiftDayProps) => {
    const deleteShiftFromDayMutation = useDeleteShiftFromDay(date)
    const getMe = useGetMe();
    const joinShiftDayMutation = useJoinShiftDay(date);

    const isMeIncluded = useMemo(() => {
        return shiftDay.users.some(user => user.id === getMe.data?.id)
    }, [getMe.data, shiftDay.shift]);

    function joinShift() {
        if (!getMe.data) return
        if (joinShiftDayMutation.isPending) return

        joinShiftDayMutation.mutate({
            shiftDayId: shiftDay.id,
            user: getMe.data!
        })
    }

    return (
        <div
            className={cn(shiftDay.users.length < shiftDay.shift.minEmployees ? "bg-red-200 " : "", "p-3 rounded-lg relative")}>
            {isAdmin && <MinusCircleIcon
                onClick={() => deleteShiftFromDayMutation.mutate(shiftDay.id)}
                className="absolute right-[-5px] top-[-5px] cursor-pointer hover:text-red-300"/>}

            <h3>{shiftDay.shift.name}</h3>
            <p>{getFormatedTime(shiftDay.shift.startTime)} - {getFormatedTime(shiftDay.shift.endTime)}</p>
            <p>Users: {shiftDay.users.length}/{shiftDay.shift.minEmployees}</p>


            {isMeIncluded ? <Button className="w-full mt-4">quit</Button> :
                <Button className="w-full mt-4" onClick={joinShift}>join</Button>}
        </div>
    )
}