import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (refreshToken) {
                config.headers.refreshtoken = refreshToken;
            }
        }
        return config;
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
                
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/refresh-token`, {}, {
                    headers: { refreshtoken: refreshToken }
                });

                if (res.status === 200) {
                    const { accessToken, refreshToken: newRefreshToken } = res.data;
                    
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const register = async (data: any) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
};

export const login = async (data: any) => {
    const response = await axiosInstance.post('/login', data);
    return response.data;
};

export const dashboard = async () => {
    const response = await axiosInstance.post('/dashboard', {});
    return response.data;
};

export const createOrder = async (productId: string) => {
    const response = await axiosInstance.post('/create-order', { productId });
    return response.data;
};

export const verifyPayment = async (paymentData: any) => {
    const response = await axiosInstance.post('/verify-payment', paymentData);
    return response.data;
};

export const getProducts = async () => {
    const response = await axiosInstance.post('/products', {});
    return response.data;
};
