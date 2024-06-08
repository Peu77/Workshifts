import {useQuery} from "@tanstack/react-query";
import api from "@/api.ts";
import {Oval} from "react-loader-spinner";
import ShiftDay from "@/app/shiftDay.tsx";
import {User} from "@/admin/usersApi.ts";


const App = () => {
    const {data, isLoading, isError} = useQuery<User>({
        queryKey: ["me"],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300))
            const response = await api.get("/user/me")
            return response.data
        }
    })

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
            <div className="space-y-4">
                <h1>Welcome back, {data?.name}</h1>
                <div className="flex gap-4">
                    {weekDays.map((day) => (
                        <ShiftDay name={day.name} date={day.date} admin={isAdmin}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default App