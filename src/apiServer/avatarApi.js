
const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const fetchAvatar = async (token, writingId, oqt) => {
    try {
        const url = new URL(`${API_BASE_URL}/get_avatars`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetchNextWriting');
        }

        return response.json();
    } catch (error) {
        console.error('Error in fetchNextWriting:', error);
        throw error;
    }
};