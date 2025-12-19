// Collection.java
package adiadas_backedn.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Collection.java
@Entity
@Table(name = "collections")
public class Collection {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    private String image;
    private String video;
    private String link;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public Collection() {
        this.createdAt = LocalDateTime.now();
    }

    public Collection(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getVideo() { return video; }
    public void setVideo(String video) { this.video = video; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}