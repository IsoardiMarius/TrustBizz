import axios from 'axios';

const API_BASE_URL = 'http://localhost:4444';

const axiosInstanceAuthRequired = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

axiosInstanceAuthRequired.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const response = axiosInstanceAuthRequired.interceptors.response.use(
    (response) => {
        // Si la réponse de l'API est réussie, renvoie la réponse telle quelle
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si la réponse de l'API est une erreur d'authentification (access token expiré, etc.)
        if (error.response.status === 401 && !originalRequest._retry) {
            // Empêche la requête initiale de se répéter
            originalRequest._retry = true;

            // Récupère un nouveau access token en utilisant le refresh token dans le local storage
            const refresh_token = localStorage.getItem('refresh_token');
            await axiosInstanceAuthRequired.post('/graphql/refreshtoken', {
                refresh_token,
            })

            .then((res) => {
                const new_access_token = res.data.accessToken;
                const new_refresh_token = res.data.refreshToken;

                // Met à jour le token d'accès dans le local storage
                localStorage.setItem('access_token', new_access_token);
                localStorage.setItem('refresh_token', new_refresh_token);

                // Réessaye la requête initiale avec le nouveau token d'accès
                originalRequest.headers.Authorization = `Bearer ${new_access_token}`;
                return axiosInstanceAuthRequired(originalRequest)
                    .then((res) => {
                        console.log(res);
                    })

                    .catch((err) => {
                        console.log(err);

                    })

            })

            .catch((err) => {
                console.log(err);
            });
        }
        // Si la réponse de l'API est une erreur autre qu'une erreur d'authentification, renvoie l'erreur telle quelle
        return Promise.reject(error);
    }
);

export default axiosInstanceAuthRequired;
