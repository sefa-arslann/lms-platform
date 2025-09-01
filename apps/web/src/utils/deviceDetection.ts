export interface DeviceInfo {
  platform: string;
  model: string;
  ip: string;
  userAgent: string;
  installId: string;
}

export function getDeviceInfo(): DeviceInfo {
  // Get user agent
  const userAgent = navigator.userAgent;
  
  // Detect platform more accurately
  let platform = 'Unknown';
  let model = 'Unknown';
  
  if (userAgent.includes('Macintosh')) {
    platform = 'MacIntel';
    model = 'Mac';
  } else if (userAgent.includes('Windows')) {
    platform = 'Win32';
    model = 'Windows';
  } else if (userAgent.includes('Linux')) {
    platform = 'Linux x86_64';
    model = 'Linux';
  } else if (userAgent.includes('Android')) {
    platform = 'Android';
    model = 'Android';
  } else if (userAgent.includes('iPhone')) {
    platform = 'iPhone';
    model = 'iPhone';
  } else if (userAgent.includes('iPad')) {
    platform = 'iPad';
    model = 'iPad';
  }
  
  // Generate unique install ID - use localStorage to persist
  let installId = localStorage.getItem('device_install_id');
  if (!installId) {
    installId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('device_install_id', installId);
  }
  
  // For now, we'll use a placeholder IP since we can't get the real IP from frontend
  // In production, this should come from the backend or a service like ipify
  const ip = '127.0.0.1'; // Placeholder
  
  return {
    platform,
    model,
    ip,
    userAgent,
    installId
  };
}
