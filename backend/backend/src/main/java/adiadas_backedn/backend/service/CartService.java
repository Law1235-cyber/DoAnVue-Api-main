package adiadas_backedn.backend.service;

 // Đảm bảo import đúng DTO response
import adiadas_backedn.backend.model.*;
import adiadas_backedn.backend.repository.CartItemRepository;
import adiadas_backedn.backend.repository.CartRepository;
import adiadas_backedn.backend.repository.ProductRepository; // 🔥 Import thêm
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository; // 🔥 Cần cái này để tìm Product

    public CartResponse getCartByUserId(String userId) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> createNewCart(userId));

        return convertToCartResponse(cart);
    }

    public CartResponse addItemToCart(String userId, CartItemRequest itemRequest) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> createNewCart(userId));

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductIdAndColorNameAndSizeValue(
                cart.getId(), itemRequest.getProductId(), itemRequest.getColorName(), itemRequest.getSizeValue());

        if (existingItem.isPresent()) {
            // Update quantity if item exists
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + itemRequest.getQuantity());
            cartItemRepository.save(item);
        } else {
            // 🔥 SỬA LẠI LOGIC TẠO MỚI ITEM TẠI ĐÂY

            // 1. Tìm Product từ Database trước
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            // 2. Tạo CartItem bằng Constructor rỗng và Setter (An toàn nhất)
            CartItem newItem = new CartItem();
            newItem.setProduct(product); // Gán Object Product vào
            newItem.setProductName(itemRequest.getProductName());
            newItem.setImage(itemRequest.getImage());

            // Convert giá từ Double/String sang BigDecimal nếu cần
            // Giả sử itemRequest.getPrice() trả về BigDecimal thì gán thẳng
            // Nếu trả về Double thì dùng: BigDecimal.valueOf(itemRequest.getPrice())
            newItem.setPrice(itemRequest.getPrice());

            newItem.setColorName(itemRequest.getColorName());
            newItem.setSizeValue(itemRequest.getSizeValue());
            newItem.setQuantity(itemRequest.getQuantity());
            newItem.setCart(cart);

            // 3. Thêm vào danh sách
            cart.getCartItems().add(newItem);
        }

        // Recalculate total
        cart.calculateTotal();
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    public CartResponse updateItemQuantity(String userId, String productId,
                                           String colorName, String sizeValue, Integer quantity) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findByCartIdAndProductIdAndColorNameAndSizeValue(
                        cart.getId(), productId, colorName, sizeValue)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        cart.calculateTotal();
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    public CartResponse removeItemFromCart(String userId, String productId,
                                           String colorName, String sizeValue) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCartIdAndProductIdAndColorNameAndSizeValue(
                cart.getId(), productId, colorName, sizeValue);

        // Refresh cart
        cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.calculateTotal();
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    public void clearCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getCartItems().clear();
        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private Cart createNewCart(String userId) {
        String cartId = UUID.randomUUID().toString().substring(0, 8);
        Cart cart = new Cart(cartId, userId);
        return cartRepository.save(cart);
    }

    private CartResponse convertToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(), // 🔥 Lấy ID từ object Product
                        item.getProductName(),
                        item.getImage(),
                        item.getPrice(),
                        item.getColorName(),
                        item.getSizeValue(),
                        item.getQuantity()
                ))
                .collect(Collectors.toList());

        return new CartResponse(
                cart.getId(),
                cart.getUserId(),
                cart.getTotal(),
                itemResponses
        );
    }
}