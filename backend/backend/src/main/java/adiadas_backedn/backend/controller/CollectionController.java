package adiadas_backedn.backend.controller;

import adiadas_backedn.backend.model.Collection;
import adiadas_backedn.backend.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// CollectionController.java
@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = "http://localhost:8080")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;

    @GetMapping
    public ResponseEntity<List<Collection>> getAllCollections() {
        try {
            List<Collection> collections = collectionService.getAllCollections();
            return ResponseEntity.ok(collections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Collection> getCollectionById(@PathVariable String id) {
        try {
            return collectionService.getCollectionById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/with-images")
    public ResponseEntity<List<Collection>> getCollectionsWithImages() {
        try {
            List<Collection> collections = collectionService.getCollectionsWithImages();
            return ResponseEntity.ok(collections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/with-videos")
    public ResponseEntity<List<Collection>> getCollectionsWithVideos() {
        try {
            List<Collection> collections = collectionService.getCollectionsWithVideos();
            return ResponseEntity.ok(collections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Collection>> searchCollections(@RequestParam String q) {
        try {
            List<Collection> collections = collectionService.searchCollections(q);
            return ResponseEntity.ok(collections);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<Collection> createCollection(@RequestBody Collection collection) {
        try {
            Collection createdCollection = collectionService.createCollection(collection);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCollection);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Collection> updateCollection(@PathVariable String id, @RequestBody Collection collection) {
        try {
            Collection updatedCollection = collectionService.updateCollection(id, collection);
            return ResponseEntity.ok(updatedCollection);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable String id) {
        try {
            collectionService.deleteCollection(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}