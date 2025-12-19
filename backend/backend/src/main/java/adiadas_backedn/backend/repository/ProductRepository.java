package adiadas_backedn.backend.repository;

import adiadas_backedn.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    @Query("SELECT p FROM Product p WHERE p.featured = true")
    List<Product> findFeaturedProducts();

    @Query(value = "SELECT * FROM products WHERE featured = 1", nativeQuery = true)
    List<Product> findFeaturedProductsNative();

    List<Product> findByCategory(String category);

    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") Double minPrice,
                                   @Param("maxPrice") Double maxPrice);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);

    // CẬP NHẬT: Thêm LEFT JOIN FETCH cho videos
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.images i " +
            "LEFT JOIN FETCH p.colors c " +
            "LEFT JOIN FETCH p.sizes s " +
            "LEFT JOIN FETCH p.videos v " + // THÊM DÒNG NÀY
            "WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") String id);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.id = :id")
    Optional<Product> findByIdWithImages(@Param("id") String id);

    // THÊM: Query riêng để lấy videos của sản phẩm
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.videos WHERE p.id = :id")
    Optional<Product> findByIdWithVideos(@Param("id") String id);

    @Query(value = "SELECT * FROM products ORDER BY created_at DESC LIMIT 4", nativeQuery = true)
    List<Product> findTop4NewestProductsNative();
}