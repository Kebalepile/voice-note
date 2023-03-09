import notification from "../utils/notification.js";
// Database details.
const databaseName = "note-taker",
  version = 1,
  storeNames = ["text", "audio"];

function openDB(dbName, version) {
  return window.indexedDB.open(dbName, version);
}
function initDatabase(storeNames = ["text", "audio"]) {
  const request = openDB(databaseName, version);

  request.onerror = (event) => {
    // console.error(`Error while requesting IndexedBD: ${event.error}`);
  };

  /**
   * @description request.onblocked
  // there's another connection to same database
  // and it wasn't closed  AFTER db.onversionchange triggered from them.
   */
  request.onblocked = () => {
    alert("there's another connection to same database.");
  };

  /**
   * @description request.onupgradeneeded
    gets triggred if client had no database
   initialise you're object stores
   */
  request.onupgradeneeded = (event) => {
    // save IDBDatabase interface
    const database = event.target.result;

    // create objecstores for this database, which hold information
    // about our notes. were going to use "id" as it's guaranteed to be unique.
    for (let storeName of storeNames) {
      if (!database.objectStoreNames.contains(storeName)) {
        let storeObject = database.createObjectStore(storeName, {
          keyPath: "title",
          autoIncrement: true,
        });
        //  create an index to search note stores by type i.e audio, text.
        // this index won't be unique as type may be duplicate.
        storeObject.createIndex("data-type", "type");

        // deadline index won't be unique
        storeObject.createIndex("deadline", "deadline");
        // date index won't be unique.
        storeObject.createIndex("date", "date");

        storeObject.createIndex("notified", "notified");
      }
    }
  };

   /**
    * 
    * @description request.onsuccess
      continue to work with your database event 
    */
  request.onsuccess = (event) => {
    const database = event.target.result;

    database.onversionchange = () => {
      database.close();
      alert("Database is outdated, please reload page.");
    };
    // handling database errors
    database.onerror = (e) => {
      // console.error(`Database error: ${e.target.errorCode}`);
    };
  };
}

async function addNote(note) {
  const dbRequest = openDB(databaseName, version),
    [storeName] = storeNames.filter((type) => type === note.type);
  try {
    const db = await new Promise((resolve, reject) => {
      dbRequest.onsuccess = (e) => resolve(e.target.result);
      dbRequest.onerror = (e) => reject(e.target.error);
    });
    const transaction = db.transaction(storeName, "readwrite");
    transaction.oncomplete = () => {
      // console.log("transaction completed");
      //  initi a notification for each new note added to indexedDB.
      notification(note);
      db.close();
    };
    transaction.onabort = () => {
      // console.error(transaction.error);
    };
    transaction.onerror = () => {
      // console.error(`transaction error : ${transaction.error}`);
    };

    const store = transaction.objectStore(storeName);

    const req = store.add(note);
    req.onsuccess = () => {
      // console.log(`note added to ${storeName} store.`);
    };
  } catch (error) {
    // console.error(error);
  }
}

async function getAllNotes() {
  let dbRequest = openDB(databaseName, version);
  try {
    const db = await new Promise((resolve, reject) => {
      dbRequest.onsuccess = (e) => resolve(e.target.result);
      dbRequest.onerror = (e) => reject(e.target.error);
    });

    let notesList = await storeNames
      .map(async (name) => {
        try {
          let objectStore = db.transaction(name, "readonly").objectStore(name),
            request = objectStore.getAll(),
            notes = await new Promise((resolve, reject) => {
              request.onsuccess = (e) => resolve(e.target.result);
              request.onerror = (e) => reject(e.target.error);
            });
          return notes;
        } catch (error) {
          // console.error(error);
        }
      })
      .reduce(async (acc, cur) => {
        cur = await cur;
        // vscode extension might say the "await" has no effect on the
        // below experssion, but it does as at some point the array turns into a promise object.
        acc = await acc;

        if (cur.length) {
          for (let note of cur) acc.push(note);
        }

        return acc;
      }, []);
    return notesList;
  } catch (error) {
    // console.error(error);
  }
}
async function getNote(title, type) {
  const dbRequest = openDB(databaseName, version),
    [storeName] = storeNames.filter((name) => name === type);

  try {
    
    const objectStore = db
      .transaction(storeName, "readonly")
      .objectStore(storeName);

    const response = objectStore.get(title),
      note = await new Promise((resolve, reject) => {
        response.onsuccess = (e) => resolve(e.target.result);
        response.onerror = (e) => reject(e.target.error);
      });
    return note;
  } catch (error) {
    // console.error(error);
  }
}
async function deleteNote(title, type) {
  const dbRequest = openDB(databaseName, version),
    [storeName] = storeNames.filter((name) => name === type);
  try {
    let db = await new Promise((resolve, reject) => {
      dbRequest.onsuccess = (e) => resolve(e.target.result);
      dbRequest.onerror = (e) => reject(e.target.error);
    });
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    objectStore.delete(title);

    const response = await new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject("error deleting item.");
    });

    return response;
  } catch (error) {
    // console.error(error);
  }
}
"indexedDB" in window
  ? initDatabase()
  : alert(
      "IndexedDB not supported by you device, this web-app won't perform as expected."
    );

export { addNote, getNote, getAllNotes, deleteNote };
