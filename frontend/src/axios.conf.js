import axios from 'axios';

const API_BASE_URL = 'http://localhost:4444';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const response = axiosInstance.interceptors.response.use(
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
            await axiosInstance.post('/graphql/refreshtoken', {
                refresh_token,
            })

            .then((res) => {
                console.log(res)

                const new_access_token = res.data.accessToken;


                // Met à jour le token d'accès dans le local storage
                localStorage.setItem('access_token', new_access_token);
                console.log('new access token: ', new_access_token)

                // Réessaye la requête initiale avec le nouveau token d'accès
                originalRequest.headers.Authorization = `Bearer ${new_access_token}`;
                return axiosInstance(originalRequest)
                    .then((res) => {
                        console.log(res)
                    })

                    .catch((err) => {
                        // console.log(err.config);
                    })

            })


        }

        // Si la réponse de l'API est une erreur autre qu'une erreur d'authentification, renvoie l'erreur telle quelle
        return Promise.reject(error);
    }
);

export default axiosInstance;
