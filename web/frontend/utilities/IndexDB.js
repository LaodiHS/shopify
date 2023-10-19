export const IndexedSessionStorage = {
  db: null,
  dbName: !DEPLOYMENT_ENV ? "TEST_NEURALNECTAR" : "NeuralNectarPrivacySecured",
  storeName: !DEPLOYMENT_ENV
    ? "TEST_NEURALNECTAR"
    : "NeuralNectarPrivacySecured",

  init: async function () {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        this.db.createObjectStore(this.storeName, { keyPath: "key" });
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        this.db=db;
        resolve(this);
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
    if (this.db === null) {
      throw new Error("dataBase is not started");
    }
    if (!key) {
      throw new Error("no key provided", key);
    }
    if (!value) {
      throw new Error("no value provided", value);
    }
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
    if (this.db === null) {
      throw new Error("dataBase is not started");
    }
    if (!key) {
      throw new Error("no key provided", key);
    }
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
    if (this.db === null) {
      throw new Error("dataBase is not started");
    }
    if (!key) {
      throw new Error("no key provided", key);
    }
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
    if (this.db === null) {
      throw new Error("dataBase is not started");
    }
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
  hasItem: async function (key) {
    if (this.db === null) {
      throw new Error("dataBase is not started");
    }
    if (!key) {
      throw new Error("no key provided", key);
    }
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = (event) => {
        const result = event.target.result;
        resolve(result !== undefined); // Resolve with true if key exists, false otherwise
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  },

  waitForPendingOperations: async function () {
    if (this.db === null) {
      throw new Error("dataBase is not started");
    }
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

function IndexDB() {
  async function startIndexDB() {
   const db = await IndexedSessionStorage.init();
    this.db = db
    return this.db;
  }
  async function stopIndexDB() {
    if (this.db) {
      await db.close();
    }
  }
  return { startIndexDB, stopIndexDB, db: null };
}

const indexDb = IndexDB();
export { indexDb };

// Beforeunload Event:
// You can listen for the beforeunload event to perform cleanup operations before the user leaves the page or refreshes. This event allows you to ask the user for confirmation before they leave the page.
//window.addEventListener('beforeunload', (event) => {
// Perform cleanup operations here (e.g., save data, close connections)
// event.returnValue = 'Are you sure you want to leave?';
//});

// Visibility API:
// Use the Visibility API to detect when the page is being hidden, which can happen before unloading. This is useful for situations where you want to perform actions when the page loses focus.
//document.addEventListener('visibilitychange', () => {
//if (document.hidden) {
// Page is being hidden, perform cleanup operations
//}
//});

// IndexedDB Transactions:
// Make sure to complete any pending IndexedDB transactions before the page is closed or refreshed. You can use the onbeforeunload event to trigger this.
//window.onbeforeunload = function() {
// Complete any pending transactions in IndexedDB
// ...
//};

// Service Workers:
// If you're using a service worker, you can use the beforeinstallprompt event to prompt the user to install the app, and handle cleanup when the service worker is unregistered.

// window.addEventListener('beforeinstallprompt', (event) => {
//   // Prompt user to install app
// });

// navigator.serviceWorker.getRegistration().then(registration => {
//   if (registration) {
//     registration.unregister().then(() => {
//       // Perform cleanup operations
//     });
//   }
// });

// Close any open WebSocket connections or other server connections before the page is closed.
// window.onbeforeunload = function() {
//   // Close WebSocket connections
//   // ...
// };

// Clearing Local Storage or IndexedDB:
// If necessary, you can clear local storage or IndexedDB data when the user leaves the page.

// window.addEventListener('beforeunload', () => {
//  // localStorage.clear(); // Clear local storage
//   // Or clear IndexedDB data
// });

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
