import {
    type RenderHookOptions,
    type RenderOptions,
    render,
    renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement } from 'react';

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
