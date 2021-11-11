import { parseISO, format } from 'date-fns';

const FormattedDate = ({ dateString }: { dateString: string }) => {
	const date = parseISO(dateString);

	return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
};

export default FormattedDate;
