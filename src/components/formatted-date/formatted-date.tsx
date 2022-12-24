import { format as formatDate, toDate } from 'date-fns-tz';

interface DateProps {
    dateString: string;
    format?: string;
}

export const FormattedDate = ({
    dateString,
    format = 'd LLL yyyy',
}: DateProps) => {
    const date = toDate(dateString);

    return (
        <time dateTime={dateString}>
            {formatDate(date, format, { timeZone: 'Europe/Athens' })}
        </time>
    );
};
