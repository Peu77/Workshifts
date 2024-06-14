import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CreateHoliday} from "@/routes/admin/dialog/createHoliday.tsx";
import {useDeleteHoliday, useGetHolidays} from "@/routes/admin/holidayApi.tsx";
import {TrashIcon} from "lucide-react";
import {toast} from "@/components/ui/use-toast.ts";

export default () => {
    const {data, isLoading, isError} = useGetHolidays(new Date().getFullYear())
    const {setDialog} = useContext(DialogContext)
    const deleteHolidayMutation = useDeleteHoliday()

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (isError) {
        return <p>Error</p>
    }

    return (
        <div>
            <Button onClick={() => setDialog(<CreateHoliday/>)}>Create Holiday</Button>
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