package adiadas_backedn.backend.controller;

import adiadas_backedn.backend.dto.SePayWebhookDto;
import adiadas_backedn.backend.model.Order;
import adiadas_backedn.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")

public class PaymentController {

    @Autowired
    private OrderRepository orderRepository;

    // Sửa dòng này: Đổi từ SePayWebhookDto sang Map<String, Object>
    @PostMapping("/webhook")
    public ResponseEntity<String> handleSePayWebhook(@RequestBody java.util.Map<String, Object> payload) {
        try {
            System.out.println("🔥 DATA GỐC TỪ SEPAY: " + payload);

            // --- PHẦN 1: TỰ ĐỘNG NHẬN DIỆN DỮ LIỆU ---
            String content = null;
            BigDecimal receivedAmount = BigDecimal.ZERO;

            // Kiểm tra: Đây là cấu trúc "Gửi Test" hay "Chuyển thật"?
            if (payload.containsKey("transaction")) {
                // => TRƯỜNG HỢP: TEST INTEGRATION (Nút Gửi Test)
                System.out.println("⚡ Phát hiện chế độ TEST từ SePay");
                java.util.Map<String, Object> transaction = (java.util.Map<String, Object>) payload.get("transaction");
                java.util.Map<String, Object> order = (java.util.Map<String, Object>) payload.get("order");

                // Lấy số tiền từ transaction_amount
                Object amountObj = transaction.get("transaction_amount");
                receivedAmount = new BigDecimal(String.valueOf(amountObj));

                // Lấy nội dung (Trong chế độ test thường là order_id hoặc description)
                // Ví dụ Test gửi: "order_id": "TEST_ORDER_..."
                content = (String) order.get("order_id");
            } else {
                // => TRƯỜNG HỢP: CHUYỂN KHOẢN THẬT (Quan trọng nhất)
                System.out.println("💰 Phát hiện giao dịch THẬT");
                content = (String) payload.get("content");

                Object amountObj = payload.get("transferAmount");
                if (amountObj != null) {
                    receivedAmount = new BigDecimal(String.valueOf(amountObj));
                }
            }

            System.out.println("📩 Dữ liệu đã xử lý: Content=" + content + " | Amount=" + receivedAmount);

            // --- PHẦN 2: XỬ LÝ ĐƠN HÀNG (Logic cũ) ---

            // Tách mã đơn hàng
            String extractedId = extractOrderIdFromContent(content);

            if (extractedId != null) {
                // *Lưu ý: Nếu là Test thì ID là "TEST_ORDER_...", chắc chắn tìm ko thấy trong DB
                // Code vẫn sẽ chạy ổn và báo "Không tìm thấy", không bị Crash nữa.
                Optional<Order> orderOpt = orderRepository.findById(extractedId);

                if (orderOpt.isPresent()) {
                    Order order = orderOpt.get();
                    BigDecimal orderTotal = order.getTotal() != null ? order.getTotal() : BigDecimal.ZERO;

                    if (receivedAmount.compareTo(orderTotal) >= 0) {
                        order.setStatus("PAID");
                        orderRepository.save(order);
                        System.out.println("✅ THANH TOÁN THÀNH CÔNG: " + extractedId);
                    } else {
                        System.out.println("⚠️ Thiếu tiền: Đơn=" + orderTotal + ", Nhận=" + receivedAmount);
                    }
                } else {
                    System.out.println("❌ Không tìm thấy Order ID trong DB: " + extractedId);
                }
            } else {
                System.out.println("⚠️ Không tìm thấy mã ORD-... trong nội dung: " + content);
            }

            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("Error Handled");
        }
    }

    // API Polling cho Vue
    @GetMapping("/check-status/{orderId}")
    public ResponseEntity<?> checkOrderStatus(@PathVariable String orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        return order.map(value -> ResponseEntity.ok(value.getStatus()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Hàm tách ID từ nội dung chuyển khoản
    // Hàm tách ID từ nội dung chuyển khoản (Đã nâng cấp)
    private String extractOrderIdFromContent(String content) {
        if (content == null) return null;

        // 1. Chuẩn hóa nội dung: Viết hoa hết để dễ tìm
        content = content.toUpperCase();

        // 2. Regex linh hoạt:
        // (ORD)   : Tìm chữ ORD
        // [-_ ]?  : Có thể có dấu gạch ngang (-), gạch dưới (_), khoảng trắng ( ), hoặc KHÔNG CÓ GÌ cả
        // ([a-zA-Z0-9]+) : Theo sau là chuỗi ký tự (mã đơn)
        Pattern pattern = Pattern.compile("(ORD[-_ ]?[a-zA-Z0-9]+)");
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            String fullId = matcher.group(1); // Ví dụ lấy được: "ORD12345" hoặc "ORD-12345"

            // 3. Xử lý chuẩn hóa lại format giống trong Database (Ví dụ DB lưu là: ORD-12345)
            // Nếu chuỗi lấy được KHÔNG chứa dấu gạch ngang, ta tự chèn vào
            if (!fullId.contains("-")) {
                // Biến "ORD12345" thành "ORD-12345"
                return fullId.replace("ORD", "ORD-");
            }

            return fullId;
        }
        return null;
    }
}