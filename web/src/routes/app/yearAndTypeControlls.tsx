import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useSearchParams} from "react-router-dom";
import {Switch} from "@/components/ui/switch.tsx";

export default () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const timeRange = searchParams.get("timeRange") || "1"
    const year = searchParams.get("year") || ""
    const weekend = searchParams.get("weekend") || "false"


    function setTimeRange(value: string) {
        setSearchParams(prev => {
            prev.set("timeRange", value)
            return prev;
        })
    }

    function setYear(value: string) {
        setSearchParams(prev => {
            prev.set("year", value)
            return prev;
        })
    }

    function setWeekend(value: string) {
        setSearchParams(prev => {
            prev.set("weekend", value)
            return prev;
        })
    }

    return (
        <>
            <Select onValueChange={setTimeRange} value={timeRange}>
                <p>Weekend</p>
                <Switch checked={weekend === "true"} onCheckedChange={e => setWeekend(e.toString())}/>

                <SelectTrigger className="max-w-[160px]">
                    <SelectValue placeholder="select time range"/>
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="1">Week</SelectItem>
                        <SelectItem value="2">Month</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Input value={parseInt(year)} onChange={e => setYear(e.target.value)} type="number"
                   className="max-w-[140px]"/>
        </>
    )
}