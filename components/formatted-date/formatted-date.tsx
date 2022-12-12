import { parseISO, format as formatDate } from 'date-fns';

interface DateProps {
    dateString: string;
    format?: string;
}

export const FormattedDate = ({
    dateString,
    format = 'd LLL yyyy',
}: DateProps) => {
    const date = parseISO(dateString);

    return <time dateTime={dateString}>{formatDate(date, format)}</time>;
};
