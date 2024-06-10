import {Oval} from "react-loader-spinner";
import Day from "@/app/day.tsx";
import {useGetMe} from "@/admin/usersApi.ts";
import {useGetShifts} from "@/admin/shiftsApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useMemo, useState} from "react";


const App = () => {
    const {data, isLoading, isError} = useGetMe();
    const [timeRange, setTimeRange] = useState("1") // 1 = week, 2 = month
    const shifts = useGetShifts();
    const navigate = useNavigate();
    let today = new Date()
    const weekDays = useMemo(() => {
        let newDays: { name: string, date: Date }[] = []
        let day = today.getDay()

        if (timeRange === "2") {
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const date = new Date(today.getFullYear(), today.getMonth(), i)
                newDays.push({
                    name: date.toLocaleDateString('de', {weekday: 'long'}),
                    date: date
                })
            }

        } else {
            for (let i = 0; i < 7; i++) {
                const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - day + i)
                newDays.push({
                    name: date.toLocaleDateString('de', {weekday: 'long'}),
                    date: date
                })
            }
        }

        return newDays
    }, [timeRange]);

    if (isLoading) {
        return <Oval
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass="fixed left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
        />
    }

    if (isError || !data)
        return <h1>Error</h1>

    const isAdmin = data.role === "admin"


    return (
        <>
            <div className="space-y-4 p-2">
                <h1>Welcome back, {data?.name}</h1>
                {isAdmin && <Button onClick={() => navigate("/admin")}>admin panel</Button>}
                <Select onValueChange={setTimeRange} defaultValue="1">
                    <SelectTrigger className="max-w-[160px]">
                        <SelectValue placeholder="select time range"/>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="1">Week</SelectItem>
                            <SelectItem value="2">Month</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="flex gap-4 flex-wrap items-start">
                    {weekDays.map((day) => (
                        <Day key={day.date.toISOString()} defaultOpen={timeRange === "1"} name={day.name}
                             date={day.date} isAdmin={isAdmin}
                             shifts={shifts.data || []}
                             isToday={day.date.getFullYear() === today.getFullYear() && day.date.getMonth() === today.getMonth() && day.date.getDate() === today.getDate()}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default App