import {TableCell, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {EditIcon, TrashIcon} from "lucide-react";
import {ColorRing} from "react-loader-spinner";
import {getFormatedTime, Shift, useDeleteShift} from "@/admin/shiftsApi";
import {useToast} from "@/components/ui/use-toast";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider";
import {EditShift} from "@/admin/dialog/editShift";

export const ShiftCell = (shift: Shift) => {
    const deleteShiftMutation = useDeleteShift();
    const {toast} = useToast()
    const {setDialog} = useContext(DialogContext)

    function removeShift(id: number) {
        if (deleteShiftMutation.isPending) return
        deleteShiftMutation.mutateAsync(id).then(() => {
            toast({
                title: "Shift Deleted",
                description: "Shift has been deleted successfully.",
            })
        })
    }

    return (
        <TableRow key={shift.id}>
            <TableCell>{shift.name}</TableCell>
            <TableCell>{getFormatedTime(shift.startTime)}</TableCell>
            <TableCell>{getFormatedTime(shift.endTime)}</TableCell>
            <TableCell>{shift.minEmployees}</TableCell>
            <TableCell>{shift.wholeDay ? "Yes" : "No"}</TableCell>
            <TableCell className="flex">
                <Button size="icon" variant="ghost">
                    <EditIcon onClick={() => setDialog(<EditShift {...shift}/>)}/>
                </Button>
                <Button onClick={() => removeShift(shift.id)} size="icon" variant="ghost">
                    {deleteShiftMutation.isPending ? <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    /> : <TrashIcon/>}
                </Button>
            </TableCell>
        </TableRow>
    )
}
