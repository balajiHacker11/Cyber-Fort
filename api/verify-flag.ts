import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

// Server-side authoritative flag registry
// In production on Vercel, flags can be overridden via environment variables:
const SERVER_FLAGS: Record<string, { flag: string; points: number }> = {
  // 1. Web Exploitation
  'sanity-check': {
    flag: process.env.FLAG_SANITY_CHECK || 'CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}',
    points: 100
  },
  'web-jwt-confusion': {
    flag: process.env.FLAG_WEB_JWT_CONFUSION || 'CYBERFORT{jwt_k3y_c0nfus10n_rs256_t0_hs256_pwn3d}',
    points: 500
  },
  'web-nosql-blind': {
    flag: process.env.FLAG_WEB_NOSQL || 'CYBERFORT{n0sql_byp4ss_r3g3x_pwn_4021}',
    points: 350
  },
  'web-prototype-pollution': {
    flag: process.env.FLAG_WEB_PROTO || 'CYBERFORT{pr0t0typ3_p0llut10n_4dm1n_t4k30v3r_5923}',
    points: 475
  },

  // 2. OSINT
  'osint-ghost-heron': {
    flag: process.env.FLAG_OSINT_GHOST_HERON || 'CYBERFORT{0s1nt_tr4ck1ng_gh0st_h3r0n_4291}',
    points: 450
  },
  'osint-satellite-exif': {
    flag: process.env.FLAG_OSINT_EXIF || 'CYBERFORT{3x1f_gps_g30l0c4t10n_f0und_7718}',
    points: 200
  },
  'osint-darkweb-git': {
    flag: process.env.FLAG_OSINT_GIT || 'CYBERFORT{g1t_c0mm1t_l34k_s3cr3t_t0k3n_9104}',
    points: 350
  },

  // 3. Cryptography
  'crypto-hastad-broadcast': {
    flag: process.env.FLAG_CRYPTO_HASTAD || 'CYBERFORT{h4st4d_br04dc4st_crt_cub3_r00t_cr4ck3d}',
    points: 475
  },
  'crypto-weak-prng': {
    flag: process.env.FLAG_CRYPTO_PRNG || 'CYBERFORT{lcg_st4t3_cr4ck3d_prng_r3v3rs4l_3391}',
    points: 250
  },
  'crypto-padding-oracle': {
    flag: process.env.FLAG_CRYPTO_PADDING || 'CYBERFORT{cbc_p4dd1ng_0r4cl3_d3crypt3d_8471}',
    points: 425
  },

  // 4. Digital Forensics
  'forensics-cobalt-memory': {
    flag: process.env.FLAG_FORENSICS_COBALT || 'CYBERFORT{m3m0ry_f0r3ns1cs_c0b4lt_b34c0n_3xtr4ct3d}',
    points: 450
  },
  'forensics-pcap-exfil': {
    flag: process.env.FLAG_FORENSICS_PCAP || 'CYBERFORT{1cmp_p4ck3t_c0v3rt_3xf1l_c4rv3d_1209}',
    points: 250
  },
  'forensics-disk-registry': {
    flag: process.env.FLAG_FORENSICS_REG || 'CYBERFORT{s4m_h1v3_ntlm_h4sh_dum_9032}',
    points: 400
  },

  // 5. Reverse Engineering
  'rev-bytecode-vm': {
    flag: process.env.FLAG_REV_BYTECODE || 'CYBERFORT{vm_d3v1rtu4l1z3r_r3v_3ng1n33r_9981}',
    points: 475
  },
  'rev-packed-upx': {
    flag: process.env.FLAG_REV_UPX || 'CYBERFORT{upx_unp4ck_str1ngs_c4rv3d_6621}',
    points: 225
  },
  'rev-wasm-matrix': {
    flag: process.env.FLAG_REV_WASM || 'CYBERFORT{w4sm_byt3c0d3_m4tr1x_d3c0d3d_7749}',
    points: 400
  },

  // 6. Binary Exploitation (Pwn)
  'pwn-rop-chain': {
    flag: process.env.FLAG_PWN_ROP || 'CYBERFORT{r0p_g4dg3t_l1bc_l34k_b1n_sh_pwn3d}',
    points: 550
  },
  'pwn-ret2win-bof': {
    flag: process.env.FLAG_PWN_RET2WIN || 'CYBERFORT{st4ck_b0f_r3t2w1n_c4ll_succ3ss_1184}',
    points: 250
  },
  'pwn-format-string': {
    flag: process.env.FLAG_PWN_FMT || 'CYBERFORT{fmt_str1ng_m3m_l34k_st4ck_r34d_4472}',
    points: 425
  },

  // 7. Cloud Security
  'cloud-aws-imds': {
    flag: process.env.FLAG_CLOUD_AWS || 'CYBERFORT{4ws_1mdsv2_ssrf_p4ssr0l3_p1v0t_8820}',
    points: 475
  },
  'cloud-k8s-rbac-escape': {
    flag: process.env.FLAG_CLOUD_K8S || 'CYBERFORT{k8s_s3rv1c34cc0unt_rb4c_3sc4p3_6301}',
    points: 450
  },
  'cloud-gcp-signed-url': {
    flag: process.env.FLAG_CLOUD_GCP || 'CYBERFORT{gcp_v4_s1gn3d_url_p0l1cy_byp4ss_5510}',
    points: 275
  },

  // 8. Network Security
  'net-dns-tunneling': {
    flag: process.env.FLAG_NET_DNS || 'CYBERFORT{dns_c0v3rt_tunn3l_pcap_d1ss3ct10n_5541}',
    points: 450
  },
  'net-arp-spoof-pcap': {
    flag: process.env.FLAG_NET_ARP || 'CYBERFORT{4rp_sp00f_t3ln3t_cr3ds_sn1ff3d_2289}',
    points: 250
  },
  'net-wireguard-handshake': {
    flag: process.env.FLAG_NET_WIREGUARD || 'CYBERFORT{w1r3gu4rd_h4ndsh4k3_c00k13_m4c2_5890}',
    points: 375
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
