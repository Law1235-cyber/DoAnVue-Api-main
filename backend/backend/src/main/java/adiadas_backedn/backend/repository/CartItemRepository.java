package adiadas_backedn.backend.repository;

import adiadas_backedn.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // Import cái này
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 🔥 SỬA LẠI CÂU QUERY NÀY
    // Thay "ci.productId" bằng "ci.product.id"
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.product.id = :productId AND ci.colorName = :colorName AND ci.sizeValue = :sizeValue")
    Optional<CartItem> findByCartIdAndProductIdAndColorNameAndSizeValue(String cartId, String productId, String colorName, String sizeValue);

    // 🔥 SỬA LẠI CÂU DELETE NÀY
    // Thay "ci.productId" bằng "ci.product.id"
    @Modifying // Bắt buộc phải có @Modifying cho câu lệnh DELETE/UPDATE
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId AND ci.product.id = :productId AND ci.colorName = :colorName AND ci.sizeValue = :sizeValue")
    void deleteByCartIdAndProductIdAndColorNameAndSizeValue(String cartId, String productId, String colorName, String sizeValue);
}