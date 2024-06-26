import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {CreateShift} from "@/routes/admin/dialog/createShift.tsx";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {ShiftCell} from "@/routes/admin/shift.tsx";
import {useGetShifts} from "@/routes/admin/shiftsApi.ts";

export const Shifts = () => {
    const {setDialog} = useContext(DialogContext)
    const shiftResult = useGetShifts();

    return (
        <div>
            <Button onClick={() => setDialog(<CreateShift/>)}>Create Shift</Button>
            {shiftResult.isLoading && <p>Loading...</p>}
            {shiftResult.isError && <p>Error</p>}
            {shiftResult.data && (
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>name</TableHead>
                            <TableHead>start</TableHead>
                            <TableHead>end</TableHead>
                            <TableHead>min employees</TableHead>
                            <TableHead>wholeDay</TableHead>
                            <TableHead>actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shiftResult.data.sort((a, b) => a.startTime.hours - b.startTime.hours).map((shift) => (
                            <ShiftCell key={shift.id} {...shift}/>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}