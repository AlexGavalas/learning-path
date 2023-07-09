import { readFile, writeFile } from './helpers';
import { updateMdTimestamps } from './update-md-timestamps';

jest.mock('./helpers');

describe('updateMdTimestamps', () => {
    beforeAll(() => {
        jest.useFakeTimers({ now: new Date(2023, 0, 1) });
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('when a correct file is passed', () => {
        beforeAll(() => {
            jest.replaceProperty(process, 'argv', [
                'node',
                'script',
                'notes/test.mdx',
            ]);
        });

        it('updates the timestamp of the passed file', async () => {
            jest.mocked(readFile).mockResolvedValueOnce(
                '---\ntitle: Test\n---\n\n# Test',
            );

            await updateMdTimestamps();

            expect(writeFile).toHaveBeenCalledTimes(1);
            expect(writeFile).toHaveBeenCalledWith(
                'notes/test.mdx',
                "---\ntitle: Test\nupdated: '2023-01-01'\n---\n\n# Test\n",
            );
        });
    });

    describe('when an incorrect file is passed', () => {
        beforeAll(() => {
            jest.replaceProperty(process, 'argv', [
                'node',
                'script',
                'incorrect-dir/test.mdx',
            ]);
        });

        it('does not update the timestamp of the passed file', async () => {
            await updateMdTimestamps();

            expect(writeFile).not.toHaveBeenCalled();
        });
    });
});
