// Secure token storage with encryption
class SecureStorage {
  private static readonly STORAGE_KEY = 'lms_secure_token';
  private static readonly ENCRYPTION_KEY = 'lms_platform_2024'; // In production, use environment variable

  // Simple encryption (in production, use proper crypto libraries)
  private static encrypt(text: string): string {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided for encryption');
    }
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result); // Base64 encode
  }

  private static decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch {
      return '';
    }
  }

  static setToken(token: string): void {
    try {
      if (!token || typeof token !== 'string') {
        console.error('Invalid token provided:', token);
        return;
      }
      
      const encrypted = this.encrypt(token);
      sessionStorage.setItem(this.STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('Failed to store token securely:', error);
    }
  }

  static getToken(): string | null {
    try {
      const encrypted = sessionStorage.getItem(this.STORAGE_KEY);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      return decrypted || null;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  static removeToken(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  static hasToken(): boolean {
    return !!this.getToken();
  }
}

export default SecureStorage;
