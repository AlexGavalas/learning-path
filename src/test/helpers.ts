import { render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export * from '@testing-library/react';

type RenderParams = Parameters<typeof render>;
type RenderHookParams = Parameters<typeof renderHook>;

export const renderWithUser = (...props: RenderParams) => ({
    user: userEvent.setup(),
    ...render(...props),
});

export const renderHookWithUser = (...props: RenderHookParams) => ({
    user: userEvent.setup(),
    ...renderHook(...props),
});
