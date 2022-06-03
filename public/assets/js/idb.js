// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1.
// 1- The name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist). We'll use the name pizza_hunt.
// 2- The version of the database. By default, we start it at 1. This parameter is used to determine whether the database's structure has changed between connections.
// Think of it as if you were changing the columns of a SQL database.
const request = window.indexedDB.open('pizza_hunt', 1); // indexedDB is a global variable that belong to the window object 

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
// We can't create an object store until the connection to the database is open, emitting an event that the request variable will be able to capture
request.onupgradeneeded = function(event) {

  // save a reference to the database 
  const db = event.target.result;

  // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
  db.createObjectStore('new_pizza', { autoIncrement: true });

};


// upon a successful 
request.onsuccess = function(event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection,
  // save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function(event) {
  // log error here
  console.log(event.target.errorCode);
};


// This function will be executed if we attempt to submit a new pizza and there's no internet connection
// this will be added on the cache method while posting the data to db
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions 
  // and whith this we can access the pizza database and we can read or write on it
  const transaction = db.transaction(['new_pizza'], 'readwrite'); // transaction is a temporary connection to the database, like CRUD on mysql

  // access the object store for `new_pizza`
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // add record to your store with add method
  pizzaObjectStore.add(record);
}

// upload the pizza data after the user reconnects 
function uploadPizza() {
  // open a transaction on your db
  // to access to local database
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  // access your object store
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // more to come...
  // upon a successful .getAll() execution, run this function
  getAll.onsuccess = function() {
  // if there was data in indexedDb's store, let's send it to the api server
  if (getAll.result.length > 0) {
    // the getAll variable we created above it will have a .result 
    // property that's an array of all the data we retrieved from the new_pizza object store.
    fetch('/api/pizzas', {
      method: 'POST',
      body: JSON.stringify(getAll.result),
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(serverResponse => {
        if (serverResponse.message) {
          throw new Error(serverResponse);
        }
        // open one more transaction
        const transaction = db.transaction(['new_pizza'], 'readwrite');
        // access the new_pizza object store
        const pizzaObjectStore = transaction.objectStore('new_pizza');
        // clear all items in your store
        pizzaObjectStore.clear();

        alert('All saved pizza has been submitted!');
      })
      .catch(err => {
        console.log(err);
      });
  }
};
}


// listen for app coming back online
window.addEventListener('online', uploadPizza);