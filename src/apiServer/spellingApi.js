
const API_BASE_URL = 'http://127.0.0.1:8080';

export const fetchNextSpelling = async (token, spellingId, oqt) => {
    try {
        const url = new URL(`${API_BASE_URL}/api/v1/get_next_spelling`);
        url.searchParams.append('spelling_id', spellingId);
        url.searchParams.append('oqt', oqt);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch next spelling');
        }

        return response.json();
    } catch (error) {
        console.error('Error in fetchNextSpelling:', error);
        throw error;
    }
};

export const postSpellingAnswer = async (token, qid, userAnswer) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/check_spelling_question`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                qid: qid+1,
                user_answer: userAnswer,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to post answer');
        }

        const data = await response.json();
        if (!data) {
            throw new Error('No data received');
        }

        return data;
    } catch (error) {
        console.error('Error in post spelling Answer:', error);
        throw error;
    }
};