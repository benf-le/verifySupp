

// Generic API error handler
import {BASE_URL} from "../constant/appInfo.ts";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

// Generic fetch wrapper with error handling
export const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        // Handle different error status codes
        if (response.status === 401) {
            throw new ApiError('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.', 401);
        }

        if (response.status === 403) {
            throw new ApiError('Tài khoản không có quyền thực hiện hành động này.', 403);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(errorData.message || `Server error: ${response.status}`, response.status);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Có lỗi xảy ra khi kết nối đến server', 500);
    }
};

// Specific API methods
export const apiGet = <T>(endpoint: string, token?: string): Promise<T> =>
    apiRequest<T>(endpoint, { method: 'GET' }, token);

export const apiPost = <T>(endpoint: string, data: any, token?: string): Promise<T> =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }, token);

export const apiPut = <T>(endpoint: string, data: any, token?: string): Promise<T> =>
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }, token);

export const apiPatch = <T>(endpoint: string, data: any, token?: string): Promise<T> =>
    apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }, token);

export const apiDelete = <T>(endpoint: string, token?: string): Promise<T> =>
    apiRequest<T>(endpoint, { method: 'DELETE' }, token);
