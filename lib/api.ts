import { authService } from './services/auth.service';

export { apiService as api } from './services/api.service';
export { storageService } from './services/storage.service';
export type { User, FetchOptions } from './types';

export function getCurrentUser() {
    return authService.getCurrentUser();
}

export async function logout() {
    return authService.logout();
}
