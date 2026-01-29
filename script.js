// Dữ liệu toàn cục
let allProducts = [];
let filteredProducts = [];
let currentSort = null;

// Hàm tải dữ liệu từ db.json
async function loadData() {
    try {
        const response = await fetch('db.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        // Cập nhật thống kê
        updateStats();
        
        // Render bảng
        renderTable();
        
        console.log('✅ Dữ liệu đã tải thành công:', allProducts.length, 'sản phẩm');
    } catch (error) {
        console.error('❌ Lỗi khi tải dữ liệu:', error);
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    <strong>Lỗi:</strong> Không thể tải dữ liệu. ${error.message}
                </td>
            </tr>
        `;
    }
}

// Hàm cập nhật thống kê
function updateStats() {
    document.getElementById('totalProducts').textContent = allProducts.length;
    document.getElementById('foundProducts').textContent = filteredProducts.length;
}

// Hàm tìm kiếm (onChanged)
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    // Lọc sản phẩm theo tên
    filteredProducts = allProducts.filter(product => {
        const title = product.title.toLowerCase();
        const description = product.description.toLowerCase();
        return title.includes(searchTerm) || description.includes(searchTerm);
    });
    
    // Nếu có sắp xếp, áp dụng lại
    if (currentSort) {
        applySort(currentSort);
    }
    
    // Cập nhật thống kê và render
    updateStats();
    renderTable();
}

// Hàm sắp xếp
function handleSort(event) {
    const sortType = event.target.dataset.sort;
    currentSort = sortType;
    
    // Cập nhật trạng thái nút
    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Áp dụng sắp xếp
    applySort(sortType);
    
    // Render bảng
    renderTable();
}

// Hàm áp dụng sắp xếp
function applySort(sortType) {
    switch (sortType) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title, 'vi'));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title, 'vi'));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
    }
}

// Hàm định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Hàm cắt ngắn văn bản
function truncateText(text, maxLength = 50) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Hàm render bảng
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const noData = document.getElementById('noData');
    
    // Nếu không có dữ liệu
    if (filteredProducts.length === 0) {
        tableBody.style.display = 'none';
        noData.style.display = 'block';
        return;
    }
    
    tableBody.style.display = 'table-body-group';
    noData.style.display = 'none';
    
    // Xóa dòng cũ
    tableBody.innerHTML = '';
    
    // Thêm dòng mới
    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        
        // Xử lý hình ảnh
        const imageUrl = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/60?text=No+Image';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="${imageUrl}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/60?text=Error'">
            </td>
            <td>
                <strong>${product.title}</strong><br>
                <small class="text-muted-small">ID: ${product.id}</small>
            </td>
            <td>
                <small>${truncateText(product.description)}</small>
            </td>
            <td>
                <span class="category-badge">${product.category.name}</span>
            </td>
            <td>
                <span class="price-badge">${product.price.toLocaleString('vi-VN')} ₫</span>
            </td>
            <td>
                <small class="text-muted-small">${formatDate(product.creationAt)}</small>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Gán sự kiện khi trang tải
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu
    loadData();
    
    // Gán sự kiện tìm kiếm (onChanged)
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Gán sự kiện sắp xếp
    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.addEventListener('click', handleSort);
    });
    
    console.log('✅ Ứng dụng đã sẵn sàng!');
});
