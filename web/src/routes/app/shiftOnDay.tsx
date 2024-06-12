import {cn} from "@/lib/utils.ts";
import {getFormatedTime} from "@/routes/admin/shiftsApi.ts";
import {MinusCircleIcon, PlusCircleIcon} from "lucide-react";
import {
    ShiftDay,
    useAssignUserToShiftDay,
    useDeleteShiftFromDay,
    useJoinShiftDay,
    useQuitShiftDay, useUnassignUserToShiftDay
} from "@/routes/app/shiftDayApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useMemo, useState} from "react";
import {useGetMe, useGetUsers} from "@/routes/admin/usersApi.ts";
import {ColorRing} from "react-loader-spinner";
import {FancyMultiSelect, Item} from "@/components/ui/fancyMultiSelect.tsx";

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
    const assignUserMutation = useAssignUserToShiftDay(date);
    const unassignUserMutation = useUnassignUserToShiftDay(date);
    const userList = useGetUsers();
    const selectedUsersToAssignState = useState<Item[]>([])

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

    const availableUsersToAssign = useMemo(() => {
        if (!userList.data) return []

        return userList.data.filter(user => !shiftDay.users.some(u => u.id === user.id))
    }, [userList, shiftDay])

    return (
        <div className="flex">
            {isMeIncluded && <div className="w-[10px] bg-green-400 rounded-l-lg"/>}
            <div
                className={cn(shiftDay.users.length < shiftDay.shift.minEmployees ? "bg-red-200 " : "bg-green-200", "p-3 relative flex-grow")}>
                {isAdmin && <MinusCircleIcon
                    onClick={() => deleteShiftFromDayMutation.mutate(shiftDay.id)}
                    className="absolute right-[-0] top-[-0] cursor-pointer hover:text-red-300"/>}

                <h3>{shiftDay.shift.name}</h3>
                <p>{getFormatedTime(shiftDay.shift.startTime)} - {getFormatedTime(shiftDay.shift.endTime)}</p>
                <ul className="space-y-2">
                    {shiftDay.users.map(user => <li className="flex cursor-pointer gap-4 justify-between max-w-[100px]"
                                                    key={user.id}>
                        <p>- {user.name}</p>
                        {isAdmin && <MinusCircleIcon onClick={() => unassignUserMutation.mutate({
                            shiftDayId: shiftDay.id,
                            user
                        })}/>}
                    </li>)}
                </ul>

                {(joinShiftDayMutation.isPending || quitShiftDayMutation.isPending) ? <ColorRing
                    visible={true}
                    height="60"
                    width="60"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{margin: "auto"}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                /> : isMeIncluded ? <Button className="w-full mt-4 mb-4" onClick={quitShift}>quit</Button> :
                    <Button className="w-full mt-4 mb-4" variant="secondary" onClick={joinShift}>join</Button>}

                {isAdmin && userList.data && availableUsersToAssign.length > 0 && <div className="flex gap-2">
                    <FancyMultiSelect selectedState={selectedUsersToAssignState} placeholder={"assign users"}
                                      items={availableUsersToAssign.map(user => ({
                                          label: user.name,
                                          value: user.id.toString()
                                      }))}/>

                    <Button onClick={() => {
                        selectedUsersToAssignState[0].forEach(user => {
                            assignUserMutation.mutateAsync({
                                shiftDayId: shiftDay.id,
                                user: userList.data!.find(u => u.id === parseInt(user.value))!
                            }).then(() => {
                                selectedUsersToAssignState[1](prev => prev.filter(u => u.value !== user.value))
                            })
                        })
                    }} size={"icon"}>
                        <PlusCircleIcon/>
                    </Button>
                </div>}
            </div>
        </div>

    )
}