import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useContext, useState} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CreateHoliday} from "@/routes/admin/dialog/createHoliday.tsx";
import {useDeleteHoliday, useGetHolidays} from "@/routes/admin/holidayApi.tsx";
import {TrashIcon} from "lucide-react";
import {toast} from "@/components/ui/use-toast.ts";
import {Input} from "@/components/ui/input.tsx";

export default () => {
    const [year, setYear] = useState(new Date().getFullYear())
    const {data} = useGetHolidays(year)
    const {setDialog} = useContext(DialogContext)
    const deleteHolidayMutation = useDeleteHoliday()


    return (
        <div>
            <Button onClick={() => setDialog(<CreateHoliday/>)}>Create Holiday</Button>
            <Input className="mt-2 mb-2 max-w-40" type="number" value={year} onChange={e => setYear(parseInt(e.target.value))}/>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data && data.map(holiday => (
                        <TableRow key={holiday.id}>
                            <TableCell>{holiday.name}</TableCell>
                            <TableCell>{holiday.date.toLocaleDateString("de")}</TableCell>
                            <TableCell>
                                <Button onClick={() => {
                                    deleteHolidayMutation.mutateAsync(holiday.id).then(() => toast({
                                        title: "Success",
                                        description: "Holiday deleted successfully."
                                    })).catch(e => toast({
                                        title: "Error",
                                        description: e.response.data.message,
                                        variant: "destructive"
                                    }))
                                }} variant="ghost"
                                        size="icon">
                                    <TrashIcon/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}