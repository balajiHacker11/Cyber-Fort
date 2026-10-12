import { LeaderboardUser } from '../types/ctf';
import { UserClearance } from '../types';

const ATTENDEES_STORAGE_KEY = 'cyberfort_ctf_event_attendees';

// Helper to calculate initials from full name or registration ID
export const getAvatarInitials = (name?: string | null, regId?: string | null): string => {
  if (name && typeof name === 'string') {
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return trimmed.slice(0, 2).toUpperCase();
    }
  }
  if (regId && typeof regId === 'string') {
    const trimmedId = regId.trim();
    if (trimmedId.length > 0) {
      return trimmedId.slice(-2).toUpperCase();
    }
  }
  return 'OP';
};

export const getRegisteredAttendees = (activeClearance?: UserClearance | null): LeaderboardUser[] => {
  let list: LeaderboardUser[] = [];
  try {
    const raw = localStorage.getItem(ATTENDEES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed.filter(u => u && typeof u === 'object');
      }
    }
  } catch (err) {
    console.error('Failed to load attendees from storage', err);
  }

  // If activeClearance is provided and has an identifier, register or update the attendee
  if (activeClearance) {
    const rawRegId = activeClearance.registerNumber || '';
    const rawName = activeClearance.fullName || activeClearance.registerNumber || '';
    const safeRegId = (typeof rawRegId === 'string' ? rawRegId : String(rawRegId || '')).trim();
    const safeName = (typeof rawName === 'string' ? rawName : String(rawName || '')).trim();

    if (safeRegId || safeName) {
      const finalId = safeRegId || 'OP-2024';
      const finalName = safeName || finalId;
      const existingIndex = list.findIndex(
        u => (u.registerNumber || u.id || '').toLowerCase() === finalId.toLowerCase()
      );
      const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      if (existingIndex >= 0) {
        list[existingIndex] = {
          ...list[existingIndex],
          fullName: finalName,
          username: finalName,
          registerNumber: finalId,
          avatar: getAvatarInitials(finalName, finalId),
          isCurrentUser: true,
          eventStatus: 'ATTENDING LIVE'
        };
      } else {
        const newUser: LeaderboardUser = {
          id: finalId,
          username: finalName,
          fullName: finalName,
          registerNumber: finalId,
          avatar: getAvatarInitials(finalName, finalId),
          points: 0,
          solvedIds: [],
          lastSolveAt: 'Checked In',
          affiliation: `Fortress Defense Unit [${finalId}]`,
          isCurrentUser: true,
          attendedAt: nowStr,
          eventStatus: 'ATTENDING LIVE'
        };
        list.push(newUser);
        try {
          localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(list));
        } catch {}
      }
    }
  }

  return list;
};

export const recordAttendeeLogin = (clearance?: UserClearance | null): LeaderboardUser[] => {
  if (!clearance) {
    return getRegisteredAttendees();
  }

  const currentList = getRegisteredAttendees();
  const rawRegId = clearance.registerNumber || '';
  const rawName = clearance.fullName || clearance.registerNumber || '';
  const regId = (typeof rawRegId === 'string' ? rawRegId : String(rawRegId || '')).trim() || 'OP-DEFENDER';
  const name = (typeof rawName === 'string' ? rawName : String(rawName || '')).trim() || 'Cyber Cadet';
  const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  const existingIndex = currentList.findIndex(
    u => (u.registerNumber || u.id || '').toLowerCase() === regId.toLowerCase()
  );

  let updatedList: LeaderboardUser[];
  if (existingIndex >= 0) {
    // Update existing user with latest login name and attend timestamp
    const existing = currentList[existingIndex];
    updatedList = currentList.map((u, i) => {
      if (i === existingIndex) {
        return {
          ...u,
          fullName: name,
          username: name,
          registerNumber: regId,
          avatar: getAvatarInitials(name, regId),
          attendedAt: nowStr,
          eventStatus: 'ATTENDING LIVE',
          isCurrentUser: true
        };
      }
      return { ...u, isCurrentUser: false };
    });
  } else {
    // Mark previous users as not current, add new attendee
    const prevUsers = currentList.map(u => ({ ...u, isCurrentUser: false }));
    const newAttendee: LeaderboardUser = {
      id: regId,
      username: name,
      fullName: name,
      registerNumber: regId,
      avatar: getAvatarInitials(name, regId),
      points: 0,
      solvedIds: [],
      lastSolveAt: 'Checked In',
      affiliation: `Fortress Battlegroup [${regId}]`,
      isCurrentUser: true,
      attendedAt: nowStr,
      eventStatus: 'ATTENDING LIVE'
    };
    updatedList = [...prevUsers, newAttendee];
  }

  try {
    localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {}

  return updatedList;
};

export const updateAttendeeStats = (
  regId?: string | null, 
  points: number = 0, 
  solvedIds: string[] = []
): LeaderboardUser[] => {
  const currentList = getRegisteredAttendees();
  if (!regId) return currentList;
  const cleanId = String(regId).trim();
  if (!cleanId) return currentList;

  const updatedList = currentList.map(u => {
    if ((u.registerNumber || u.id || '').toLowerCase() === cleanId.toLowerCase()) {
      return {
        ...u,
        points,
        solvedIds,
        lastSolveAt: (solvedIds.length > 0 || points > 0) ? 'Just now' : (u.lastSolveAt || 'Checked In')
      };
    }
    return u;
  });

  try {
    localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {}

  return updatedList;
};

export const registerDirectAttendee = (
  name?: string | null,
  regId?: string | null,
  initialPoints: number = 0
): LeaderboardUser[] => {
  const currentList = getRegisteredAttendees();
  const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const rawId = regId || '';
  const rawName = name || '';
  const cleanId = (typeof rawId === 'string' ? rawId : String(rawId || '')).trim().toUpperCase() || `OP-${Math.floor(1000 + Math.random() * 9000)}`;
  const cleanName = (typeof rawName === 'string' ? rawName : String(rawName || '')).trim() || cleanId;

  const existingIndex = currentList.findIndex(
    u => (u.registerNumber || u.id || '').toUpperCase() === cleanId
  );

  let updatedList: LeaderboardUser[];
  if (existingIndex >= 0) {
    updatedList = currentList.map((u, i) => {
      if (i === existingIndex) {
        return {
          ...u,
          fullName: cleanName,
          username: cleanName,
          eventStatus: 'ATTENDING LIVE',
          attendedAt: nowStr
        };
      }
      return u;
    });
  } else {
    const newMember: LeaderboardUser = {
      id: cleanId,
      username: cleanName,
      fullName: cleanName,
      registerNumber: cleanId,
      avatar: getAvatarInitials(cleanName, cleanId),
      points: initialPoints,
      solvedIds: [],
      lastSolveAt: 'Checked In',
      affiliation: `Fortress Battlegroup [${cleanId}]`,
      isCurrentUser: false,
      attendedAt: nowStr,
      eventStatus: 'ATTENDING LIVE'
    };
    updatedList = [...currentList, newMember];
  }

  try {
    localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(updatedList));
  } catch {}

  return updatedList;
};
