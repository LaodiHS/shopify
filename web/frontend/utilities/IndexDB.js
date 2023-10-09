export const IndexedSessionStorage = {
  db: null,
  dbName: "IndexedSessionStorageDB",
  storeName: "IndexedSessionStorageStore",

  init: async function () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        this.db.createObjectStore(this.storeName, { keyPath: "key" });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        if (event.target.error.name === "QuotaExceededError") {
          console.error("Quota exceeded. Clear some data to continue.");
        } else {
          console.error("Error:", event.target.error);
        }
        reject(event.target.error); // Reject the promise on error
      };
    });
  },

  setItem: async function (key, value) {
    const transaction = this.db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);
    const request = store.put({ key, value });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };

      transaction.onabort = (event) => {
        console.error("Transaction aborted:", event.target.error);
        reject(event.target.error);
      };
    });
  },

  getItem: async function (key) {
    const transaction = this.db.transaction([this.storeName], "readonly");
    const store = transaction.objectStore(this.storeName);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve(result.value);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  removeItem: async function (key) {
    const transaction = this.db.transaction([this.storeName], "readwrite");
    const store = transaction.objectStore(this.storeName);
    const request = store.delete(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  clear: async function () {
    const transaction = this.db.transaction([this.storeName], "readwrite");

    return new Promise((resolve, reject) => {
      transaction.onabort = (event) => {
        console.error("Transaction aborted:", event.target.error);
        reject(event.target.error);
      };

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
        reject(event.target.error);
      };

      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  waitForPendingOperations: async function () {
    return new Promise((resolve) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);

      // Perform a dummy operation that requires a transaction
      const request = store.get("dummyKey");

      request.onsuccess = () => {
        resolve();
      };

      // Handle any errors that might occur during the dummy operation
      request.onerror = (event) => {
        console.error("Error:", event.target.error);
        resolve(); // Resolve the promise even if an error occurs
      };
    });
  },

  close: async function () {
    if (this.db) {
      await waitForPendingOperations(); // Implement this function to wait for any pending operations to complete
      try {
        this.db.close();
      } catch (error) {
        console.error("Error closing the database:", error);
      } finally {
        this.db = null; // Set db to null to indicate it's closed
      }
    }
  },
};



export function IndexDB() {
  
  return { startIndexDB, stopIndexDB, db: null };

  async function startIndexDB() { 
    await IndexedSessionStorage.init();
    const db = IndexedSessionStorage;
    this.db = IndexedSessionStorage;
    return db;
  }
  async function stopIndexDB() {
    if(this.db){
    await db.close();
    }
  }
}

const indexDb = IndexDB();
export { indexDb };

// Usage:

//   async function main() {
//     await IndexedSessionStorage.init();

//     await IndexedSessionStorage.setItem("key1", "value1");
//     const value = await IndexedSessionStorage.getItem("key1");
//     console.log(value);

//     await IndexedSessionStorage.removeItem("key1");

//     IndexedSessionStorage.close();
//   }

//   main();
