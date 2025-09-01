/**
 * Video sürelerini formatlamak için utility fonksiyonları
 */

/**
 * Dakika cinsinden süreyi formatlar
 * @param minutes - Toplam dakika sayısı
 * @returns Formatlanmış süre string'i
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} dakika`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} saat`;
  }
  
  return `${hours} saat ${remainingMinutes} dakika`;
}

/**
 * Dakika cinsinden süreyi kısa formatta gösterir
 * @param minutes - Toplam dakika sayısı
 * @returns Kısa format string'i
 */
export function formatDurationShort(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} dk`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} sa`;
  }
  
  return `${hours} sa ${remainingMinutes} dk`;
}

/**
 * Saniye cinsinden süreyi dakika:saniye formatında gösterir
 * @param seconds - Toplam saniye sayısı
 * @returns MM:SS formatında string
 */
export function formatDurationMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Saniye cinsinden süreyi saat:dakika:saniye formatında gösterir
 * @param seconds - Toplam saniye sayısı
 * @returns HH:MM:SS formatında string
 */
export function formatDurationHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
