import {useQuery} from "@tanstack/react-query";
import api from "@/api.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

interface Holiday {
    id: number;
    name: string;
    date: Date;
}

function useGetHolidays() {
    return useQuery<Holiday[]>({
        queryKey: ["holidays"],
        queryFn: async () => {
            const response = await api.get<Holiday[]>("/holiday/2024")
            return response.data
        }
    })
}

export default () => {
    const {data, isLoading, isError} = useGetHolidays()

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (isError) {
        return <p>Error</p>
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data && data.map(holiday => (
                        <TableRow key={holiday.id}>
                            <TableCell>{holiday.name}</TableCell>
                            <TableCell>{holiday.date.toLocaleDateString("de")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}