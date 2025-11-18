async function fetchData(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("Lỗi fetch:", err);
    return null;
  }
}

async function loadDashboard() {
  // 1. Tổng sản phẩm đã bán ra (sum SoLuong từ DonHang)
  const soldProducts = await fetchData("/baocao/banchay?limit=1000"); 
  let totalSold = 0;
  if (soldProducts && Array.isArray(soldProducts)) {
    totalSold = soldProducts.reduce((sum, item) => sum + item.TongBan, 0);
  }
  document.getElementById("m_products").textContent = totalSold;

  // 2. Tổng đơn hàng (đếm số hóa đơn)
  const orders = await fetchData("/baocao/doanhthu?type=day"); 
  let totalOrders = 0;
  if (orders && Array.isArray(orders)) {
    // giả sử mỗi dòng doanh thu = 1 đơn hàng, hoặc bạn có thể tạo API riêng để count
    totalOrders = orders.length;
  }
  document.getElementById("m_orders").textContent = totalOrders;

  // 3. Trái cây bán chạy nhất trong 7 ngày
  const bestSelling = await fetchData("/baocao/banchay?limit=1");
  if (bestSelling && bestSelling.length > 0) {
    document.getElementById("m_best_selling_fruit").textContent = bestSelling[0].Ten || bestSelling[0].MaTraiCay;
  }

  // 4. Báo cáo doanh thu (7 ngày gần nhất)
  const today = new Date();
  const to = today.toISOString().split("T")[0];
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - 7);
  const from = fromDate.toISOString().split("T")[0];

  const revenue = await fetchData(`/baocao/doanhthu?type=day&from=${from}&to=${to}`);
  let totalRevenue = 0;
  if (revenue && Array.isArray(revenue)) {
    totalRevenue = revenue.reduce((sum, r) => sum + Number(r.TongDoanhThu), 0);
  }
  document.getElementById("m_revenue").textContent = totalRevenue.toLocaleString("vi-VN") + " đ";
}

// Gọi khi load trang
document.addEventListener("DOMContentLoaded", loadDashboard);