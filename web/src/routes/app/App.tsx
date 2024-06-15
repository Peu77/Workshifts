import {Oval} from "react-loader-spinner";
import Day from "@/routes/app/day.tsx";
import {useGetMe} from "@/routes/admin/usersApi.ts";
import {useGetShifts} from "@/routes/admin/shiftsApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import CopyShiftDays from "@/routes/app/copyShiftDays.tsx";
import Week from "@/routes/app/week.tsx";
import Month from "@/routes/app/month.tsx";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {useContext} from "react";
import {ChangePassword} from "@/routes/app/dialog/changePassword.tsx";

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
    const year = searchParams.get("year") || ""
    const shifts = useGetShifts();
    const navigate = useNavigate();
    let today = new Date()
    const {setDialog} = useContext(DialogContext)

    if (!year) {
        setSearchParams(prev => {
            prev.set("year", today.getFullYear().toString())
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

    if (isError || !data) {
        navigate("/")
        return <h1>Error</h1>
    }


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
            <div className="p-2">
                <h1>Welcome back, {data?.name}</h1>
                <div className="flex gap-2 mt-2">
                    {isAdmin && <Button onClick={() => navigate("/admin")}>admin panel</Button>}
                    <Button onClick={() => navigate("/vacation")}>vacation</Button>
                    {isAdmin && <CopyShiftDays/>}
                    <Button onClick={() => setDialog(<ChangePassword/>)}>Change password</Button>
                    <Button variant="destructive" onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/")
                    }
                    }> logout</Button>
                </div>

                <div className="mt-10">
                    {timeRange === "1" && <Week render={renderDays}/>}
                    {timeRange === "2" && <Month render={renderDays}/>}
                </div>
            </div>
        </>
    )
}

export default App