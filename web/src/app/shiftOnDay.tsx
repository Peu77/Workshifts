import {cn} from "@/lib/utils.ts";
import {getFormatedTime} from "@/admin/shiftsApi.ts";
import {MinusCircleIcon} from "lucide-react";
import {ShiftDay, useDeleteShiftFromDay, useJoinShiftDay, useQuitShiftDay} from "@/app/shiftDayApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useMemo} from "react";
import {useGetMe} from "@/admin/usersApi.ts";
import {ColorRing} from "react-loader-spinner";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";

interface ShiftDayProps {
    shiftDay: ShiftDay,
    isAdmin: boolean,
    date: Date,
}

export default ({shiftDay, isAdmin, date}: ShiftDayProps) => {
    const deleteShiftFromDayMutation = useDeleteShiftFromDay(date)
    const getMe = useGetMe();
    const joinShiftDayMutation = useJoinShiftDay(date);
    const quitShiftDayMutation = useQuitShiftDay(date);

    const isMeIncluded = useMemo(() => {
        if (!getMe.data) return false

        return shiftDay.users.some(user => user.id === getMe.data.id)
    }, [shiftDay]);

    function joinShift() {
        if (!getMe.data) return
        if (joinShiftDayMutation.isPending) return

        joinShiftDayMutation.mutate({
            shiftDayId: shiftDay.id,
            user: getMe.data!
        })
    }

    function quitShift() {
        if (!getMe.data) return
        if (joinShiftDayMutation.isPending) return

        quitShiftDayMutation.mutate({
            shiftDayId: shiftDay.id,
            user: getMe.data!
        })
    }

    return (
        <div className="flex rounded-lg overflow-hidden">
            {isMeIncluded && <div className="w-[5px] bg-green-400"/>}
            <div
                className={cn(shiftDay.users.length < shiftDay.shift.minEmployees ? "bg-red-200 " : "bg-green-200", "p-3 relative flex-grow")}>
                {isAdmin && <MinusCircleIcon
                    onClick={() => deleteShiftFromDayMutation.mutate(shiftDay.id)}
                    className="absolute right-[-0] top-[-0] cursor-pointer hover:text-red-300"/>}

                <h3>{shiftDay.shift.name}</h3>
                <p>{getFormatedTime(shiftDay.shift.startTime)} - {getFormatedTime(shiftDay.shift.endTime)}</p>
                <HoverCard>
                    <HoverCardTrigger>
                        <p className="cursor-pointer hover:underline">Users: {shiftDay.users.length}/{shiftDay.shift.minEmployees}</p>
                    </HoverCardTrigger>

                    <HoverCardContent>
                        {shiftDay.users.length === 0 && <p>No users assigned</p>}
                        <ul>
                            {shiftDay.users.map(user => <li className="flex gap-4" key={user.id}>
                                <p>{user.name}</p>
                                <p> {user.email}</p>
                            </li>)}
                        </ul>
                    </HoverCardContent>
                </HoverCard>


                {(joinShiftDayMutation.isPending || quitShiftDayMutation.isPending) ? <ColorRing
                    visible={true}
                    height="60"
                    width="60"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{margin: "auto"}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                /> : isMeIncluded ? <Button className="w-full mt-4" onClick={quitShift}>quit</Button> :
                    <Button className="w-full mt-4" variant="secondary" onClick={joinShift}>join</Button>}
            </div>
        </div>

    )
}