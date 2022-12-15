import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { CustomLink } from './link';

describe('<CustomLink />', () => {
    describe.each(['/', '#'])('when href is "%s"', (href) => {
        it('renders', () => {
            const { container } = render(
                <CustomLink href={href}>link</CustomLink>,
            );

            expect(container).toMatchSnapshot();
        });

        it('is accessible', async () => {
            const { container } = render(
                <CustomLink href={href}>link</CustomLink>,
            );

            const a11yResults = await axe(container);

            expect(a11yResults).toHaveNoViolations();
        });
    });

    describe.each(['', 'https://somewhere.else'])(
        'when href is "%s"',
        (href) => {
            it('renders', () => {
                const { container } = render(
                    <CustomLink href={href}>link</CustomLink>,
                );

                expect(container).toMatchSnapshot();
            });

            it('is accessible', async () => {
                const { container } = render(
                    <CustomLink href={href}>link</CustomLink>,
                );

                const a11yResults = await axe(container);

                expect(a11yResults).toHaveNoViolations();
            });
        },
    );
});
