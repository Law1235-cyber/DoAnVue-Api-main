package adiadas_backedn.backend.repository;

import adiadas_backedn.backend.model.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

// CollectionRepository.java
@Repository
public interface CollectionRepository extends JpaRepository<Collection, String> {

    // Query collections có image (không phải video)
    @Query("SELECT c FROM Collection c WHERE c.image IS NOT NULL")
    List<Collection> findCollectionsWithImages();

    // Query collections có video
    @Query("SELECT c FROM Collection c WHERE c.video IS NOT NULL")
    List<Collection> findCollectionsWithVideos();

    // Search collections by name
    List<Collection> findByNameContainingIgnoreCase(String name);
}