import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- CẤU HÌNH CỬA HÀNG ---
const STORE_INFO = {
  name: "ADIDAS VIETNAM STORE",
  address: "123 Le Loi, Quan 1, TP. Ho Chi Minh",
  phone: "Hotline: 1900 123 456",
  website: "www.adidas-store.vn",
};

// Hàm format tiền tệ
const formatMoney = (amount) => {
  if (amount === null || amount === undefined) return "0";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Hàm xóa dấu Tiếng Việt
const removeVietnameseTones = (str) => {
  if (!str) return "";
  str = str.toString().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
};

export const exportInvoicePDF = (orderData) => {
  const doc = new jsPDF();

  // --- 1. NHẬN DỮ LIỆU ---
  const phoneNumber = orderData.phoneNumber || "";
  const customerName = orderData.customerName || "Khach le";
  const address = orderData.address || "";

  let itemsList = [];
  if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
    itemsList = orderData.orderItems;
  }

  // --- 2. VẼ HEADER ---
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(STORE_INFO.name, 15, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(STORE_INFO.address, 15, 28);
  doc.text(STORE_INFO.phone, 15, 33);
  doc.text(STORE_INFO.website, 15, 38);

  doc.setFontSize(24);
  doc.setTextColor(150);
  doc.text("INVOICE", 150, 25);
  doc.setTextColor(0);

  doc.setLineWidth(0.5);
  doc.line(15, 45, 195, 45);

  // --- 3. THÔNG TIN ---
  const dateVal = orderData.orderDate || new Date();
  const dateObj = new Date(dateVal);
  const dateStr = `${dateObj.getDate()}/${
    dateObj.getMonth() + 1
  }/${dateObj.getFullYear()}`;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("KHACH HANG (BILL TO):", 15, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Ten: ${removeVietnameseTones(customerName)}`, 15, 62);
  doc.text(`SDT: ${phoneNumber}`, 15, 68);

  const splitAddress = doc.splitTextToSize(
    `Dia chi: ${removeVietnameseTones(address)}`,
    90
  );
  doc.text(splitAddress, 15, 74);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("THONG TIN DON HANG:", 120, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Ma don hang: #${orderData.id}`, 120, 62);
  doc.text(`Ngay tao: ${dateStr}`, 120, 68);

  // --- 4. BẢNG SẢN PHẨM ---
  const tableBody = itemsList.map((item, index) => {
    let prodName = removeVietnameseTones(item.productName || "San pham");

    let detailParts = [];
    if (item.colorName)
      detailParts.push(`Mau: ${removeVietnameseTones(item.colorName)}`);
    if (item.sizeValue) detailParts.push(`Size: ${item.sizeValue}`);

    let detailStr = detailParts.join(" - ");

    let displayName = prodName;
    if (detailStr) {
      displayName += `\n(${detailStr})`;
    }

    const qty = item.quantity || 0;
    const price = item.price || 0;
    const total = item.total_money || price * qty;

    return [
      index + 1,
      displayName,
      qty,
      formatMoney(price),
      formatMoney(total),
    ];
  });

  autoTable(doc, {
    startY: 90,
    head: [["STT", "MO TA SAN PHAM", "SL", "DON GIA", "THANH TIEN"]],
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 15 },
      1: { cellWidth: 90 },
      2: { halign: "center", cellWidth: 15 },
      3: { halign: "right", cellWidth: 35 },
      4: { halign: "right", cellWidth: 35 },
    },
    styles: {
      valign: "middle",
      cellPadding: 4,
    },
  });

  // --- 5. TỔNG TIỀN & FOOTER ---
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TONG CONG:", 130, finalY);
  doc.text(`${formatMoney(orderData.total)} VND`, 195, finalY, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("Nguoi mua hang", 30, finalY + 20);
  doc.text("(Ky, ghi ro ho ten)", 30, finalY + 25);

  doc.text("Nguoi ban hang", 150, finalY + 20);
  doc.text("(Ky, ghi ro ho ten)", 150, finalY + 25);

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Cam on quy khach da mua sam tai Adidas Vietnam Store!", 105, 280, {
    align: "center",
  });

  // --- 6. TẠO TÊN FILE CHUẨN ---
  // Format ngày: YYYYMMDD (Ví dụ: 20251209)
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const dateFile = `${year}${month}${day}`;

  // Tên khách hàng viết liền không dấu, viết hoa (Ví dụ: NGUYENVANA)
  const cleanName = removeVietnameseTones(customerName)
    .replace(/\s+/g, "")
    .toUpperCase();

  // Tạo tên file: ADIDAS_HOADON_123_20251209_TENKHACH.pdf
  const fileName = `ADIDAS_HOADON_${orderData.id}_${dateFile}_${cleanName}.pdf`;

  doc.save(fileName);
};
