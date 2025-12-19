package adiadas_backedn.backend.repository;


import adiadas_backedn.backend.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {

    Optional<Cart> findByUserId(String userId);

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems WHERE c.userId = :userId")
    Optional<Cart> findByUserIdWithItems(@Param("userId") String userId);

    boolean existsByUserId(String userId);
}