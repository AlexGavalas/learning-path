import { updateMdTimestamps } from './update-md-timestamps';

updateMdTimestamps(process.argv.slice(2)).catch((e) => {
    console.error(e);
});
