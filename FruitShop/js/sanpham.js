const productsPerPage = 6;
let currentPage = 1;

const grid = document.getElementById("productGrid");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let allProducts = []; // Dữ liệu fetch từ backend
let filteredProducts = [];

// fetch api sản phẩm
async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:3000/traicay');
    if (!res.ok) throw new Error('Không thể tải sản phẩm từ server');
    const data = await res.json();

    allProducts = data.map(p => ({
      name: p.TenTraiCay,
      price: Number(p.GiaTien),
      tag: p.tag || '',
      origin: p.XuatXu || '',
      img: p.img || 'assets/img/default.jpg',
    }));

    filteredProducts = [...allProducts];
    renderProducts(currentPage);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="text-align:center; color:red;">Không thể tải sản phẩm.</p>`;
    pagination.style.display = "none";
  }
}

// HÀM LỌC SẢN PHẨM
function applyFilters() {
  let keyword = searchInput.value.toLowerCase();

  // Tìm kiếm theo tên
  filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(keyword)
  );

  // Lọc xuất xứ
  const origins = [...document.querySelectorAll("input[name='origin']:checked")].map(i => i.value);
  if (origins.length > 0) {
    filteredProducts = filteredProducts.filter(p => origins.includes(p.origin.toLowerCase()));
  }

  // Lọc giá
  const priceFilter = document.querySelector("input[name='price']:checked");
  if (priceFilter) {
    const value = priceFilter.value;
    filteredProducts = filteredProducts.filter(p => {
      if (value == 1) return p.price < 50000;
      if (value == 2) return p.price >= 50000 && p.price <= 100000;
      if (value == 3) return p.price > 100000;
    });
  }

  currentPage = 1;
  renderProducts(currentPage);
}

// RENDER SẢN PHẨM
function renderProducts(page) {
  grid.innerHTML = "";

  const start = (page - 1) * productsPerPage;
  const products = filteredProducts.slice(start, start + productsPerPage);

  if (products.length === 0) {
    grid.innerHTML = `<p style="text-align:center; color:#777;">Không tìm thấy sản phẩm nào phù hợp.</p>`;
    pagination.style.display = "none";
    return;
  }

  products.forEach(p => {
    const isLow = p.tag.toLowerCase() === "sắp hết";
    const tagClass = isLow ? "tag low-stock" : "tag";

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${p.price.toLocaleString("vi-VN")}đ / kg</p>
      <span class="${tagClass}">${p.tag}</span>
      <button class="btn-add" data-name="${p.name}">Thêm vào giỏ</button>
    `;
    grid.appendChild(card);
  });

  attachAddToCartButtons();
  updatePagination();
}

// PHÂN TRANG
function updatePagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("a");
    btn.href = "#";
    btn.textContent = i;
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.addEventListener("click", e => {
      e.preventDefault();
      currentPage = i;
      renderProducts(currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    pagination.appendChild(btn);
  }
}

// TÌM KIẾM
function searchProducts(keyword) {
  keyword = keyword.toLowerCase();
  filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(keyword));
  currentPage = 1;
  renderProducts(currentPage);
}

searchBtn.addEventListener("click", () => searchProducts(searchInput.value.trim()));
searchInput.addEventListener("keyup", e => { if (e.key === "Enter") searchProducts(searchInput.value.trim()); });

// GIỎ HÀNG
let cart = [];

const cartBox = document.getElementById('cartBox');
const cartHeader = document.getElementById('cartHeader');
const cartContent = document.getElementById('cartContent');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');

cartHeader.addEventListener('click', () => {
  cartContent.style.display = cartContent.style.display === 'block' ? 'none' : 'block';
});

function addToCart(productName) {
  const product = allProducts.find(p => p.name === productName);
  if (!product) return;

  const existing = cart.find(p => p.name === productName);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: productName, qty: 1, price: product.price });
  }

  // Lưu cart vào localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  updateCartDisplay();
}

function updateCartDisplay() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  cartCount.textContent = totalQty;

  cartItems.innerHTML = '';

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '6px';

    // Tên sản phẩm
    const nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;
    nameSpan.style.flex = '2';
    li.appendChild(nameSpan);

    // Control + input số lượng
    const controlDiv = document.createElement('div');
    controlDiv.style.display = 'flex';
    controlDiv.style.alignItems = 'center';
    controlDiv.style.flex = '1';
    controlDiv.style.justifyContent = 'center';

    const btnMinus = document.createElement('button');
    btnMinus.textContent = '-';
    btnMinus.style.width = '30px';
    btnMinus.style.height = '30px';
    btnMinus.addEventListener('click', () => {
      if (cart[index].qty > 1) cart[index].qty -= 1;
      else cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    });

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = 1;
    qtyInput.value = item.qty;
    qtyInput.style.width = '50px';
    qtyInput.style.textAlign = 'center';
    qtyInput.style.margin = '0 4px';
    qtyInput.addEventListener('change', (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      cart[index].qty = val;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    });

    const btnPlus = document.createElement('button');
    btnPlus.textContent = '+';
    btnPlus.style.width = '30px';
    btnPlus.style.height = '30px';
    btnPlus.addEventListener('click', () => {
      cart[index].qty += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    });

    controlDiv.appendChild(btnMinus);
    controlDiv.appendChild(qtyInput);
    controlDiv.appendChild(btnPlus);
    li.appendChild(controlDiv);

    // Giá tiền
    const priceSpan = document.createElement('span');
    priceSpan.textContent = `${(item.qty * item.price).toLocaleString("vi-VN")}đ`;
    priceSpan.style.width = '100px'; // cố định để không nhảy
    priceSpan.style.textAlign = 'right';
    li.appendChild(priceSpan);

    cartItems.appendChild(li);
  });

  // Tổng tiền
  let totalLi = document.getElementById('cartTotal');
  if (!totalLi) {
    totalLi = document.createElement('li');
    totalLi.id = 'cartTotal';
    totalLi.style.fontWeight = 'bold';
    totalLi.style.marginTop = '10px';
    totalLi.style.textAlign = 'right';
    cartItems.appendChild(totalLi);
  }
  totalLi.textContent = `Tổng tiền: ${totalPrice.toLocaleString("vi-VN")}đ`;
}

function attachAddToCartButtons() {
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.dataset.name;
      addToCart(productName);
    });
  });
}

// THANH TOÁN
const btnThanhToan = document.getElementById("checkoutBtn");
btnThanhToan.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Giỏ hàng đang trống!");
    return;
  }
  window.location.href = "thanhtoan.html";
});

// KHỞI TẠO
fetchProducts();
