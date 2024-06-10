import {Oval} from "react-loader-spinner";
import Day from "@/app/day.tsx";
import {useGetMe} from "@/admin/usersApi.ts";
import {useGetShifts} from "@/admin/shiftsApi.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";


const App = () => {
    const {data, isLoading, isError} = useGetMe();
    const shifts = useGetShifts();
    const navigate = useNavigate();

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

    // current week days with name and date
    let weekDays: { name: string, date: Date }[] = [
        {name: "Monday", date: new Date()},
        {name: "Tuesday", date: new Date()},
        {name: "Wednesday", date: new Date()},
        {name: "Thursday", date: new Date()},
        {name: "Friday", date: new Date()},
        {name: "Saturday", date: new Date()},
        {name: "Sunday", date: new Date()},
    ]

    let today = new Date()
    let day = today.getDay()
    weekDays = weekDays.map((weekDay, index) => {
        weekDay.date.setDate(today.getDate() + index - day + 1)
        return weekDay
    })


    return (
        <>
            <div className="space-y-4 p-2">
                <h1>Welcome back, {data?.name}</h1>
                {isAdmin && <Button onClick={() => navigate("/admin")}>admin panel</Button>}
                <div className="flex gap-4 flex-wrap">
                    {weekDays.map((day) => (
                        <Day key={day.date.toISOString()} name={day.name} date={day.date} isAdmin={isAdmin} shifts={shifts.data || []}
                                  isToday={day.date.getDay() === today.getDay()}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default App