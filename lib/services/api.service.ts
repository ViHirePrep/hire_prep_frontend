import type { FetchOptions } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private buildUrl(endpoint: string, params?: Record<string, string>): URL {
        const url = new URL(`${this.baseUrl}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        return url;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: 'An error occurred',
            }));

            throw new Error(error.message ?? `HTTP ${response.status}`);
        }

        return response.json();
    }

    async request<T = any>(
        endpoint: string,
        options: FetchOptions = {},
    ): Promise<T> {
        const { params, ...fetchOptions } = options;
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url.toString(), {
            ...fetchOptions,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
            },
        });

        return this.handleResponse<T>(response);
    }

    get<T = any>(endpoint: string, options?: FetchOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T = any>(
        endpoint: string,
        body?: any,
        options?: FetchOptions,
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T = any>(
        endpoint: string,
        body?: any,
        options?: FetchOptions,
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T = any>(endpoint: string, options?: FetchOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiService = new ApiClient(API_BASE_URL);
