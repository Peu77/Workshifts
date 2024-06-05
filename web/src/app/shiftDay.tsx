import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import React from "react";

interface Shift {
    id: number,
    name: string,
    startTime: Date,
    endTime: Date,
}

interface ShiftDayProps {
    name: string,
    date: Date,
    shifts: Shift[]
}

const shiftDay = (props: ShiftDayProps) => {
    return (
        <Card className="w-[200px]">
            <CardHeader>
                <CardTitle>{props.name}</CardTitle>
                <CardDescription>{props.date?.toDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                {props.shifts.map((shift) => (
                    <div key={shift.id}>
                        <h3>{shift.name}</h3>
                        <p>{shift.startTime.toTimeString()} - {shift.endTime.toTimeString()}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default shiftDay