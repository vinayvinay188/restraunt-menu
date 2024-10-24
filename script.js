const supabaseUrl = 'https://YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Simulated owner password for simplicity
const ownerPassword = "admin123";

// Elements
const ownerAccessBtn = document.getElementById('ownerAccessBtn');
const menuItemsDiv = document.getElementById('menuItems');
const ownerSection = document.getElementById('ownerSection');
const passwordModal = document.getElementById('passwordModal');
const loginBtn = document.getElementById('loginBtn');
const dishNameInput = document.getElementById('dishName');
const dishPriceInput = document.getElementById('dishPrice');
const dishImageInput = document.getElementById('dishImage');
const menuForm = document.getElementById('menuForm');
const logoutBtn = document.getElementById('logoutBtn');

// Load stored menu from localStorage
let menu = JSON.parse(localStorage.getItem('restaurantMenu')) || [];

// Function to render the menu
function renderMenu() {
  menuItemsDiv.innerHTML = '';
  menu.forEach((item, index) => {
    const menuCard = document.createElement('div');
    menuCard.classList.add('menuCard');
    menuCard.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <button class="editBtn hidden" data-index="${index}">Edit</button>
      <button class="deleteBtn hidden" data-index="${index}">Delete</button>
    `;
    menuItemsDiv.appendChild(menuCard);
  });
}

// Function to add or update menu items
function addOrUpdateMenu(event) {
  event.preventDefault();
  const name = dishNameInput.value;
  const price = dishPriceInput.value;
  const image = dishImageInput.value;

  const existingIndex = menu.findIndex(item => item.name === name);
  if (existingIndex >= 0) {
    // Update existing dish
    menu[existingIndex] = { name, price, image };
  } else {
    // Add new dish
    menu.push({ name, price, image });
  }

  // Save to localStorage
  localStorage.setItem('restaurantMenu', JSON.stringify(menu));

  // Reset form
  dishNameInput.value = '';
  dishPriceInput.value = '';
  dishImageInput.value = '';

  renderMenu();
}

// Function to show or hide owner buttons
function toggleOwnerButtons(show) {
  document.querySelectorAll('.editBtn, .deleteBtn').forEach(button => {
    button.classList.toggle('hidden', !show);
  });
}

// Event listener for owner access
ownerAccessBtn.addEventListener('click', () => {
  passwordModal.style.display = 'block';
});

// Event listener for login button
loginBtn.addEventListener('click', () => {
  const enteredPassword = document.getElementById('ownerPassword').value;
  if (enteredPassword === ownerPassword) {
    passwordModal.style.display = 'none';
    ownerSection.style.display = 'block';
    toggleOwnerButtons(true);
  } else {
    alert('Incorrect password!');
  }
});

// Event listener for adding/updating dishes
menuForm.addEventListener('submit', addOrUpdateMenu);

// Event listener for logout
logoutBtn.addEventListener('click', () => {
  ownerSection.style.display = 'none';
  toggleOwnerButtons(false);
});

// Event listeners for editing and deleting
menuItemsDiv.addEventListener('click', (event) => {
  const index = event.target.dataset.index;

  if (event.target.classList.contains('editBtn')) {
    const item = menu[index];
    dishNameInput.value = item.name;
    dishPriceInput.value = item.price;
    dishImageInput.value = item.image;
  }

  if (event.target.classList.contains('deleteBtn')) {
    menu.splice(index, 1);
    localStorage.setItem('restaurantMenu', JSON.stringify(menu));
    renderMenu();
  }
});

// Initialize menu on page load
renderMenu();
async function fetchMenuItems() {
    const { data: menuItems, error } = await supabase
        .from('menu_items')
        .select('*');

    if (error) {
        console.error('Error fetching menu:', error);
        return;
    }

    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = '';

    menuItems.forEach(item => {
        menuDiv.innerHTML += `
            <div class="menu-item">
                <h3>${item.name}</h3>
                <img src="${item.photo_url}" alt="${item.name}" width="100">
                <p>Price: $${item.price}</p>
            </div>
        `;
    });
}

fetchMenuItems();
async function addMenuItem(name, photoUrl, price) {
    const { data, error } = await supabase
        .from('menu_items')
        .insert([
            { name: name, photo_url: photoUrl, price: price }
        ]);

    if (error) {
        console.error('Error adding menu item:', error);
        return;
    }

    // Refresh the menu to show the newly added item
    fetchMenuItems();
}

// Call addMenuItem with values from a form when the owner submits new items
