(function () {
  const DB_NAME = "junho-chaebeen-admin";
  const DB_VERSION = 1;
  const STORE_NAME = "photo-edits";

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: "slot" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function readAll() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function readOne(slot) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(slot);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveRecord(record) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put({
        ...record,
        updatedAt: new Date().toISOString()
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function removeRecord(slot) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(slot);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  function imageStyle(edit) {
    if (!edit) return "";
    const zoom = Math.max(1, Number(edit.zoom) || 1);
    const x = Number(edit.x) || 0;
    const y = Number(edit.y) || 0;
    const rotation = Number(edit.rotation) || 0;
    return `transform-origin: center; transform: translate(${x}%, ${y}%) scale(${zoom}) rotate(${rotation}deg);`;
  }

  async function mergePosts(basePosts) {
    let records = [];
    try {
      records = await readAll();
    } catch {
      return basePosts;
    }

    const bySlot = new Map(records.map((record) => [record.slot, record]));
    return basePosts.map((post, index) => {
      const record = bySlot.get(index);
      if (!record) return post;
      const uploadedUrl = record.blob ? URL.createObjectURL(record.blob) : null;
      return {
        ...post,
        image: uploadedUrl || post.image,
        thumb: uploadedUrl || post.thumb || post.image,
        caption: record.caption ?? post.caption,
        edit: {
          zoom: record.zoom,
          x: record.x,
          y: record.y,
          rotation: record.rotation
        }
      };
    });
  }

  window.WeddingAdminStore = {
    readAll,
    readOne,
    saveRecord,
    removeRecord,
    imageStyle,
    mergePosts
  };
})();
