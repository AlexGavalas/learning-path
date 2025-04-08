import { readFile, writeFile } from './helpers';
import { updateMdTimestamps } from './update-md-timestamps';

vi.mock('./helpers');

describe('updateMdTimestamps', () => {
    beforeAll(() => {
        vi.useFakeTimers({ now: new Date(2023, 0, 1) });
    });

    beforeEach(() => {
        vi.mocked(readFile).mockResolvedValueOnce(
            '---\ntitle: Test\n---\n\n# Test',
        );
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    describe('when a correct file is passed', () => {
        it('updates the timestamp of the passed file', async () => {
            await updateMdTimestamps(['notes/test.mdx']);

            expect(writeFile).toHaveBeenCalledTimes(1);
            expect(writeFile).toHaveBeenCalledWith(
                'notes/test.mdx',
                "---\ntitle: Test\nupdated: '2023-01-01'\n---\n\n# Test\n",
            );
        });
    });

    describe('when an incorrect file is passed', () => {
        it('does not update the timestamp of the passed file', async () => {
            await updateMdTimestamps(['incorrect-dir/test.mdx']);

            expect(writeFile).not.toHaveBeenCalled();
        });
    });
});
