import {TimeRangeComponentProps} from "@/routes/app/App.tsx";
import {useEffect, useMemo} from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {StepBackIcon, StepForwardIcon} from "lucide-react";
import {getWeekOfYear} from "@/utils.ts";
import {useSearchParams} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;
import YearAndTypeControlls from "@/routes/app/yearAndTypeControlls.tsx";


export default (props: TimeRangeComponentProps) => {
    const today = new Date()
    const [searchParams, setSearchParams] = useSearchParams();
    const week = searchParams.get("week") || getWeekOfYear(today).toString()
    const year = searchParams.get("year") || today.getFullYear().toString()

    useEffect(() => {
        if (searchParams.get("timeRange") !== "1")
            setSearchParams(prev => {
                prev.set("timeRange", "1")
                return prev;
            })
    }, [input]);


    function setWeek(value: string) {
        setSearchParams(prev => {
            prev.set("week", value)
            return prev;
        })
    }

    function setYear(value: string) {
        setSearchParams(prev => {
            prev.set("year", value)
            return prev;
        })
    }

    function setToday() {
        setSearchParams(prev => {
            prev.set("week", getWeekOfYear(today).toString())
            prev.set("year", today.getFullYear().toString())
            return prev;
        })
    }

    const weekDays = useMemo(() => {
        let newDays: { name: string, date: Date }[] = []
        const startOfYear = new Date(parseInt(year), 0, 1)
        const startOfWeek = new Date(startOfYear.setDate(startOfYear.getDate() + (parseInt(week) * 7)))

        // Adjust the startOfWeek to be Monday
        const dayOfWeek = startOfWeek.getDay();
        const startOfWeekAdjusted = dayOfWeek === 0 ? new Date(startOfWeek.setDate(startOfWeek.getDate() - 6)) :
            dayOfWeek === 1 ? startOfWeek : new Date(startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1));

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeekAdjusted.getFullYear(), startOfWeekAdjusted.getMonth(), startOfWeekAdjusted.getDate() + i)
            newDays.push({
                name: date.toLocaleDateString('de', {weekday: 'short'}),
                date: date
            })
        }

        if (searchParams.get("weekend") === "true") {
            return newDays
        }

        return newDays.filter(day => day.name !== "Sa" && day.name !== "So")
    }, [week, year, searchParams]);

    function stepWeek(forward: boolean) {
        const newWeek = parseInt(week)
        if (forward) {
            if (newWeek === 51) {
                setWeek("0")
                setYear((parseInt(year) + 1).toString())
                return
            }

            setWeek((newWeek + 1).toString())
            return
        }

        if (newWeek === 0) {
            setWeek("51")
            setYear((parseInt(year) - 1).toString())
            return
        }

        setWeek((newWeek - 1).toString())
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 items-center">
                <YearAndTypeControlls/>

                <Select value={week} onValueChange={setWeek}>
                    <SelectTrigger className="max-w-[160px]">
                        <SelectValue placeholder="select week"/>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            {[...Array(52).keys()].map((week) => (
                                <SelectItem key={week} value={week.toString()}>{week + 1}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button size="icon" onClick={() => stepWeek(false)}>
                    <StepBackIcon/>
                </Button>

                <Button size="icon" onClick={() => stepWeek(true)}>
                    <StepForwardIcon/>
                </Button>

                <Button onClick={setToday}>Today</Button>
            </div>


            <div className="flex gap-4 flex-wrap items-start ">
                {props.render(weekDays)}
            </div>
        </div>
    )
}