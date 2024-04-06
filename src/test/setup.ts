Object.defineProperty(global, 'fetch', {
    value: jest.fn().mockImplementation(() => ({
        json: jest.fn().mockResolvedValue({}),
    })),
    writable: true,
});
