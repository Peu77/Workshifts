import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useCreateVacation, useDeleteVacation, useGetVacations} from "@/routes/vacation/vacationApi.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DatePicker} from "@/components/ui/datePicker.tsx";
import {useState} from "react";
import {useToast} from "@/components/ui/use-toast.ts";
import {TrashIcon} from "lucide-react";

export default () => {
    const navigate = useNavigate()
    const vacationQuery = useGetVacations()
    const createVacation = useCreateVacation();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const {toast} = useToast()
    const deleteVacation = useDeleteVacation();

    function handleSubmit() {
        if (!startDate || !endDate) {
            toast({
                title: "Error",
                description: "Please select a start and end date",
                variant: "destructive"
            })
            return
        }

        if (startDate > endDate) {
            toast({
                title: "Error",
                description: "Start date must be before end date",
                variant: "destructive"
            })
            return
        }

        createVacation.mutate({startDate, endDate})
        setEndDate(undefined)
        setStartDate(undefined)
    }

    return (
        <div className="p-4 w-1/2 space-y-2">
            <Button onClick={() => navigate("/app")}>Go to App</Button>
            <div className="flex gap-2">
                <DatePicker onChange={setStartDate} value={startDate}/>
                <DatePicker onChange={setEndDate} value={endDate}/>
                <Button onClick={handleSubmit}>Submit</Button>
            </div>

            {vacationQuery.isLoading && <div>Loading...</div>}
            {vacationQuery.isError && <div>Error: {vacationQuery.error.message}</div>}


            {vacationQuery.data && (<Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vacationQuery.data.map(vacation => (
                        <TableRow key={vacation.id}>
                            <TableCell>{vacation.startDate.toLocaleDateString("de")}</TableCell>
                            <TableCell>{vacation.endDate.toLocaleDateString("de")}</TableCell>
                            <TableCell>
                                <Button onClick={() => deleteVacation.mutate(vacation.id)} variant="destructive"
                                        size="icon">
                                    <TrashIcon/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>)}
        </div>
    )
}