import {Shift} from "@/types/Shift.ts";
import api from "@/api.ts";
import {useQuery} from "@tanstack/react-query";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {CreateShift} from "@/admin/dialog/createShift.tsx";

export const Shifts = () => {
    const shiftResult = useQuery<Shift[]>({
        queryKey: ["shifts"],
        queryFn: async () => {
            const response = await api.get("/shift")
            return response.data
        }
    })

    const {setDialog} = useContext(DialogContext)

    return (
        <div>
            <Button onClick={() => setDialog(<CreateShift/>)}>Create Shift</Button>
            {shiftResult.isLoading && <p>Loading...</p>}
            {shiftResult.isError && <p>Error</p>}
            {shiftResult.data && (
                <ul>
                    {shiftResult.data.map((shift) => (
                        <li key={shift.id}>
                            <h3>{shift.name}</h3>
                            <p>{shift.startTime.toTimeString()} - {shift.endTime.toTimeString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}