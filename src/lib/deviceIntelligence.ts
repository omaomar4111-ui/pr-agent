/**
 * Device Fingerprinting & Purchasing Power Profiling Engine
 * 
 * Detects visitor device details (iPhone Pro Max, Samsung Ultra, Mac, Windows, etc.)
 * and calculates estimated purchasing power tier (VIP Luxury, High, Medium, Standard)
 * to help merchants prioritize high-ticket real estate and e-commerce leads.
 */

export interface DeviceTelemetry {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  model: string;
  os: string;
  browser: string;
  screenResolution: string;
  purchasingPowerTier: 'VIP_LUXURY' | 'HIGH' | 'MEDIUM' | 'STANDARD';
  purchasingPowerLabel: string;
  confidence: number;
  timestamp: string;
}

export function detectDeviceIntelligence(userAgent: string, screenWidth?: number, screenHeight?: number): DeviceTelemetry {
  const ua = userAgent || '';
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  let model = 'Unknown Device';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let purchasingPowerTier: 'VIP_LUXURY' | 'HIGH' | 'MEDIUM' | 'STANDARD' = 'MEDIUM';
  let purchasingPowerLabel = 'مستوى متوسط';
  let confidence = 0.85;

  // OS Detection
  if (/iPhone/i.test(ua)) {
    deviceType = 'mobile';
    os = 'iOS';
    // Differentiate High-End iPhones
    if (screenWidth && screenWidth >= 428 || (screenHeight && screenHeight >= 926)) {
      model = 'iPhone Pro Max / Plus Series';
      purchasingPowerTier = 'VIP_LUXURY';
      purchasingPowerLabel = 'فئة VIP فائقة (iPhone Pro Max)';
      confidence = 0.95;
    } else if (screenWidth && screenWidth >= 390) {
      model = 'iPhone Pro / Standard Flagship';
      purchasingPowerTier = 'HIGH';
      purchasingPowerLabel = 'قدرة شرائية مرتفعة (iPhone Pro)';
      confidence = 0.92;
    } else {
      model = 'Apple iPhone';
      purchasingPowerTier = 'HIGH';
      purchasingPowerLabel = 'قدرة شرائية جيدة (iPhone)';
    }
  } else if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && typeof navigator !== 'undefined' && (navigator as any).maxTouchPoints > 1)) {
    deviceType = 'tablet';
    os = 'iPadOS';
    model = 'Apple iPad';
    purchasingPowerTier = 'HIGH';
    purchasingPowerLabel = 'قدرة شرائية مرتفعة (iPad)';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    deviceType = 'desktop';
    os = 'macOS';
    model = 'Apple Mac (MacBook / iMac)';
    purchasingPowerTier = 'VIP_LUXURY';
    purchasingPowerLabel = 'فئة رجال أعمال / VIP (MacBook)';
    confidence = 0.94;
  } else if (/Android/i.test(ua)) {
    deviceType = 'mobile';
    os = 'Android';
    if (/SM-S9|SM-G9|Ultra|Fold|Flip/i.test(ua)) {
      model = 'Samsung Galaxy S-Ultra / Foldable Flagship';
      purchasingPowerTier = 'VIP_LUXURY';
      purchasingPowerLabel = 'فئة VIP (Galaxy Ultra / Fold)';
      confidence = 0.92;
    } else if (/Pixel|Galaxy|Xiaomi|OPPO|OnePlus/i.test(ua)) {
      model = 'Android Flagship / Mid-range';
      purchasingPowerTier = 'MEDIUM';
      purchasingPowerLabel = 'قدرة شرائية متوسطة';
    } else {
      model = 'Android Device';
      purchasingPowerTier = 'STANDARD';
      purchasingPowerLabel = 'قدرة شرائية قياسية';
    }
  } else if (/Windows/i.test(ua)) {
    deviceType = 'desktop';
    os = 'Windows';
    model = 'Windows PC';
    purchasingPowerTier = 'MEDIUM';
    purchasingPowerLabel = 'مستخدم كمبيوتر مكتبي';
  }

  // Browser Detection
  if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edg/i.test(ua)) browser = 'Edge';

  const screenResolution = screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : 'Dynamic';

  return {
    deviceType,
    model,
    os,
    browser,
    screenResolution,
    purchasingPowerTier,
    purchasingPowerLabel,
    confidence,
    timestamp: new Date().toISOString()
  };
}
