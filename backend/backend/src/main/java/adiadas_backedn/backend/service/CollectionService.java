// CollectionService.java
package adiadas_backedn.backend.service;

import adiadas_backedn.backend.model.Collection;
import adiadas_backedn.backend.repository.CollectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// CollectionService.java
@Service
@Transactional
public class CollectionService {

    @Autowired
    private CollectionRepository collectionRepository;

    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    public Optional<Collection> getCollectionById(String id) {
        return collectionRepository.findById(id);
    }

    public List<Collection> getCollectionsWithImages() {
        return collectionRepository.findCollectionsWithImages();
    }

    public List<Collection> getCollectionsWithVideos() {
        return collectionRepository.findCollectionsWithVideos();
    }

    public List<Collection> searchCollections(String keyword) {
        return collectionRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Collection createCollection(Collection collection) {
        // Generate ID if not provided
        if (collection.getId() == null || collection.getId().isEmpty()) {
            collection.setId(generateCollectionId());
        }
        return collectionRepository.save(collection);
    }

    public Collection updateCollection(String id, Collection collectionDetails) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found with id: " + id));

        // Update fields
        collection.setName(collectionDetails.getName());
        collection.setDescription(collectionDetails.getDescription());
        collection.setImage(collectionDetails.getImage());
        collection.setVideo(collectionDetails.getVideo());
        collection.setLink(collectionDetails.getLink());

        return collectionRepository.save(collection);
    }

    public void deleteCollection(String id) {
        collectionRepository.deleteById(id);
    }

    private String generateCollectionId() {
        return "coll_" + System.currentTimeMillis();
    }
}