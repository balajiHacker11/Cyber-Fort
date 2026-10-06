import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import {defineConfig} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const verifyFlagDevPlugin = () => ({
  name: 'verify-flag-dev-middleware',
  configureServer(server: any) {
    server.middlewares.use('/api/verify-flag', async (req: any, res: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const { challengeId, flag, registerNumber } = parsed || {};
            const SERVER_FLAGS: Record<string, { flag: string; points: number }> = {
              'sanity-check': { flag: process.env.FLAG_SANITY_CHECK || 'CYBERFORT{w3lc0m3_t0_th3_f0rtr3ss_2026}', points: 100 },
              'osint-ghost-heron': { flag: process.env.FLAG_OSINT_GHOST_HERON || 'CYBERFORT{0s1nt_tr4ck1ng_gh0st_h3r0n_4291}', points: 450 },
              'web-jwt-confusion': { flag: process.env.FLAG_WEB_JWT_CONFUSION || 'CYBERFORT{jwt_k3y_c0nfus10n_rs256_t0_hs256_pwn3d}', points: 500 },
              'crypto-hastad-broadcast': { flag: process.env.FLAG_CRYPTO_HASTAD || 'CYBERFORT{h4st4d_br04dc4st_crt_cub3_r00t_cr4ck3d}', points: 475 },
              'forensics-cobalt-memory': { flag: process.env.FLAG_FORENSICS_COBALT || 'CYBERFORT{m3m0ry_f0r3ns1cs_c0b4lt_b34c0n_3xtr4ct3d}', points: 450 },
              'rev-bytecode-vm': { flag: process.env.FLAG_REV_BYTECODE || 'CYBERFORT{vm_d3v1rtu4l1z3r_r3v_3ng1n33r_9981}', points: 475 },
              'pwn-rop-chain': { flag: process.env.FLAG_PWN_ROP || 'CYBERFORT{r0p_g4dg3t_l1bc_l34k_b1n_sh_pwn3d}', points: 550 },
              'cloud-aws-imds': { flag: process.env.FLAG_CLOUD_AWS || 'CYBERFORT{4ws_1mdsv2_ssrf_p4ssr0l3_p1v0t_8820}', points: 475 },
              'net-dns-tunneling': { flag: process.env.FLAG_NET_DNS || 'CYBERFORT{dns_c0v3rt_tunn3l_pcap_d1ss3ct10n_5541}', points: 450 }
            };
            const target = SERVER_FLAGS[challengeId];
            res.setHeader('Content-Type', 'application/json');
            if (target && target.flag === (flag || '').trim()) {
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: `Correct! Flag validated for ${challengeId}.`,
                pointsAwarded: target.points,
                challengeId,
                operator: registerNumber || 'ANONYMOUS_DEFENDER',
                verifiedAt: new Date().toISOString()
              }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: false,
                message: 'Incorrect flag. Double check payload syntax, hashes, or offsets.'
              }));
            }
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
          }
        });
      } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
      }
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), verifyFlagDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
