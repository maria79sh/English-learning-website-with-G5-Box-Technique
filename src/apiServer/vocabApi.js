

const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const fetchNextVocab = async (token, vocabId, oqt) => {
    try {
        const url = new URL(`${API_BASE_URL}/get_next_vocab`);
        url.searchParams.append('vocab_id', vocabId);
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

        console.log(response)
        return response.json();
    } catch (error) {

        console.error('Error in fetchNextVocab:', error);
        throw error; // Ensure the error is thrown so it can be caught by the calling function
    }
};
export const postVocabAnswer = async (token, qid, userAnswer) => {
    try {
        const response = await fetch(`${API_BASE_URL}/check_vocab_question`, {
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
        console.error('Error in postVocabAnswer:', error);
        throw error;
    }
};



export const fetchNextVocabAdvanced = async (token, vocabId, oqt) => {
    try {
        const url = new URL(`${API_BASE_URL}/get_next_vocab_advanced`);
        url.searchParams.append('vocab_id', vocabId);
        url.searchParams.append('oqt', oqt);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch next vocab advanced');
        }

        console.log(response)
        return response.json();
    } catch (error) {

        console.error('Error in fetchNextVocab advanced:', error);
        throw error;
    }
};
export const postVocabAnswerAdvanced = async (token, qid, userAnswer) => {
    try {
        const response = await fetch(`${API_BASE_URL}/check_vocab_question_Advanced`, {
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
            throw new Error('No data received advanced');
        }

        return data;
    } catch (error) {
        console.error('Error in postVocabAnswer advanced:', error);
        throw error;
    }
};