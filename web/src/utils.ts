export function getWeekOfYear(date: Date) {
    var dateCopy = new Date(date.getTime());
    dateCopy.setHours(0, 0, 0, 0);
    dateCopy.setDate(dateCopy.getDate() + 3 - (dateCopy.getDay() + 6) % 7);
    const week1 = new Date(dateCopy.getFullYear(), 0, 4);
    return Math.round(((dateCopy.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}