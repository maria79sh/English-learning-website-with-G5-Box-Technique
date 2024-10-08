
const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const fetchNextListening = async (token, listeningId, oqt) => {
    try {
        const url = new URL(`${API_BASE_URL}/get_next_listening`);
        url.searchParams.append('listening_id', listeningId);
        url.searchParams.append('oqt', oqt);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch next vocab');
        }

        return response.json();
    } catch (error) {
        console.error('Error in fetchNextVocab:', error);
        throw error;
    }
};
export const postListeningAnswer = async (token, qid, userAnswer) => {
    try {
        const response = await fetch(`${API_BASE_URL}/check_listening_question`, {
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
        console.error('Error in post listening Answer:', error);
        throw error;
    }
};