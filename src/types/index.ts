export interface UserClearance {
  registerNumber: string;
  verifiedAt: string;
  safetyScore: number;
  threatLevel: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
  leaksFound: number;
  twoFactorStatus: 'Active' | 'Recommended';
  keyHealth: 'Optimal' | 'Standard' | 'Vulnerable';
}

export interface ThreatVector {
  id: string;
  title: string;
  category: 'Web Security' | 'Blue Team & Network' | 'Cryptography' | 'Social Eng & OSINT';
  severity: 'High' | 'Critical' | 'Severe';
  summary: string;
  attackMechanism: string;
  realWorldImpact: string;
  defensiveShield: string[];
  actionProtocol: string;
}

export interface SecurityModule {
  id: string;
  number: string;
  title: string;
  readTime: string;
  category: 'Web Security' | 'Blue Team Defense' | 'OSINT & Recon' | 'Cryptography' | 'Ethical Hacking' | 'Network Security';
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  summary: string;
  keyConcepts: string[];
  simulationType?: string;
  stages: {
    stageTitle: string;
    description: string;
    threatIllustration: string;
    protectionRule: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface PortScanResult {
  port: number;
  service: string;
  state: 'Open' | 'Filtered' | 'Closed';
  banner: string;
  cveWarning?: string;
  hardeningRecommendation: string;
}

export interface SiemLogEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'HTTPS' | 'SSH' | 'DNS';
  action: 'ALLOWED' | 'BLOCKED' | 'FLAGGED';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  ruleTriggered: string;
}
