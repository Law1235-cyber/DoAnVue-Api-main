import { computed, ref } from 'vue';

export function useProductSort(products) {
  const sortOption = ref('name-asc');

  const sortedProducts = computed(() => {
    const source = Array.isArray(products.value) ? [...products.value] : [];

    source.sort((a, b) => {
      switch (sortOption.value) {
        case 'name-asc':
          return (a?.name ?? '').localeCompare(b?.name ?? '', 'vi', { sensitivity: 'base' });
        case 'name-desc':
          return (b?.name ?? '').localeCompare(a?.name ?? '', 'vi', { sensitivity: 'base' });
        case 'price-asc':
          return (a?.price ?? 0) - (b?.price ?? 0);
        case 'price-desc':
          return (b?.price ?? 0) - (a?.price ?? 0);
        default:
          return 0;
      }
    });

    return source;
  });

  return { sortOption, sortedProducts };
}
