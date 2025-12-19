package adiadas_backedn.backend.dto;

import java.util.List;

public class MegaMenuDTO {

    private List<Category> categories;
    private List<Shoe> shoes;

    public MegaMenuDTO(List<Category> categories, List<Shoe> shoes) {
        this.categories = categories;
        this.shoes = shoes;
    }

    public List<Category> getCategories() { return categories; }
    public List<Shoe> getShoes() { return shoes; }

    // -------- Category block (GIÀY HÀNG MỚI VỀ, TRENDING SHOES...) --------
    public static class Category {
        private String title;
        private List<Item> items;

        public Category(String title, List<Item> items) {
            this.title = title;
            this.items = items;
        }

        public String getTitle() { return title; }
        public List<Item> getItems() { return items; }
    }

    // -------- Item trong Category --------
    public static class Item {
        private String id;
        private String name;

        public Item(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() { return id; }
        public String getName() { return name; }
    }

    // -------- Card giày có hình --------
    public static class Shoe {
        private String id;
        private String name;
        private String image;
        private String category;

        public Shoe(String id, String name, String image, String category) {
            this.id = id;
            this.name = name;
            this.image = image;
            this.category = category;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getImage() { return image; }
        public String getCategory() { return category; }
    }
}
