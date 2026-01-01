import { type Client } from '@libsql/client';

export const turso: Client = {
    batch: vi.fn(),
    close: vi.fn(),
    closed: false,
    execute: vi.fn(),
    executeMultiple: vi.fn(),
    migrate: vi.fn(),
    protocol: '',
    reconnect: vi.fn(),
    sync: vi.fn(),
    transaction: vi.fn(),
};
