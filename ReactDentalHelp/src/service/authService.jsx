export const parseJwt = (token) => {
    if (!token) {
        return null;
    }

    try {
        const base64Url = token.split('.')[1];  // Extrage partea payload a token-ului
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  // Înlocuiește caracterele specifice URL-urilor
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);  // Parsează payload-ul în format JSON
    } catch (error) {
        console.error("Error decoding JWT", error);
        return null;
    }
};
