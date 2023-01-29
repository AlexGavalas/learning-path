import { axe } from 'jest-axe';

import { getTimeZone, renderWithUser, screen } from '~test/helpers';

import { FormattedDate } from './formatted-date';

const mockDate = new Date('2022-01-01');
const mockDateISO = mockDate.toISOString();
const timeZone = getTimeZone();

describe('<FormattedDate />', () => {
    it('renders', () => {
        const { container } = renderWithUser(
            <FormattedDate dateString={mockDateISO} timeZone={timeZone} />,
        );

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = renderWithUser(
            <FormattedDate dateString={mockDateISO} timeZone={timeZone} />,
        );

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });

    it('uses the passed format', () => {
        renderWithUser(
            <FormattedDate
                dateString={mockDateISO}
                format="dd/MM/yyyy"
                timeZone={timeZone}
            />,
        );

        expect(screen.getByText('01/01/2022')).toBeInTheDocument();
    });
});
