// script.js
document.addEventListener("DOMContentLoaded", () => {
    const categoriesContainer = document.getElementById("categories");
    const productsContainer = document.getElementById("products");
    const paginationContainer = document.getElementById("pagination");
    const loader = document.getElementById("loader");
    
    let products = [];
    let categories = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    function showLoader() {
        loader.style.display = "block";
    }

    function hideLoader() {
        loader.style.display = "none";
    }

    async function fetchCategories() {
        showLoader();
        try {
            const response = await fetch("https://fakestoreapi.com/products/categories");
            if (!response.ok) throw new Error("Failed to fetch categories");
            categories = await response.json();
            renderCategories();
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            hideLoader();
        }
    }

    async function fetchProducts(category = "") {
        showLoader();
        let url = "https://fakestoreapi.com/products";
        if (category) url = `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch products");
            products = await response.json();
            currentPage = 1;
            renderProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
            productsContainer.innerHTML = "<p>Failed to load products. Try again.</p>";
        } finally {
            hideLoader();
        }
    }

    function renderCategories() {
        categoriesContainer.innerHTML = categories.map(cat => 
            `<button class="category-btn" onclick="filterByCategory('${cat.replace(/'/g, "\\'")}')">${cat}</button>`
        ).join("");
    }

    function renderProducts() {
        if (products.length === 0) {
            productsContainer.innerHTML = "<p>No products available.</p>";
            paginationContainer.innerHTML = "";
            return;
        }

        const start = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = products.slice(start, start + itemsPerPage);
        
        productsContainer.innerHTML = paginatedProducts.map(product => 
            `<div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.price} $</p>
            </div>`
        ).join("");
        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        paginationContainer.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.innerHTML += 
                `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
    }

    window.filterByCategory = (category) => {
        console.log("Fetching products for category:", category);
        fetchProducts(category);
    }

    window.changePage = (page) => {
        currentPage = page;
        renderProducts();
    }

    fetchCategories();
    fetchProducts();
});