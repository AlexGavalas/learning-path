import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { FormattedDate } from './formatted-date';

const mockDate = new Date('2022-01-01');
const mockDateISO = mockDate.toISOString();

describe('<FormattedDate />', () => {
    it('renders', () => {
        const { container } = render(
            <FormattedDate dateString={mockDateISO} />,
        );

        expect(container).toMatchSnapshot();
    });

    it('is accessible', async () => {
        const { container } = render(
            <FormattedDate dateString={mockDateISO} />,
        );

        const a11yResults = await axe(container);

        expect(a11yResults).toHaveNoViolations();
    });

    it('uses the passed format', () => {
        render(<FormattedDate dateString={mockDateISO} format="dd/MM/yyyy" />);

        expect(screen.getByText('01/01/2022')).toBeInTheDocument();
    });
});
