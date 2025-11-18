console.log("staff.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.querySelector("#olist tbody");
    const searchInput = document.getElementById("searchOrder");
    const filterStatus = document.getElementById("filterStatus");
    // Thêm các input ngày
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    let orders = [];

    // Hàm tiện ích: chuẩn hóa ngày về đầu ngày (00:00:00)
    function normalizeDate(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        // Đặt giờ, phút, giây, mili giây về 0
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    // Hàm tiện ích: chuẩn hóa ngày về cuối ngày (23:59:59)
    function normalizeEndDate(dateString) {
        if (!dateString) return null;
        const date = new Date(dateString);
        // Đặt giờ, phút, giây, mili giây về cuối ngày
        date.setHours(23, 59, 59, 999);
        return date.getTime();
    }

    // 1. Lấy danh sách đơn hàng
    async function fetchOrders() {
        try {
            const res = await fetch("http://localhost:3000/donhang");
            if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");

            orders = await res.json();
            console.log("DỮ LIỆU TỪ BACKEND:", orders);
            renderOrders(orders);

        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `
                <tr><td colspan="5" style="text-align:center; color:red;">Không thể tải dữ liệu.</td></tr>
            `;
        }
    }

    // 2. Render danh sách
    function renderOrders(list) {
        tableBody.innerHTML = "";
        if (list.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="5" style="text-align:center; color:#555;">Không tìm thấy đơn hàng nào phù hợp.</td></tr>
            `;
            return;
        }

        list.forEach(order => {
            const dh = order.donhangs?.[0];
            if (!dh) return; // bỏ qua nếu không có đơn

            const maDonHang = dh.MaDonHang;
            const trangThai = dh.TrangThai;

            const tr = document.createElement("tr");

            // Dropdown trạng thái: luôn enable, disable sau khi chọn Hoàn tất
            let statusHtml = `<select class="status-select" data-id="${maDonHang}" ${trangThai === "Hoàn tất" ? "disabled" : ""}>
                <option value="Chờ xử lý" ${trangThai === "Chờ xử lý" ? "selected" : ""}>Chờ xử lý</option>
                <option value="Đang giao" ${trangThai === "Đang giao" ? "selected" : ""}>Đang giao</option>
                <option value="Hoàn tất" ${trangThai === "Hoàn tất" ? "selected" : ""}>Hoàn tất</option>
            </select>`;

            tr.innerHTML = `
                <td>${maDonHang}</td>
                <td>${new Date(order.NgayXuatHoaDon).toLocaleString("vi-VN")}</td>
                <td>${Number(order.TongTien).toLocaleString("vi-VN")} ₫</td>
                <td>${statusHtml}</td>
                <td><button class="detail-btn" data-id="${maDonHang}">Chi tiết</button></td>
            `;

            tableBody.appendChild(tr);
        });
    }

    // 5 & 6. Hàm lọc và tìm kiếm chung
    function applyFilters() {
        const keyword = searchInput.value.trim().toLowerCase();
        const status = filterStatus.value;
        const startDate = normalizeDate(startDateInput.value);
        const endDate = normalizeEndDate(endDateInput.value);

        const filteredOrders = orders.filter(o => {
            const maDonHang = (o.donhangs?.[0]?.MaDonHang || "").toLowerCase();
            const orderStatus = o.donhangs?.some(dh => dh.TrangThai === status) || status === "";
            
            // Lọc theo khoảng ngày
            const orderDate = normalizeDate(o.NgayXuatHoaDon);
            let dateFilter = true;
            
            if (startDate && orderDate < startDate) {
                dateFilter = false;
            }
            if (endDate && orderDate > endDate) {
                dateFilter = false;
            }

            // Kết hợp tất cả các điều kiện: ID, Trạng thái, Khoảng ngày
            return maDonHang.includes(keyword) && orderStatus && dateFilter;
        });

        renderOrders(filteredOrders);
    }
    
    // Gắn sự kiện lắng nghe cho tất cả các bộ lọc
    searchInput.addEventListener("input", applyFilters);
    filterStatus.addEventListener("change", applyFilters);
    startDateInput.addEventListener("change", applyFilters);
    endDateInput.addEventListener("change", applyFilters);

    // 3. Click "Chi tiết" hiển thị hóa đơn (Giữ nguyên)
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("detail-btn")) {
            const maDonHang = e.target.dataset.id;

            try {
                const res = await fetch(`http://localhost:3000/donhang/${maDonHang}`);
                if (!res.ok) throw new Error("Không thể tải chi tiết đơn hàng");
                const data = await res.json();

                const hoaDon = data[0]?.hoaDon;
                if (!hoaDon) return alert("Không tìm thấy hóa đơn");

                document.getElementById("ct_mahd").textContent = hoaDon.MaHoaDon;
                document.getElementById("ct_madh").textContent = maDonHang;
                document.getElementById("ct_ngay").textContent =
                    new Date(hoaDon.NgayXuatHoaDon).toLocaleString("vi-VN");
                document.getElementById("ct_tongtien").textContent =
                    Number(hoaDon.TongTien).toLocaleString("vi-VN") + " ₫";

                const infoRow = document.getElementById("ct_info");
                infoRow.textContent = (hoaDon.ThongTinKhachHang || "Không có thông tin").split(", ").join("\n");

                // Render danh sách sản phẩm
                const tbody = document.getElementById("detailBody");
                tbody.innerHTML = "";
                if (hoaDon.ThongTinSanPham) {
                    const productNames = hoaDon.ThongTinSanPham.split(",").map(p => p.trim());
                    const res2 = await fetch("http://localhost:3000/traicay");
                    const allProducts = await res2.json();

                    productNames.forEach((name, index) => {
                        const product = allProducts.find(p => p.TenTraiCay === name);
                        const price = product ? Number(product.GiaTien) : 0;

                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${product ? product.MaTraiCay : "--"}</td>
                            <td>${name}</td>
                            <td>1</td>
                            <td>${price.toLocaleString("vi-VN")} ₫</td>
                        `;
                        tbody.appendChild(tr);
                    });
                }

                openInvoiceModal();

            } catch (err) {
                console.error(err);
                alert("Lỗi khi tải chi tiết: " + err.message);
            }
        }
    });

    // 4. Cập nhật trạng thái khi chọn dropdown (Giữ nguyên)
    document.addEventListener("change", async (e) => {
        if (e.target.classList.contains("status-select")) {
            const select = e.target;
            const newStatus = select.value;
            const maDonHang = select.dataset.id;

            try {
                const res = await fetch(`http://localhost:3000/donhang/${maDonHang}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                });
                if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

                if (newStatus === "Hoàn tất") {
                    select.disabled = true;
                }

                alert("Cập nhật trạng thái thành công!");
                // Cập nhật lại danh sách sau khi thay đổi trạng thái (Nếu cần, có thể fetchOrders lại)
                // Tuy nhiên, ở đây ta chỉ cần disable dropdown nếu là 'Hoàn tất'
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    });

    // MODAL (Giữ nguyên)
    function openInvoiceModal() { document.getElementById("invoiceModal").style.display = "flex"; }
    function closeInvoiceModal() { document.getElementById("invoiceModal").style.display = "none"; }
    window.closeInvoiceModal = closeInvoiceModal;

    // Khởi tạo
    fetchOrders();
});