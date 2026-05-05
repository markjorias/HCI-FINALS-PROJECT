/* dashboard.js - Admin Dashboard Logic */

document.addEventListener('DOMContentLoaded', () => {
  // --- Searchable Dropdown Logic ---
  function initSearchableDropdown(select) {
    if (select.dataset.searchableInit) return;
    select.dataset.searchableInit = "true";

    const wrapper = document.createElement('div');
    wrapper.className = 'searchable-dropdown';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'searchable-dropdown-input';
    input.placeholder = select.options[0]?.textContent || 'Select...';
    wrapper.appendChild(input);

    const list = document.createElement('div');
    list.className = 'searchable-dropdown-list';
    wrapper.appendChild(list);

    function populateList() {
      list.innerHTML = '';
      Array.from(select.options).forEach((option, index) => {
        if (index === 0 && option.value === "") return; // Skip placeholder
        const item = document.createElement('div');
        item.className = 'searchable-dropdown-item';
        item.textContent = option.textContent;
        item.dataset.value = option.value;
        if (option.selected) {
          item.classList.add('selected');
          input.value = option.textContent;
        }
        item.addEventListener('click', () => {
          select.value = option.value;
          input.value = option.textContent;
          select.dispatchEvent(new Event('change'));
          wrapper.classList.remove('active');
          updateSelected();
        });
        list.appendChild(item);
      });
    }

    function updateSelected() {
      const items = list.querySelectorAll('.searchable-dropdown-item');
      items.forEach(item => {
        if (item.dataset.value === select.value) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    }

    populateList();

    input.addEventListener('focus', () => {
      wrapper.classList.add('active');
      input.select();
    });

    input.addEventListener('input', () => {
      const filter = input.value.toLowerCase();
      const items = list.querySelectorAll('.searchable-dropdown-item');
      let hasVisible = false;
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(filter)) {
          item.classList.remove('hidden');
          hasVisible = true;
        } else {
          item.classList.add('hidden');
        }
      });
      wrapper.classList.add('active');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('active');
        // Reset input to selected option if nothing matched or empty
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
          input.value = selectedOption.textContent;
        }
      }
    });

    // Allow external refresh
    select.refreshSearchable = () => {
      populateList();
      const selectedOption = select.options[select.selectedIndex];
      if (selectedOption) {
        input.value = selectedOption.textContent;
      }
    };
  }

  // --- Addons Dropdown Logic ---
  const addonsSelect = document.getElementById('item-addons');

  function populateAddonsDropdown() {
    const menuItems = JSON.parse(localStorage.getItem('menu_items')) || [];
    const addons = menuItems.filter(item => item.category === 'ADD-ONS');
    
    addonsSelect.innerHTML = '';
    addons.forEach(addon => {
      const option = document.createElement('option');
      option.value = addon.id;
      option.textContent = `${addon.name} (+PHP ${addon.price.toFixed(2)})`;
      addonsSelect.appendChild(option);
    });
  }

  // --- Navigation Logic ---
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');
  const pageTitle = document.getElementById('page-title');
  const addItemBtn = document.getElementById('add-item-btn');

  // --- Image Handling ---
  const imageInput = document.getElementById('item-image');
  const imagePreview = document.getElementById('image-preview');
  let currentImageData = '';

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentImageData = event.target.result;
        imagePreview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      
      // Update Sidebar
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update Sections
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(target).classList.add('active');

      // Update Header
      pageTitle.textContent = item.querySelector('span').textContent;
      
      // Show/Hide Add Button
      if (target === 'menu-management') {
        addItemBtn.style.display = 'flex';
      } else {
        addItemBtn.style.display = 'none';
      }

      // Populate features if needed
      if (target === 'feature-management') {
        populateFeatureSelectors();
      }
      });
      });

      // --- Feature Management Logic ---
      const saveFeaturesBtn = document.getElementById('save-features-btn');

      function populateFeatureSelectors() {
      const menuItems = JSON.parse(localStorage.getItem('menu_items')) || [];
      const selectors = document.querySelectorAll('.feature-select');

      // Load saved features
      const savedFeatures = JSON.parse(localStorage.getItem('featured_products')) || {
      bestseller: [],
      snacks: [],
      more_to_try: []
      };

      selectors.forEach(select => {
        const section = select.getAttribute('data-section');
        const index = parseInt(select.getAttribute('data-index'));

        // Clear and add "Select Item" option
        select.innerHTML = '<option value="">-- Select Menu Item --</option>';

        menuItems.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = `[${item.category}] ${item.name}`;

          // Select if matches saved feature
          if (savedFeatures[section] && savedFeatures[section][index] == item.id) {
            option.selected = true;
          }

          select.appendChild(option);
        });

        // Initialize or Refresh Searchable Dropdown
        if (!select.dataset.searchableInit) {
          initSearchableDropdown(select);
        } else if (select.refreshSearchable) {
          select.refreshSearchable();
        }
      });
    }

      if (saveFeaturesBtn) {
      saveFeaturesBtn.addEventListener('click', () => {
      const selectors = document.querySelectorAll('.feature-select');
      const featured = {
        bestseller: [],
        snacks: [],
        more_to_try: []
      };

      selectors.forEach(select => {
        const section = select.getAttribute('data-section');
        const value = select.value;
        if (value) {
          featured[section].push(parseInt(value));
        }
      });

      localStorage.setItem('featured_products', JSON.stringify(featured));
      alert('Featured products saved successfully!');
      });
      }

      // --- Image Handling ---
  const modal = document.getElementById('item-modal');
  const closeModal = document.querySelector('.close-modal');
  const itemForm = document.getElementById('item-form');
  const modalTitle = document.getElementById('modal-title');

  const categorySelect = document.getElementById('item-category');
  if (categorySelect) {
    initSearchableDropdown(categorySelect);
  }

  addItemBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Add Menu Item';
    itemForm.reset();
    populateAddonsDropdown();
    if (categorySelect.refreshSearchable) categorySelect.refreshSearchable();
    document.getElementById('item-id').value = '';
    document.getElementById('item-variation').value = '';
    document.getElementById('item-size').value = '';
    imagePreview.innerHTML = '';
    currentImageData = '';
    modal.style.display = 'flex';
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // --- Data Management (Mocking SQLite with LocalStorage) ---
  
  // Initial Mock Data if empty
  if (!localStorage.getItem('menu_items')) {
    const initialMenu = [
      { id: 1, name: 'Hazelnut Latte', desc: 'Available in different sizes & variations', price: 100, category: 'NON COFFEE', image: 'https://www.figma.com/api/mcp/asset/e0e64626-ca4a-4e32-9a95-f78972e62b6a', variations: 'Hot, Iced', sizes: '16oz, 22oz', addons: [] },
      { id: 2, name: 'Dirty Matcha', desc: 'Available in different sizes & variations', price: 100, category: 'NON COFFEE', image: '', variations: 'Hot, Iced', sizes: '16oz, 22oz', addons: [] },
      { id: 3, name: 'Salted Caramel Latte', desc: 'Available in different sizes & variations', price: 69, category: 'NON COFFEE', image: '', variations: 'Hot, Iced', sizes: '16oz, 22oz', addons: [] },
      { id: 4, name: 'Extra Shot Espresso', desc: 'Add more caffeine', price: 20, category: 'ADD-ONS', image: '' },
      { id: 5, name: 'Vanilla Syrup', desc: 'Sweeten it up', price: 15, category: 'ADD-ONS', image: '' }
    ];
    localStorage.setItem('menu_items', JSON.stringify(initialMenu));
  }

  if (!localStorage.getItem('orders')) {
    const initialOrders = [
      { id: 'ORD-001', customer: 'John Doe', items: '1x Matcha Latte, 2x Espresso', total: 350, status: 'Received' },
      { id: 'ORD-002', customer: 'Jane Smith', items: '1x Spanish Latte', total: 69, status: 'Preparing' }
    ];
    localStorage.setItem('orders', JSON.stringify(initialOrders));
  }

  function renderMenu() {
    const menuItems = JSON.parse(localStorage.getItem('menu_items'));
    const tableBody = document.getElementById('menu-items-table');
    tableBody.innerHTML = '';

    menuItems.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="col-img"><img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td class="col-desc">${item.desc}</td>
        <td>PHP ${item.price.toFixed(2)}</td>
        <td>${item.category}</td>
        <td class="col-actions">
          <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
          <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const orderGrid = document.querySelector('.order-grid');
    orderGrid.innerHTML = '';

    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-admin-card';
      card.innerHTML = `
        <div class="order-header">
          <span class="order-id">#${order.id}</span>
          <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
        </div>
        <div class="order-body">
          <p><strong>Customer:</strong> ${order.customer}</p>
          <p><strong>Items:</strong> ${order.items}</p>
          <p class="order-total">Total: PHP ${order.total.toFixed(2)}</p>
        </div>
        <div class="order-actions">
          <button class="status-btn btn-confirm" onclick="updateOrderStatus('${order.id}', 'Confirmed')">Confirm</button>
          <button class="status-btn btn-preparing" onclick="updateOrderStatus('${order.id}', 'Preparing')">Preparing</button>
          <button class="status-btn btn-ready" onclick="updateOrderStatus('${order.id}', 'Ready')">Ready</button>
        </div>
      `;
      orderGrid.appendChild(card);
    });
  }

  // Exposed functions for onclick (Quick hack for demo)
  window.editItem = (id) => {
    const menuItems = JSON.parse(localStorage.getItem('menu_items'));
    const item = menuItems.find(i => i.id === id);
    if (item) {
      populateAddonsDropdown();
      document.getElementById('item-id').value = item.id;
      document.getElementById('item-name').value = item.name;
      document.getElementById('item-desc').value = item.desc;
      document.getElementById('item-price').value = item.price;
      document.getElementById('item-category').value = item.category;
      document.getElementById('item-variation').value = item.variations || '';
      document.getElementById('item-size').value = item.sizes || '';
      
      // Select Addons
      if (item.addons && Array.isArray(item.addons)) {
        Array.from(addonsSelect.options).forEach(option => {
          option.selected = item.addons.includes(parseInt(option.value));
        });
      }

      if (categorySelect.refreshSearchable) categorySelect.refreshSearchable();
      if (addonsSelect.refreshSearchable) addonsSelect.refreshSearchable();
      
      currentImageData = item.image || '';
      if (currentImageData) {
        imagePreview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
      } else {
        imagePreview.innerHTML = '';
      }
      
      modalTitle.textContent = 'Edit Menu Item';
      modal.style.display = 'flex';
    }
  };

  window.deleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      let menuItems = JSON.parse(localStorage.getItem('menu_items'));
      menuItems = menuItems.filter(i => i.id !== id);
      localStorage.setItem('menu_items', JSON.stringify(menuItems));
      renderMenu();
    }
  };

  window.updateOrderStatus = (id, status) => {
    let orders = JSON.parse(localStorage.getItem('orders'));
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      localStorage.setItem('orders', JSON.stringify(orders));
      renderOrders();
      // In a real app, this would also update order_status.html via a backend/database
      console.log(`Order ${id} updated to ${status}`);
    }
  };

  itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const desc = document.getElementById('item-desc').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const category = document.getElementById('item-category').value;
    const variations = document.getElementById('item-variation').value;
    const sizes = document.getElementById('item-size').value;
    const addons = Array.from(addonsSelect.selectedOptions).map(opt => parseInt(opt.value));
    const image = currentImageData;

    let menuItems = JSON.parse(localStorage.getItem('menu_items'));

    if (id) {
      // Update
      const index = menuItems.findIndex(i => i.id == id);
      menuItems[index] = { 
        id: parseInt(id), name, desc, price, category, image,
        variations, sizes, addons 
      };
    } else {
      // Create
      const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
      menuItems.push({ 
        id: newId, name, desc, price, category, image,
        variations, sizes, addons 
      });
    }

    localStorage.setItem('menu_items', JSON.stringify(menuItems));
    modal.style.display = 'none';
    renderMenu();
  });

  // Initial Render
  renderMenu();
  renderOrders();
});
