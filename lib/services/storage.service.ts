class StorageService {
    private storage: Storage | null;

    constructor() {
        this.storage = typeof window !== 'undefined' ? localStorage : null;
    }

    get(key: string): string | null {
        return this.storage?.getItem(key) ?? null;
    }

    set(key: string, value: string): void {
        this.storage?.setItem(key, value);
    }

    remove(key: string): void {
        this.storage?.removeItem(key);
    }

    getJSON<T>(key: string): T | null {
        const value = this.get(key);

        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    setJSON<T>(key: string, value: T): void {
        this.set(key, JSON.stringify(value));
    }
}

export const storageService = new StorageService();
