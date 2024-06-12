import {Oval} from "react-loader-spinner";
import Day from "@/routes/app/day.tsx";
import {useGetMe} from "@/routes/admin/usersApi.ts";
import {useGetShifts} from "@/routes/admin/shiftsApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import CopyShiftDays from "@/routes/app/copyShiftDays.tsx";
import Week from "@/routes/app/week.tsx";
import Month from "@/routes/app/month.tsx";

export interface WeekDay {
    name: string,
    date: Date
}

export interface TimeRangeComponentProps {
    render: (weekDays: WeekDay[]) => JSX.Element[]
}

const App = () => {
    const {data, isLoading, isError} = useGetMe();
    const [searchParams, setSearchParams] = useSearchParams();
    const timeRange = searchParams.get("timeRange") || "1"
    const shifts = useGetShifts();
    const navigate = useNavigate();
    let today = new Date()

    function setTimeRange(value: string) {
        setSearchParams(prev => {
            prev.set("timeRange", value)
            return prev;
        })
    }

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

    const renderDays = (weekDays: WeekDay[]) => {
        return weekDays.map((day) => (
            <Day key={day.date.toISOString()} name={day.name}
                 date={day.date} isAdmin={isAdmin}
                 shifts={shifts.data || []}
                 isToday={day.date.getFullYear() === today.getFullYear() && day.date.getMonth() === today.getMonth() && day.date.getDate() === today.getDate()}/>
        ))
    }


    return (
        <>
            <div className="space-y-4 p-2">
                <h1>Welcome back, {data?.name}</h1>
                {isAdmin && (
                    <div className="flex gap-4">
                        <Button onClick={() => navigate("/vacation")}>vacation</Button>
                        <Button onClick={() => navigate("/admin")}>admin panel</Button>
                        <CopyShiftDays/>
                    </div>
                )}

                <Select onValueChange={setTimeRange} value={timeRange}>
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

                {timeRange === "1" && <Week render={renderDays}/>}
                {timeRange === "2" && <Month render={renderDays}/>}
            </div>
        </>
    )
}

export default App