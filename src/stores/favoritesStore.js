import { defineStore } from 'pinia';

/**
 * Custom Pinia store for managing favorite items.
 * This store handles adding, removing, and persisting favorite items
 * both in local storage and a mock API (JSON Server).
 */
export const useFavoritesStore = defineStore('favorites', {
  // State: The data that the store holds.
  state: () => ({
    // Initialize favoriteItems from local storage.
    // If no data exists, it defaults to an empty array.
    favoriteItems: JSON.parse(localStorage.getItem('favorites')) || [],
  }),

  // Actions: Methods that can change the state.
  actions: {
    /**
     * Fetches full product details from the local pro.json data using the product ID.
     * @param {number} productId The ID of the product to fetch.
     * @returns {Promise<object | null>} The product details object or null if not found.
     */
    async fetchProductDetails(productId) {
      try {
        // Fetch product details from local pro.json file
        const response = await fetch('/pro.json');
        if (!response.ok) {
          throw new Error('Failed to fetch product data.');
        }
        const data = await response.json();
        
        // Find the product in the productDetails array
        const productDetails = data.productDetails.find(product => product.id === productId.toString());
        
        return productDetails || null;
      } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
      }
    },

    /**
     * Saves the current list of favorite items to the mock API using a PUT request.
     * It assumes the favorites resource has an ID (e.g., /favorites/1) in db.json.
     */
    async saveFavoritesToAPI() {
      try {
        await fetch('http://localhost:3000/favorites', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: this.favoriteItems }),
        });
        console.log('Favorites saved to API successfully!');
      } catch (error) {
        console.error('Error saving favorites to API:', error);
      }
    },

    /**
     * Adds a new item to the favorites list.
     * It first checks if the item already exists to prevent duplicates.
     * It attempts to fetch full details from the API, but falls back to
     * basic item info with default values if the API call fails.
     * @param {object} item The item object to add.
     */
    async addFavorite(item) {
      if (!this.favoriteItems.some(fav => fav.id === item.id)) {
        const fullItemDetails = await this.fetchProductDetails(item.id);

        let itemToAdd;

        if (fullItemDetails) {
          // Case 1: Successfully fetched full details.
          itemToAdd = {
            ...fullItemDetails,
            promoCodes: fullItemDetails.promoCodes || [],
            shipping: fullItemDetails.shipping || 'Free Shipping',
            sizes: fullItemDetails.sizingNote || 'Standard fit',
          };
        } else {
          // Case 2: Failed to fetch, use basic info with defaults.
          console.warn('Could not fetch full details for item, adding basic info.');
          itemToAdd = {
...item,
            promoCodes: item.promoCodes || [],
            shipping: item.shipping || 'Free Shipping',
            sizes: item.sizingNote || 'Standard fit',
          };
        }

        this.favoriteItems.push(itemToAdd);
        this.saveFavorites(); // Save to localStorage
        await this.saveFavoritesToAPI(); // Save to API
      }
    },

    /**
     * Removes an item from the favorites list by its ID.
     * @param {number} itemId The ID of the item to remove.
     */
    async removeFavorite(itemId) {
      this.favoriteItems = this.favoriteItems.filter(item => item.id !== itemId);
      this.saveFavorites(); // Save to localStorage
      await this.saveFavoritesToAPI(); // Save to API
    },

    /**
     * Helper function to save the current favorites list to local storage.
     */
    saveFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.favoriteItems));
    },
  },
});