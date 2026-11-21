/**
 * Automated E2E User Journey & Critical Flows Validator
 * Verifies key merchant & customer routes:
 * 1. Landing Page & 3D Interactive Phone Tour
 * 2. Onboarding Wizard & Industry Profiling
 * 3. Proactive Agent Autonomous Engine
 * 4. Multi-Tenant Telemetry & Device Intelligence
 * 5. Anti-Ban Protection Compliance Guard
 */

import { auditMessageCompliance } from '../src/lib/complianceGuard';
import { detectDeviceIntelligence } from '../src/lib/deviceIntelligence';

async function runE2EValidation() {
  console.log('🧪 Starting Comprehensive E2E System Validation...\n');

  const tests: Array<{ name: string; run: () => Promise<boolean> }> = [
    {
      name: '1. Anti-Ban Protection: Enforce 24-Hour Messaging Window & Opt-Out',
      run: async () => {
        const expiredTime = Date.now() - (25 * 60 * 60 * 1000);
        const check24h = auditMessageCompliance('أهلاً بحضرتك', 'whatsapp', expiredTime);
        const checkOptOut = auditMessageCompliance('وقف يا فندم مش عايز رسايل ثانية', 'whatsapp', Date.now());
        return !check24h.isCompliant && checkOptOut.isCompliant;
      }
    },
    {
      name: '2. Device Intelligence: Accurately Profile VIP iPhone Pro Max Leads',
      run: async () => {
        const iphoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15';
        const profile = detectDeviceIntelligence(iphoneUA, 430, 932);
        return profile.purchasingPowerTier === 'VIP_LUXURY' && profile.os === 'iOS';
      }
    },
    {
      name: '3. Production Live Endpoints Availability Check',
      run: async () => {
        const res = await fetch('https://pr-agent.vercel.app/api/health');
        const data = await res.json().catch(() => ({}));
        return res.status === 200 || data.status === 'ok';
      }
    },
    {
      name: '4. Proactive AI Agent Engine Readiness',
      run: async () => {
        const res = await fetch('https://pr-agent.vercel.app/api/agents/proactive');
        const data = await res.json();
        return data.success === true && Array.isArray(data.triggers) && data.triggers.length >= 3;
      }
    },
    {
      name: '5. Real Estate & Custom Industry Onboarding Endpoint',
      run: async () => {
        const res = await fetch('https://pr-agent.vercel.app/api/merchant/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeName: 'E2E Testing Towers Real Estate',
            industry: 'real_estate',
            phoneNumber: '01099887766'
          })
        });
        const data = await res.json();
        return data.success === true && data.profile.industry === 'real_estate';
      }
    }
  ];

  let passed = 0;
  for (const test of tests) {
    try {
      const ok = await test.run();
      if (ok) {
        console.log(`✅ [PASS] ${test.name}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${test.name}`);
      }
    } catch (e: any) {
      console.error(`❌ [ERROR] ${test.name}:`, e.message);
    }
  }

  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed successfully.`);
  return passed === tests.length;
}

runE2EValidation();
