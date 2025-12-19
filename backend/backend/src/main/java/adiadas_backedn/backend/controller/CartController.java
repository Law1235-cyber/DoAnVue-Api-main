package adiadas_backedn.backend.controller;


import adiadas_backedn.backend.model.CartItemRequest;
import adiadas_backedn.backend.model.CartResponse;
import adiadas_backedn.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:8080") // Vue.js dev server
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable String userId) {
        try {
            CartResponse cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartResponse> addItemToCart(
            @PathVariable String userId,
            @RequestBody CartItemRequest itemRequest) {
        try {
            CartResponse cart = cartService.addItemToCart(userId, itemRequest);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{userId}/items")
    public ResponseEntity<CartResponse> updateItemQuantity(
            @PathVariable String userId,
            @RequestParam String productId,
            @RequestParam String colorName,
            @RequestParam String sizeValue,
            @RequestParam Integer quantity) {
        try {
            CartResponse cart = cartService.updateItemQuantity(userId, productId, colorName, sizeValue, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}/items")
    public ResponseEntity<CartResponse> removeItemFromCart(
            @PathVariable String userId,
            @RequestParam String productId,
            @RequestParam String colorName,
            @RequestParam String sizeValue) {
        try {
            CartResponse cart = cartService.removeItemFromCart(userId, productId, colorName, sizeValue);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}