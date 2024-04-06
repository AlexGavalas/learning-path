import { getAllNotes } from '~api/notes-db';

import { updateEdgeConfig } from './edge-config';

jest.mock<typeof import('~api/notes-db')>('~api/notes-db', () => ({
    getAllNotes: jest.fn(),
    getNoteMetadata: jest.fn(),
    searchNotes: jest.fn(),
}));

describe('updateEdgeConfig', () => {
    beforeAll(() => {
        jest.mocked(getAllNotes).mockResolvedValue([]);

        process.env.EDGE_CONFIG_ID = 'test-edge-config-id';
        process.env.VERCEL_ACCESS_TOKEN = 'test-vercel-access-token';
    });

    it('calls turso.execute', async () => {
        await updateEdgeConfig();

        expect(getAllNotes).toHaveBeenCalledTimes(1);
        expect(getAllNotes).toHaveBeenCalledWith();
    });

    it('calls fetch', async () => {
        await updateEdgeConfig();

        const edgeConfig = process.env.EDGE_CONFIG_ID;
        const vercelAccessToken = process.env.VERCEL_ACCESS_TOKEN;

        const url = `https://api.vercel.com/v1/edge-config/${edgeConfig}/items`;

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url, {
            body: JSON.stringify({
                items: [
                    {
                        key: 'meta',
                        operation: 'update',
                        value: [],
                    },
                ],
            }),
            headers: {
                Authorization: `Bearer ${vercelAccessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
        });
    });
});
