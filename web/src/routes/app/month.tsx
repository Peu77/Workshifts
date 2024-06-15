import {TimeRangeComponentProps} from "@/routes/app/App.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useMemo} from "react";
import {Button} from "@/components/ui/button.tsx";
import {StepBackIcon, StepForwardIcon} from "lucide-react";
import {useSearchParams} from "react-router-dom";
import YearAndTypeControlls from "@/routes/app/yearAndTypeControlls.tsx";

export default (props: TimeRangeComponentProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const month = searchParams.get("month") || new Date().getMonth().toString()
    const year = searchParams.get("year") || new Date().getFullYear().toString()
    const today = new Date()

    function setMonth(value: string) {
        setSearchParams(prev => {
            prev.set("month", value)
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
            prev.set("month", today.getMonth().toString())
            prev.set("year", today.getFullYear().toString())
            return prev;
        })
    }

    const weekDays = useMemo(() => {
        let newDays: { name: string, date: Date }[] = []

        const monthIndex = parseInt(month)
        const yearInt = parseInt(year)
        const lastDay = new Date(yearInt, monthIndex + 1, 0)
        const firstDay = new Date(yearInt, monthIndex, 1)

        // Adjust the first day to be Monday
        const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

        // fill up the first week with the last days of the previous month if the first day is not a Monday
        if (firstDayOfWeek !== 0) {
            for (let i = 0; i < firstDayOfWeek; i++) {
                const date = new Date(yearInt, monthIndex, -i);
                newDays.unshift({
                    name: date.toLocaleDateString('de', {weekday: 'short'}),
                    date: date
                });
            }
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(yearInt, monthIndex, i)
            newDays.push({
                name: date.toLocaleDateString('de', {weekday: 'short'}),
                date: date
            })
        }

        if (searchParams.get("weekend") === "true") {
            return newDays
        }

        return newDays.filter(day => day.name !== "Sa" && day.name !== "So")
    }, [month, year, searchParams]);

    function stepWeek(forward: boolean) {
        const newMonth = parseInt(month)
        if (forward) {
            if (newMonth === 11) {
                setYear((parseInt(year) + 1).toString())
                setMonth("0")
                return
            }

            setMonth((newMonth + 1).toString())
            return
        }

        if (newMonth === 0) {
            setYear((parseInt(year) - 1).toString())
            setMonth("11")
            return
        }

        setMonth((newMonth - 1).toString())
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 items-center">
                <YearAndTypeControlls/>

                <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="max-w-[160px]">
                        <SelectValue placeholder="select month"/>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="0">January</SelectItem>
                            <SelectItem value="1">February</SelectItem>
                            <SelectItem value="2">March</SelectItem>
                            <SelectItem value="3">April</SelectItem>
                            <SelectItem value="4">May</SelectItem>
                            <SelectItem value="5">June</SelectItem>
                            <SelectItem value="6">July</SelectItem>
                            <SelectItem value="7">August</SelectItem>
                            <SelectItem value="8">September</SelectItem>
                            <SelectItem value="9">October</SelectItem>
                            <SelectItem value="10">November</SelectItem>
                            <SelectItem value="11">December</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button size="icon">
                    <StepBackIcon onClick={() => stepWeek(false)}/>
                </Button>

                <Button size="icon">
                    <StepForwardIcon onClick={() => stepWeek(true)}/>
                </Button>

                <Button onClick={setToday}>Today</Button>
            </div>


            <div className="flex gap-4 flex-wrap items-start ">
                {props.render(weekDays)}
            </div>
        </div>
    )
}