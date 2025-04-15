import pako from 'pako';

class Instruments {
  constructor() {
    this.dbName = 'InstrumentsDB';
    this.storeName = 'instruments';
    this.dbLoaded = localStorage.getItem('dbLoaded') === 'true'; // Check localStorage for loaded state
    // this.deleteDB();
    this.initDB();
  }

  async initDB() {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      db.createObjectStore(this.storeName, { keyPath: 'instrument_key' });
    };

    request.onsuccess = async event => {
      this.db = event.target.result;
      this.dbLoaded = true; // Set flag to true when DB is loaded
      localStorage.setItem('dbLoaded', 'true'); // Persist the loaded state in localStorage
      await this.loadData();
    };

    request.onerror = event => {
      console.error('Database error:', event.target.errorCode);
    };
  }

  async loadData() {
    // Fetch 60k records from API
    const records = await fetchAndDecompressData();
    console.log('records', records);

    const transaction = this.db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    records.forEach(record => {
      store.put(record); // Save each record in the database
    });

    transaction.oncomplete = () => {
      console.log('All records have been added to the database.');
    };
  }

  async searchByName(name) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);

      // Fetch all records from the store
      const request = store.getAll();
      request.onsuccess = event => {
        const allRecords = event.target.result;
        // Filter records where trading_symbol contains the search name
        const filteredRecords = allRecords.filter(
          record =>
            record.trading_symbol &&
            record.trading_symbol.includes(name ? name.toUpperCase() : ''),
        );
        resolve(filteredRecords);
      };

      request.onerror = event => {
        reject('Search failed:', event.target.error);
      };
    });
  }

  async deleteDB() {
    const request = indexedDB.deleteDatabase(this.dbName);

    request.onsuccess = () => {
      console.log(`Database ${this.dbName} deleted successfully.`);
      localStorage.removeItem('dbLoaded'); // Clear the loaded state from localStorage
    };

    request.onerror = event => {
      console.error('Error deleting database:', event.target.error);
    };

    request.onblocked = () => {
      console.warn(
        'Database deletion blocked. Close all connections to the database and try again.',
      );
    };
  }

  isDBLoaded() {
    return this.dbLoaded; // Return the status of the DB loaded flag
  }
}

async function fetchAndDecompressData() {
  try {
    const response = await fetch('https://fly-node.vercel.app/instruments/NSE');
    const compressedData = await response.arrayBuffer();
    const decompressedData = pako.inflate(compressedData);
    const jsonData = JSON.parse(
      new TextDecoder('utf-8').decode(decompressedData),
    );
    return jsonData;
  } catch (error) {
    console.error('Error fetching or decompressing data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}

// Usage example
export const instruments = new Instruments();
// instruments.searchByName('Guitar').then(results => console.log(results));
// instruments.deleteDB(); // Call this to delete the database
// console.log(instruments.isDBLoaded()); // Check if the DB is loaded
