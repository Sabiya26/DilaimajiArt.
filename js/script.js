// ===== NAVBAR MENU (MOBILE) =====
const navbarNav = document.querySelector(".navbar-nav");
const Product = document.querySelector("#Product-menu");

Product.onclick = () => {
  navbarNav.classList.toggle("active");
};

document.addEventListener("click", function (e) {
  if (!Product.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// ===== SEARCH FORM =====
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchIcon = document.querySelector("#search");

searchIcon.onclick = (e) => {
  e.preventDefault();
  searchForm.classList.toggle("active");
  searchBox.focus();
};

// ===== MODAL DETAIL PRODUK =====
const itemDetailModal = document.querySelector("#item-detail-modal");

document.querySelectorAll(".item-detail-button").forEach((btn) => {
  btn.onclick = (e) => {
    e.preventDefault();
    const card = btn.closest(".product-card");

    itemDetailModal.querySelector("img").src = card.dataset.img;
    itemDetailModal.querySelector("h3").textContent = card.dataset.name;
    itemDetailModal.querySelector(".product-price").innerHTML =
      `${card.dataset.price} <span>IDR 55K</span>`;
    itemDetailModal.style.display = "flex";
  };
});

const closeModalBtn = document.querySelector("#item-detail-modal .close-icon");
if (closeModalBtn) {
  closeModalBtn.onclick = (e) => {
    e.preventDefault();
    itemDetailModal.style.display = "none";
  };
}

// ===== SHOPPING CART =====
const shoppingCart = document.querySelector(".shopping-cart");
const cartIcon = document.querySelector("#shopping-cart");

let cart = []; // ← Hanya 1 deklarasi cart

cartIcon.onclick = (e) => {
  e.preventDefault();
  shoppingCart.classList.toggle("active");
};

document.addEventListener("click", function (e) {
  if (!searchIcon.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (!cartIcon.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

// ===== RENDER CART (hanya 1 fungsi) =====
function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartFooter = document.getElementById("cart-footer");
  const cartTotalItems = document.getElementById("cart-total-items");
  const cartBadge = document.getElementById("cart-badge");

  if (cart.length === 0) {
    cartList.innerHTML = `
      <p style="text-align:center; padding:30px 20px; color:#aaa; font-size:14px;">
        🛍️ Keranjang masih kosong
      </p>`;
    if (cartFooter) cartFooter.style.display = "none";
    if (cartTotalItems) cartTotalItems.innerText = "0 item";
    cartBadge.innerText = 0;
    cartBadge.style.display = "none";
    return;
  }

  let total = 0;
  let html = "";

  cart.forEach((item, index) => {
    const hargaAngka = parseInt(item.price.replace(/[^0-9]/g, "")) * 1000;
    total += hargaAngka * item.qty;

    html += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${item.price}</p>
          <div class="cart-qty-control">
            <button class="cart-qty-btn" onclick="changeQty(${index}, -1)">−</button>
            <span class="cart-qty-number">${item.qty}</span>
            <button class="cart-qty-btn" onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>
        <button class="cart-delete-btn" onclick="removeFromCart(${index})">🗑️</button>
      </div>
    `;
  });

  cartList.innerHTML = html;

  if (cartFooter) {
    cartFooter.style.display = "block";
    document.getElementById("cart-total-price").innerText =
      `IDR ${(total / 1000).toFixed(0)}K`;
  }

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartTotalItems) cartTotalItems.innerText = `${totalQty} item`;
  cartBadge.innerText = totalQty;
  cartBadge.style.display = "flex";

  feather.replace();
}

// ===== FUNGSI CART =====
function addToCart(name, price, img) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  renderCart();
  shoppingCart.classList.add("active");
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// ===== TOMBOL ADD TO CART (hanya 1 listener) =====
document.querySelectorAll(".add-to-cart-button").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const card = this.closest(".product-card");
    addToCart(card.dataset.name, card.dataset.price, card.dataset.img);
  });
});

// ===== INISIALISASI =====
renderCart();
feather.replace();

// ===== PORTFOLIO SLIDER =====
const portoTrack = document.getElementById("portoTrack");
const portoPrev = document.getElementById("portoPrev");
const portoNext = document.getElementById("portoNext");

const itemWidth = 250 + 20; // lebar item + gap
let portoOffset = 0;
let isManual = false;
let resumeTimer;

// Hitung total lebar item asli (bukan duplikat)
const totalItems = document.querySelectorAll(".portfolio-item").length;
const maxOffset = -(itemWidth * totalItems);

function setManualMode() {
  isManual = true;
  portoTrack.classList.add("manual-mode");

  // Kembali ke auto setelah 5 detik tidak diklik
  clearTimeout(resumeTimer);
  resumeTimer = setTimeout(() => {
    isManual = false;
    portoTrack.classList.remove("manual-mode");
    portoTrack.style.transform = "translateX(0)";
    portoOffset = 0;
  }, 5000);
}

portoNext.addEventListener("click", () => {
  setManualMode();
  portoOffset -= itemWidth;

  // Batas kanan: tidak melebihi item terakhir
  if (portoOffset < maxOffset + itemWidth) {
    portoOffset = 0;
  }

  portoTrack.style.transform = `translateX(${portoOffset}px)`;
});

portoPrev.addEventListener("click", () => {
  setManualMode();
  portoOffset += itemWidth;

  // Batas kiri: tidak melebihi item pertama
  if (portoOffset > 0) {
    portoOffset = maxOffset + itemWidth;
  }

  portoTrack.style.transform = `translateX(${portoOffset}px)`;
});
