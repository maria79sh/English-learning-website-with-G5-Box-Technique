export const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        alert('زمان شما منقضی شد. لطفا دوباره وارد شوید');
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return response.json();
};



