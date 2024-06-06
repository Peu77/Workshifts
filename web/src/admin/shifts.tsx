import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {CreateShift} from "@/admin/dialog/createShift.tsx";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ShiftCell} from "@/admin/shift";
import {useGetShifts} from "@/admin/shiftsApi";

export const Shifts = () => {
    const {setDialog, dialog} = useContext(DialogContext)
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
                            <TableHead>actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shiftResult.data.map((shift) => (
                            <ShiftCell key={shift.id} {...shift}/>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}