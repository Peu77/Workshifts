import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormField, FormItem, Form, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {useCreateUser} from "@/admin/usersApi";

const formSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().nonempty()
})


export const CreateUser = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const {setDialog} = useContext(DialogContext)
    const {toast} = useToast()
    const createUserMutation = useCreateUser()

    function onSubmit(data: z.infer<typeof formSchema>) {
        createUserMutation.mutateAsync(data).then(() => {
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
                        <DialogTitle>Create Shift</DialogTitle>
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

                        <FormField control={form.control} name={"password"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
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