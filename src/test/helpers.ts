export const getTimeZone = (): string => {
    const timeZone = process.env.TZ;

    if (!timeZone) {
        throw new Error('Timezone has not been defined! Set env var TZ!');
    }

    return timeZone;
};
