import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import api from "@/api.ts";
import {useToast} from "@/components/ui/use-toast.ts";

const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
})

const Login = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })
    const {toast} = useToast()

    function onSubmit(data: z.infer<typeof formSchema>) {
        api.post("/user/login", data).then(() => {
            toast({
                title: "Login successful",
                description: "You have been logged in.",
            })
        }).catch((err) => {
            toast({
                title: "Login failed",
                description: err.response.data.message,
                variant: "destructive"
            })
        })
    }

    return (
        <div className="fixed left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>Sign in to your account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField control={form.control}
                                       name="password"
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel>Password</FormLabel>
                                               <FormControl>
                                                   <Input type="password" placeholder="********" {...field} />
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}/>

                        </CardContent>
                        <CardFooter>
                            <Button className=" w-full" type="submit">Login</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    )
}

export default Login