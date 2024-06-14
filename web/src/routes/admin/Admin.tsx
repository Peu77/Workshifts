import api from "@/api.ts";
import {Oval} from "react-loader-spinner";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useToast} from "@/components/ui/use-toast.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Shifts} from "@/routes/admin/shifts.tsx";
import {Users} from "@/routes/admin/users.tsx";
import {Button} from "@/components/ui/button.tsx";
import Holidays from "@/routes/admin/holidays.tsx";

export const Admin = () => {
    const {data, isLoading, isError} = useQuery<{
        name: string,
        email: string,
        role: "admin" | "user"
    }>({
        queryKey: ["me"],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300))
            const response = await api.get("/user/me")
            return response.data
        }
    })

    const navigate = useNavigate()
    const {toast} = useToast()

    if (isLoading) {
        return <Oval
            visible={true}
            height="80"
            width="80"
            color="#993129"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass="fixed left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
        />
    }

    if (isError || !data)
        return <h1>Error</h1>

    if (data.role !== "admin") {
        toast({
            title: "Unauthorized",
            description: "You do not have permission to access this page.",
            variant: "destructive"
        })
        navigate("/app")
    }

    return (
        <div className="p-2">
            <Button onClick={() => navigate("/app")}>App</Button>
            <div className="flex gap-4 p-4 flex-wrap flex">
                <Card className="min-w-[400px] flex-grow">
                    <CardHeader>
                        <CardTitle>Shifts</CardTitle>
                        <CardDescription>Manage shifts</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Shifts/>
                    </CardContent>
                </Card>

                <Card className="min-w-[400px] flex-grow">
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage users and roles</CardDescription>

                        <CardContent>
                            <Users/>
                        </CardContent>
                    </CardHeader>
                </Card>

                <Card className="min-w-[400px] flex-grow">
                    <CardHeader>
                        <CardTitle>Holidays</CardTitle>
                        <CardDescription>Manage holidays</CardDescription>

                        <CardContent>
                            <Holidays/>
                        </CardContent>
                    </CardHeader>
                </Card>


            </div>
        </div>
    )
}