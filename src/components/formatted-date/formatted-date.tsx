import { format as formatDate, toDate, utcToZonedTime } from 'date-fns-tz';

interface DateProps {
    dateString: string;
    format?: string;
    timeZone: string;
}

export const FormattedDate = ({
    dateString,
    format = 'd LLL yyyy',
    timeZone,
}: DateProps) => {
    const date = utcToZonedTime(toDate(dateString), timeZone);

    return (
        <time dateTime={date.toISOString()}>{formatDate(date, format)}</time>
    );
};
