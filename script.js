// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCemzu_stNmHaHfGHzmi_59k0XGT4ivEy4",
    authDomain: "badgeselling-e5a2d.firebaseapp.com",
    databaseURL: "https://badgeselling-e5a2d-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "badgeselling-e5a2d",
    storageBucket: "badgeselling-e5a2d.appspot.com",
    messagingSenderId: "80085468094",
    appId: "1:80085468094:web:009245082abb6d95b06fef"
};

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);
//const database = firebase.database();
const app = initializeApp(firebaseConfig);

// Array to hold the sales records
let salesRecords = [];

// Function to add a sale
function addSale() {
    const date = document.getElementById('date').value;
    const item = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!date || !item || !quantity) {
        alert('Please select a date, item, and quantity.');
        return;
    }

    // Create a new sale record
    const sale = {
        date: date,
        item: item,
        quantity: quantity
    };

    // Add the sale record to Firebase
    database.ref('salesRecords').push(sale);

    // Clear the form fields
    document.getElementById('date').value = '';
    document.getElementById('item').value = '';
    document.getElementById('quantity').value = 1;
}

// Function to display the sales records
function displaySales() {
    const salesTableBody = document.querySelector('#salesTable tbody');
    salesTableBody.innerHTML = ''; // Clear the current table

    database.ref('salesRecords').on('value', (snapshot) => {
        const records = snapshot.val();
        if (records) {
            salesRecords = Object.entries(records).map(([id, record]) => ({ id, ...record }));
            salesRecords.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td contenteditable="true" onblur="updateSale('${record.id}', 'date', this.textContent)">${record.date}</td>
                    <td contenteditable="true" onblur="updateSale('${record.id}', 'item', this.textContent)">${record.item}</td>
                    <td contenteditable="true" onblur="updateSale('${record.id}', 'quantity', this.textContent)">${record.quantity}</td>
                `;
                salesTableBody.appendChild(row);
            });
        }
    });
}

// Function to update a sale record
function updateSale(id, field, value) {
    const updates = {};
    updates[`/salesRecords/${id}/${field}`] = value;
    database.ref().update(updates);
}

// Display sales records on load
displaySales();
