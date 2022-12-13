export const supabase = {
    rpc: jest.fn(),
    auth: {
        onAuthStateChange: jest.fn().mockReturnValue({
            data: {
                subscription: {
                    unsubscribe: jest.fn(),
                },
            },
        }),
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    },
};
