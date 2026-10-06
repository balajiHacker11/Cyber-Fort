export type CtfDomain = 
  | 'OSINT'
  | 'Web Exploitation'
  | 'Cryptography'
  | 'Digital Forensics'
  | 'Reverse Engineering'
  | 'Binary Exploitation (Pwn)'
  | 'Cloud Security'
  | 'Network Security';

export type CtfDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';

export interface ChallengeHint {
  id: string;
  text: string;
  cost: number;
}

export interface ChallengeArtifact {
  name: string;
  type: 'code' | 'raw' | 'terminal' | 'jwt' | 'hexdump' | 'config';
  description: string;
  content: string;
}

export interface CtfChallenge {
  id: string;
  title: string;
  domain: CtfDomain;
  difficulty: CtfDifficulty;
  points: number;
  initialSolves: number;
  description: string;
  scenario: string;
  targetEnvironment?: string;
  hints: ChallengeHint[];
  artifacts: ChallengeArtifact[];
  flagFormat: string;
  flagHash: string; // SHA-256 hash of the valid flag
  tags: string[];
}

export interface LeaderboardUser {
  id: string;
  username: string;
  fullName?: string;
  registerNumber?: string;
  avatar: string;
  points: number;
  solvedIds: string[];
  lastSolveAt: string;
  affiliation: string;
  isCurrentUser?: boolean;
}

export interface CtfWriteup {
  id: string;
  challengeId: string;
  title: string;
  domain: CtfDomain;
  difficulty: CtfDifficulty;
  author: string;
  overview: string;
  vulnerabilityDeconstruction: string;
  stepByStepSolution: string[];
  proofOfConceptCode: string;
  defenseTakeaway: string;
}

export interface FlagVerificationResponse {
  success: boolean;
  message: string;
  pointsAwarded?: number;
  newScore?: number;
  challengeId?: string;
}
