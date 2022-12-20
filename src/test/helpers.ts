import type { ReactElement } from 'react';
import {
    render,
    renderHook,
    RenderOptions,
    RenderHookOptions,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export * from '@testing-library/react';

export const renderWithUser = (ui: ReactElement, options?: RenderOptions) => ({
    user: userEvent.setup(),
    ...render(ui, options),
});

export const renderHookWithUser = <Result>(
    render: (p: unknown) => Result,
    options?: RenderHookOptions<Result>,
) => ({
    user: userEvent.setup(),
    ...renderHook(render, options),
});
