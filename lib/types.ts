export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}
