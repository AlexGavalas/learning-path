import {
    type RenderHookResult,
    type RenderResult,
    render,
    renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

export * from '@testing-library/react';

type RenderParams = Parameters<typeof render>;
type RenderHookParams = Parameters<typeof renderHook>;

type User = UserEvent;

export const renderWithUser = (
    ...props: RenderParams
): { user: User } & RenderResult => ({
    user: userEvent.setup(),
    ...render(...props),
});

export const renderHookWithUser = (
    ...props: RenderHookParams
): { user: User } & RenderHookResult<any, any> => ({
    user: userEvent.setup(),
    ...renderHook(...props),
});

export const getTimeZone = (): string => {
    const timeZone = process.env.TZ;

    if (timeZone === undefined) {
        throw new Error('Timezone has not been defined! Set env var TZ!');
    }

    return timeZone;
};
