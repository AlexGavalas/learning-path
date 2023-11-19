import axios from 'axios';

export const fetchFileFromStorage = async (
    filename: string,
): Promise<string> => {
    const fileServerUrl = String(process.env.PUBLIC_FILE_SERVER_URL);

    const response = await axios.get(`${fileServerUrl}/${filename}`, {
        responseType: 'text',
    });

    return response.data as string;
};
