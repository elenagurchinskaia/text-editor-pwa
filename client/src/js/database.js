// import openDB function from the idb module
import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

// add content to the database
export const putDb = async (content) => {
  // open the jate database with version 1
  const db = await openDB("jate", 1);
  // starts a readwrite transaction on the jate obj store
  const tx = db.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  // use put method of the obj. store to add an entry with an object containing properties id and content
  const request = store.put({ id: 1, content: content });
  console.log("Notes saved successfully!");
};

// get all the content from the database
export const getDb = async () => {
  // open the jate database with version 1
  const db = await openDB("jate", 1);
  // start the readonly transaction on the jate object store
  const tx = db.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  // retreive an entry with the specified id
  const request = await store.get(1);
  // return the content property of the retreived entry
  return request.content;
};

initdb();
