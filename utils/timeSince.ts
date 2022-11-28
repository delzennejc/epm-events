import { format, endOfISOWeek } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function timeSince(date: any) {
  const now = new Date()

    /* @ts-ignore */
    let seconds = Math.floor((now - new Date(`${date}Z`)) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + "y ago";
    }
    interval = seconds / 604800;
    if (interval > 1) {
      return Math.floor(interval) + "w ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m ago";
    }
    return Math.floor(seconds) + "s ago";
  }

export function addDays (currDate: Date, days: number) {
    let date = new Date(currDate);
    date.setDate(date.getDate() + days);
    return date;
}

export function getDates(startDate: Date, stopDate: Date, wordCounts: { [key: string]: number }) {
    let dateArray: any[][] = [[], [], [], [], [], [], []];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      const dateNow = new Date (currentDate)
      const day = dateNow.getDay()
      const date = format(dateNow, 'MM/dd/yyyy')
      dateArray[day].push({
        day: format(dateNow, 'EEE'),
        month: format(dateNow, 'LLL'),
        year: format(dateNow, 'yyyy'),
        count: wordCounts[date] || 0,
        date: date,
      });
      currentDate = addDays(currentDate, 1)
    }
    return dateArray;
}