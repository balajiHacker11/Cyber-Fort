import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

// Server-side authoritative flag registry
// In production on Vercel, flags can be overridden via environment variables:
// e.g. process.env.FLAG_SANITY_CHECK, process.env.FLAG_OSINT_GHOST_HERON, etc.
const SERVER_FLAGS: Record<string, { flag: string; points: number }> = {
  'sanity-check': {
    flag: process.env.FLAG_SANITY_CHECK || 'CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}',
    points: 100
  },
  'osint-ghost-heron': {
    flag: process.env.FLAG_OSINT_GHOST_HERON || 'CYBERFORT{0s1nt_tr4ck1ng_gh0st_h3r0n_4291}',
    points: 450
  },
  'web-jwt-confusion': {
    flag: process.env.FLAG_WEB_JWT_CONFUSION || 'CYBERFORT{jwt_k3y_c0nfus10n_rs256_t0_hs256_pwn3d}',
    points: 500
  },
  'crypto-hastad-broadcast': {
    flag: process.env.FLAG_CRYPTO_HASTAD || 'CYBERFORT{h4st4d_br04dc4st_crt_cub3_r00t_cr4ck3d}',
    points: 475
  },
  'forensics-cobalt-memory': {
    flag: process.env.FLAG_FORENSICS_COBALT || 'CYBERFORT{m3m0ry_f0r3ns1cs_c0b4lt_b34c0n_3xtr4ct3d}',
    points: 450
  },
  'rev-bytecode-vm': {
    flag: process.env.FLAG_REV_BYTECODE || 'CYBERFORT{vm_d3v1rtu4l1z3r_r3v_3ng1n33r_9981}',
    points: 475
  },
  'pwn-rop-chain': {
    flag: process.env.FLAG_PWN_ROP || 'CYBERFORT{r0p_g4dg3t_l1bc_l34k_b1n_sh_pwn3d}',
    points: 550
  },
  'cloud-aws-imds': {
    flag: process.env.FLAG_CLOUD_AWS || 'CYBERFORT{4ws_1mdsv2_ssrf_p4ssr0l3_p1v0t_8820}',
    points: 475
  },
  'net-dns-tunneling': {
    flag: process.env.FLAG_NET_DNS || 'CYBERFORT{dns_c0v3rt_tunn3l_pcap_d1ss3ct10n_5541}',
    points: 450
  }
};

/**
 * Timing-safe string comparison to mitigate side-channel timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a.trim());
    const bufB = Buffer.from(b.trim());
    if (bufA.length !== bufB.length) {
      // Dummy compare to avoid early return timing leakage
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(req: any, res: any) {
  // CORS & Methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Use POST to verify flags.'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // Keep as string
      }
    }

    const { challengeId, flag, registerNumber } = body || {};

    if (!challengeId || typeof challengeId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: challengeId is required.'
      });
    }

    if (!flag || typeof flag !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Flag input cannot be empty.'
      });
    }

    const target = SERVER_FLAGS[challengeId];
    if (!target) {
      return res.status(404).json({
        success: false,
        message: `Unknown challenge ID: "${challengeId}".`
      });
    }

    const isValid = secureCompare(flag, target.flag);

    if (isValid) {
      return res.status(200).json({
        success: true,
        message: `Correct! Flag validated for ${challengeId}.`,
        pointsAwarded: target.points,
        challengeId,
        operator: registerNumber || 'ANONYMOUS_DEFENDER',
        verifiedAt: new Date().toISOString()
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Incorrect flag. Double check payload syntax, hashes, or offsets.'
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Internal verification server error.',
      error: error?.message || 'Unknown error'
    });
  }
}
