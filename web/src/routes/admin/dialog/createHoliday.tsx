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
import {DatePicker} from "@/components/ui/datePicker.tsx";
import {useCreateHoliday} from "@/routes/admin/holidayApi.tsx";

const formSchema = z.object({
    name: z.string().min(3),
    date: z.string().nonempty()
})


export const CreateHoliday = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date().toISOString()
        }
    })

    const {toast} = useToast()
    const {setDialog} = useContext(DialogContext)
    const createHolidayMutation = useCreateHoliday();

    function onSubmit(data: z.infer<typeof formSchema>) {
        createHolidayMutation.mutateAsync({
            name: data.name,
            date: data.date
        }).then(() => {
            toast({
                title: "Success",
                description: "Holiday created successfully."
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
                        <DialogTitle>Create Holiday</DialogTitle>
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

                        <FormField control={form.control} name={"date"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <div>
                                            <DatePicker value={new Date(field.value)} onChange={e => {
                                                field.onChange(e.toISOString())
                                            }}/>
                                        </div>
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