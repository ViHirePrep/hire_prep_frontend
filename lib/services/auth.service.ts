import { apiService } from './api.service';
import { storageService } from './storage.service';

import type { User } from '../types';

class AuthService {
    private static USER_KEY = 'user';

    getCurrentUser(): User | null {
        return storageService.getJSON<User>(AuthService.USER_KEY);
    }

    setCurrentUser(user: User): void {
        storageService.setJSON(AuthService.USER_KEY, user);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
        }
    }

    clearCurrentUser(): void {
        storageService.remove(AuthService.USER_KEY);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
        }
    }

    async logout(): Promise<void> {
        try {
            await apiService.get('/auth/logout');
        } catch {
            return;
        } finally {
            this.clearCurrentUser();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }
}

export const authService = new AuthService();
