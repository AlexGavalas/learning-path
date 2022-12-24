import { format as formatDate, utcToZonedTime, toDate } from 'date-fns-tz';

interface DateProps {
    dateString: string;
    format?: string;
}

export const FormattedDate = ({
    dateString,
    format = 'd LLL yyyy',
}: DateProps) => {
    const date = utcToZonedTime(toDate(dateString), 'Europe/Athens');

    return (
        <time dateTime={date.toISOString()}>{formatDate(date, format)}</time>
    );
};
