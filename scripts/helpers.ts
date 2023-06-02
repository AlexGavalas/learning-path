import { parse } from 'date-fns';

export const toISOString = (date: string) =>
    parse(date, 'yyyy-MM-dd', new Date()).toISOString();
