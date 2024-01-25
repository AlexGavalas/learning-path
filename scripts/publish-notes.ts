import ora from 'ora';
import { type SimpleGit, simpleGit } from 'simple-git';

const main = async (): Promise<void> => {
    const git: SimpleGit = simpleGit({});

    const spinner = ora('Adding content').start();

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

main().catch(console.error);
