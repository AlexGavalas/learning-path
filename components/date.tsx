import { parseISO, format as formatDate } from 'date-fns';

interface FormattedDateProps {
    dateString: string;
    format?: string;
    className?: string;
}

const FormattedDate = ({
    dateString,
    format = 'd LLL yyyy',
    className,
}: FormattedDateProps) => {
    const date = parseISO(dateString);

    return (
        <time className={className} dateTime={dateString}>
            {formatDate(date, format)}
        </time>
    );
};

export default FormattedDate;
