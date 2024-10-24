const menuItems = JSON.parse(localStorage.getItem('menuItems')) || []; // Load menu items from localStorage
const menuContainer = document.getElementById('menu-items');
const menuForm = document.getElementById('menu-form');
const ownerLink = document.getElementById('owner-link');

let isOwner = false; // Flag to track owner's authentication
let currentEditIndex = null; // Track the index of the item being edited

// Show the owner section after password validation
ownerLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    const ownerPassword = prompt("Enter owner password to access the edit section:");

    // Check if password is correct (you can change 'ownerpass' to your desired password)
    if (ownerPassword === 'ownerpass') {
        isOwner = true;
        document.getElementById('owner').style.display = 'block'; // Show owner section
        alert("Access granted. You can now edit the menu.");
        renderMenuItems(); // Refresh the menu items to show edit buttons
    } else {
        alert("Incorrect password. You cannot access the owner section.");
    }
});

// Load and render menu items on page load
renderMenuItems();

menuForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const dishName = document.getElementById('dish-name').value;
    const dishPrice = document.getElementById('dish-price').value;
    const dishImage = document.getElementById('dish-image').value;
    
    // If we're editing an existing item
    if (currentEditIndex !== null) {
        menuItems[currentEditIndex] = {
            name: dishName,
            price: dishPrice,
            image: dishImage
        };
        alert("Dish updated successfully.");
        currentEditIndex = null; // Reset edit index after update
    } else {
        // Add new item to the menu
        const newItem = {
            name: dishName,
            price: dishPrice,
            image: dishImage
        };
        menuItems.push(newItem);
        alert("Dish added successfully.");
    }

    // Save menu items to localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Clear form
    menuForm.reset();
    
    // Render menu items
    renderMenuItems();
});

// Render menu items from the localStorage
function renderMenuItems() {
    menuContainer.innerHTML = '';
    menuItems.forEach((item, index) => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('menu-item');
        menuItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Price: ₹${item.price}</p>
            <p><img src="${item.image}" alt="Dish Image" style="max-width: 100px;"></p>
            ${isOwner ? `
                <button onclick="openEditMenuItem(${index})">Edit</button>
                <button onclick="deleteMenuItem(${index})">Delete</button>
            ` : ''}
        `;
        menuContainer.appendChild(menuItemDiv);
    });
}

// Open edit function for a specific menu item
function openEditMenuItem(index) {
    const item = menuItems[index];
    document.getElementById('dish-name').value = item.name;
    document.getElementById('dish-price').value = item.price;
    document.getElementById('dish-image').value = item.image;

    // Set the index of the item being edited
    currentEditIndex = index;
}

// Save menu items to localStorage
function saveMenuItems() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Delete a menu item
function deleteMenuItem(index) {
    menuItems.splice(index, 1); // Remove the item from the array
    saveMenuItems(); // Save changes
    renderMenuItems(); // Re-render the menu items
}
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
function addMenuItem(name, price, image) {
    db.collection("menuItems").add({
        name: name,
        price: price,
        image: image
    })
    .then(() => {
        console.log("Menu item successfully added!");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}
function renderMenuItems() {
    db.collection("menuItems").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const menuItem = doc.data();
            // Render the menu items (for example, create an HTML element)
            console.log(menuItem.name, menuItem.price, menuItem.image);
        });
    });
}
function deleteMenuItem(id) {
    db.collection("menuItems").doc(id).delete()
    .then(() => {
        console.log("Menu item successfully deleted!");
    });
}
// Initialize Firebase as shown earlier (Step 2)

const loginForm = document.getElementById('loginForm');
const ownerSection = document.getElementById('ownerSection');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase authentication: Sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Owner successfully logged in
            console.log("Owner logged in");
            // Show the owner section after successful login
            ownerSection.style.display = 'block';  // Show the owner-only section
            loginForm.style.display = 'none';  // Hide the login form
        })
        .catch((error) => {
            // Handle login errors here (e.g., wrong password)
            console.error("Login error: ", error.message);
            alert("Login failed. Please check your email or password.");
        });
});