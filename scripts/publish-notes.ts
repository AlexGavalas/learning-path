import ora from 'ora';
import { type SimpleGit, simpleGit } from 'simple-git';

const spinner = ora();

const main = async (): Promise<void> => {
    const git: SimpleGit = simpleGit({});

    spinner.text = 'Adding content';
    spinner.start();

    await git.add('src/content/notes');

    spinner.succeed('Added content');
    spinner.text = 'Committing content';
    spinner.start();

    await git.commit('content: updates notes');

    spinner.succeed('Committed content');
    spinner.text = 'Pushing content';
    spinner.start();

    await git.push();

    spinner.succeed('Pushed content');
};

main().catch((e) => {
    spinner.fail('Failed to publish notes');
    console.error(e);
});
