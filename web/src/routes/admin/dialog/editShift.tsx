import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {number, z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormField, FormItem, Form, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useContext} from "react";
import {DialogContext} from "@/provider/DialogProvider.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import {getFormatedTime, Shift, ShiftDto, useUpdateShift} from "@/routes/admin/shiftsApi.ts";
import {Switch} from "@/components/ui/switch.tsx";

const formSchema = z.object({
    name: z.string().min(3),
    startTime: z.string().time(),
    endTime: z.string().time(),
    minEmployees: number(),
    wholeDay: z.boolean().default(false)
})


export const EditShift = (shift: Shift) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: shift.name,
            startTime: getFormatedTime(shift.startTime) + ":00",
            endTime: getFormatedTime(shift.endTime) + ":00",
            minEmployees: shift.minEmployees,
            wholeDay: shift.wholeDay
        }
    })

    console.log(shift)

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
            endTime: parseTime(data.endTime),
            wholeDay: data.wholeDay
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

    const wholeDay = form.watch("wholeDay")
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

                        <FormField control={form.control} name={"wholeDay"} render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>WholeDay</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Switch onCheckedChange={(wholeDay) => {
                                                if (wholeDay) {
                                                    form.setValue("startTime", "00:00:00")
                                                    form.setValue("endTime", "23:59:59")
                                                } else {
                                                    form.setValue("startTime", "")
                                                    form.setValue("endTime", "")
                                                }

                                                field.onChange(wholeDay)
                                            }} checked={field.value}/>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )
                        }}/>

                        {!wholeDay && (
                            <>
                                <FormField control={form.control} name={"startTime"} render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Start</FormLabel>
                                            <FormControl>
                                                <Input defaultValue={field.value} onChange={e => {
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
                                            <FormLabel>End</FormLabel>
                                            <FormControl>
                                                <Input defaultValue={field.value} onChange={e => {
                                                    field.onChange(e.target.value + ":00")
                                                }} type="time"/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }}/>
                            </>
                        )}

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