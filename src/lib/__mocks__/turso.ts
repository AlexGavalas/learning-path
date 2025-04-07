export const turso = {
    batch: vi.fn(),
    close: vi.fn(),
    closed: false,
    execute: vi.fn(),
    executeMultiple: vi.fn(),
    protocol: '',
    sync: vi.fn(),
    transaction: vi.fn(),
};
