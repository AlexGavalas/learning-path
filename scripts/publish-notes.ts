import { type SimpleGit, simpleGit } from 'simple-git';

const main = async (): Promise<void> => {
    const git: SimpleGit = simpleGit({});

    await git.add('src/content/notes');

    await git.commit('content: updates notes');

    await git.push();
};

main().catch(console.error);
