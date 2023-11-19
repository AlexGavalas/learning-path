import axios from 'axios';

import { fetchFileFromStorage } from './helpers';

jest.mock<typeof import('axios')>('axios');

describe('fetchFileFromStorage', () => {
    beforeAll(() => {
        jest.mocked(axios.get).mockResolvedValue({ data: 'test' });

        process.env.PUBLIC_FILE_SERVER_URL =
            'http://localhost:3000/file-server';
    });

    it('calls axios.get', async () => {
        await fetchFileFromStorage('test');

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:3000/file-server/test',
            { responseType: 'text' },
        );
    });

    it('returns the response data', async () => {
        const file = await fetchFileFromStorage('test');

        expect(file).toBe('test');
    });
});
