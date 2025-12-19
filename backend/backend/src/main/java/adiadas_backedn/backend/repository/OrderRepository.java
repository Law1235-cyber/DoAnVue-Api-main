package adiadas_backedn.backend.repository;

import adiadas_backedn.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    @Query("SELECT SUM(o.orderValue) FROM Order o")
    Double sumTotalRevenue();

    List<Order> findByStatusAndOrderDateBefore(String status, LocalDateTime cutoffTime);

    @Query("SELECT o FROM Order o WHERE o.paymentMethod = 'QR_CODE' AND o.status = 'PENDING' AND o.orderDate < :cutoff")
    List<Order> findExpiredPendingOrders(@Param("cutoff") LocalDateTime cutoff);
}
