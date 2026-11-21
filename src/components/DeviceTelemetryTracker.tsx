'use client';

import { useEffect } from 'react';

export function DeviceTelemetryTracker() {
  useEffect(() => {
    // Only run on client-side once per session
    if (typeof window === 'undefined') return;

    const hasTracked = sessionStorage.getItem('pra_device_tracked');
    if (hasTracked) return;

    try {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;

      fetch('/api/telemetry/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenWidth, screenHeight })
      })
        .then((res) => res.json())
        .then(() => {
          sessionStorage.setItem('pra_device_tracked', 'true');
        })
        .catch(() => {});
    } catch (e) {
      // Non-blocking telemetry
    }
  }, []);

  return null;
}
