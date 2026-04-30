const DB_NAME = "clara_settings_db";
const DB_VERSION = 1;
const STORE_NAME = "profile";
const PROFILE_KEY = "main-profile";

function openProfileDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

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

export async function readLocalProfile() {
  const db = await openProfileDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(PROFILE_KEY);

    request.onsuccess = () => {
      resolve(request.result || null);
      db.close();
    };

    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}

export async function saveLocalProfile(profile) {
  const db = await openProfileDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const payload = {
      id: PROFILE_KEY,
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(payload);

    request.onsuccess = () => {
      resolve(payload);
      db.close();
    };

    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}
