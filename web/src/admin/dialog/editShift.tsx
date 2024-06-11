import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {number, z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormField, FormItem, Form, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {getFormatedTime, Shift, ShiftDto, useUpdateShift} from "@/admin/shiftsApi";

const formSchema = z.object({
    name: z.string().min(3),
    startTime: z.string().time(),
    endTime: z.string().time(),
    minEmployees: number()
})


export const EditShift = (shift: Shift) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: shift.name,
            startTime: getFormatedTime(shift.startTime) + ":00",
            endTime: getFormatedTime(shift.endTime) + ":00",
            minEmployees: shift.minEmployees
        }
    })

    const {setDialog} = useContext(DialogContext)
    const {toast} = useToast()
    const updateShiftMutation = useUpdateShift();

    function onSubmit(data: z.infer<typeof formSchema>) {
        function parseTime(time: string): { hours: number, minutes: number } {
            const [hour, minute] = time.split(":")
            return {hours: parseInt(hour), minutes: parseInt(minute)}
        }

        const dto: ShiftDto = {
            id: shift.id,
            name: data.name.toString(),
            minEmployees: data.minEmployees,
            startTime: parseTime(data.startTime),
            endTime: parseTime(data.endTime)
        }

        updateShiftMutation.mutateAsync(dto).then(() => {
            toast({
                title: "Success",
                description: "Shift updated successfully."
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
                        <DialogTitle>Edit Shift</DialogTitle>
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

                        <FormField control={form.control} name={"startTime"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Start</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={e => {
                                            field.onChange(e.target.value + ":00")
                                        }} type="time"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                        <FormField control={form.control} name={"endTime"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>Start</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={e => {
                                            field.onChange(e.target.value + ":00")
                                        }} type="time"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                        <FormField control={form.control} name={"minEmployees"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>minEmployees</FormLabel>
                                    <FormControl>
                                        <Input {...field} onChange={e => {
                                            const parsed = parseInt(e.target.value)
                                            field.onChange(isNaN(parsed) ? "" : parsed)
                                        }} type="number"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit">edit</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}