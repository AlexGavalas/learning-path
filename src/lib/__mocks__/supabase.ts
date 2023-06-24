export const supabase = {
    rpc: jest.fn(),
    upsert: jest.fn(),
    from: jest.fn().mockReturnValue({
        upsert: jest.fn().mockReturnValue({
            error: null,
        }),
        select: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
                error: null,
            }),
        }),
    }),
};
