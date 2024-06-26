import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormField, FormItem, Form, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {useCreateUser} from "@/routes/admin/usersApi.ts";
import {Switch} from "@/components/ui/switch.tsx";

const formSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    color: z.string().nonempty(),
    isAdmin: z.boolean().default(false),
    newPassword: z.string().min(8)
})


export const CreateUser = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const {setDialog} = useContext(DialogContext)
    const {toast} = useToast()
    const createUserMutation = useCreateUser()

    function onSubmit(data: z.infer<typeof formSchema>) {
        createUserMutation.mutateAsync({
            name: data.name,
            email: data.email,
            color: data.color,
            isAdmin: data.isAdmin,
            password: data.newPassword
        }).then(() => {
            toast({
                title: "Success",
                description: "User created successfully."
            })

            setDialog(null)
        }).catch(e => {
            toast({
                title: "Error",
                description: e.response.data.message,
                variant: "destructive"
            })

        })
    }

    return (
        <DialogContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <FormField control={form.control} name={"name"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                        <FormField control={form.control} name={"email"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>


                        <FormField control={form.control} name={"color"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="color"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                        <FormField control={form.control} name={"isAdmin"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>admin</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Switch onCheckedChange={field.onChange} checked={field.value}/>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                        <FormField control={form.control} name={"newPassword"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit">create</Button>
                    </DialogFooter>

                </form>
            </Form>
        </DialogContent>
    )
}