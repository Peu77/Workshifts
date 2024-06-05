import {useQuery} from "@tanstack/react-query";
import api from "@/api.ts";
import {Oval} from "react-loader-spinner";
import ShiftDay from "@/app/shiftDay.tsx";


const App = () => {
    const {data, isLoading, isError} = useQuery<{
        name: string,
        email: string
    }>({
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

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",]

    return (
        <>
            <div className="space-y-4">
                <h1>Welcome back, {data?.name}</h1>
                <div className="flex gap-4">
                    {weekDays.map((day) => (
                        <ShiftDay name={day} date={new Date()} shifts={[]}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default App