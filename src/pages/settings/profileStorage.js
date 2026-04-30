const DB_NAME = "clara_settings_db";
const DB_VERSION = 1;
const STORE_NAME = "profile_settings";
const PROFILE_KEY = "primary_profile";

function openProfileDb() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* =========================
   GET PROFILE (FULL OBJECT)
========================= */
async function getProfile() {
  const db = await openProfileDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(PROFILE_KEY);

    req.onsuccess = () => {
      resolve(req.result || {});
    };

    req.onerror = () => reject(req.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/* =========================
   SAVE PROFILE (MERGE SAFE)
========================= */
async function saveProfile(partialData) {
  const db = await openProfileDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const getReq = store.get(PROFILE_KEY);

    getReq.onsuccess = () => {
      const existing = getReq.result || {};

      store.put({
        id: PROFILE_KEY,
        ...existing,
        ...partialData,
        updatedAt: new Date().toISOString(),
      });
    };

    getReq.onerror = () => reject(getReq.error);

    tx.oncomplete = () => {
      db.close();
      resolve(true);
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/* =========================
   NAME
========================= */
export async function getStoredProfileName() {
  const profile = await getProfile();
  return profile.name || "";
}

export async function saveStoredProfileName(name) {
  return saveProfile({ name });
}

/* =========================
   AVATAR
========================= */
export async function getStoredProfileAvatar() {
  const profile = await getProfile();
  return profile.avatar || null;
}

export async function saveStoredProfileAvatar(avatar) {
  return saveProfile({ avatar });
}
