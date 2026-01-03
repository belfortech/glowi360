// src/config/brands.ts
// Dynamic brand configuration fetched from API with category correlation

import { useBrands, useCategories } from '../hooks/api';
import { Brand as ApiBrand } from '../types/api';

// Legacy interface for backward compatibility
export interface Brand {
  id: string;
  name: string;
  logo: string;
  productImage: string;
  tagline: string;
  discount?: string;
  slug: string;
  // Keywords to match products to this brand
  keywords: string[];
  // Category correlation
  categories?: string[];
}

// Hook to get dynamic brands with category correlation
export const useDynamicBrands = () => {
  const { data: brandsData = [], isLoading: brandsLoading } = useBrands();
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories();

  // Transform API brands to legacy format with category correlation
  const brands: Brand[] = brandsData.map((brand: ApiBrand) => ({
    id: brand.brand_id,
    name: brand.name,
    logo: brand.logo || '/GC360 Marginless.png', // Fallback logo path
    productImage: `/brands/${brand.slug}-product.png`, // Fallback product image
    tagline: brand.description || `${brand.name} Products`,
    slug: brand.slug,
    keywords: [brand.name.toLowerCase(), brand.slug.toLowerCase()],
    categories: brand.category_ids?.map(catId =>
      categoriesData.find(cat => cat.category_id === catId)?.name
    ).filter(Boolean) as string[] || [],
  }));

  return {
    brands,
    isLoading: brandsLoading || categoriesLoading,
    categories: categoriesData,
  };
};

// Legacy static brands array for backward compatibility (deprecated - use useDynamicBrands instead)
export const brands: Brand[] = [
  {
    id: '1',
    name: 'CeraVe',
    logo: '/GC360 Marginless.png',
    productImage: '/brands/cerave-product.png',
    tagline: 'Developed with Dermatologists',
    slug: 'cerave',
    keywords: ['cerave', 'cera ve'],
    categories: ['Skincare'],
  },
  {
    id: '2',
    name: 'Neutrogena',
    logo: '/GC360 Marginless.png',
    productImage: '/brands/neutrogena-product.png',
    tagline: 'Dermatologist Recommended',
    discount: 'Upto 25% Off',
    slug: 'neutrogena',
    keywords: ['neutrogena'],
    categories: ['Skincare'],
  },
  {
    id: '3',
    name: 'NIVEA',
    logo: '/brands/nivea-logo.png',
    productImage: '/brands/nivea-product.png',
    tagline: 'Skincare You Can Trust',
    slug: 'nivea',
    keywords: ['nivea'],
    categories: ['Skincare', 'Body Care'],
  },
  {
    id: '4',
    name: 'La Roche-Posay',
    logo: '/brands/laroche-logo.png',
    productImage: '/brands/laroche-product.png',
    tagline: 'Sensitive Skin Experts',
    slug: 'la-roche-posay',
    keywords: ['la roche', 'laroche', 'roche-posay', 'roche posay'],
    categories: ['Skincare'],
  },
  {
    id: '5',
    name: 'The Ordinary',
    logo: '/brands/ordinary-logo.png',
    productImage: '/brands/ordinary-product.png',
    tagline: 'Clinical Formulations',
    discount: 'Upto 30% Off',
    slug: 'the-ordinary',
    keywords: ['the ordinary', 'ordinary'],
    categories: ['Skincare'],
  },
  {
    id: '6',
    name: 'Bioderma',
    logo: '/brands/bioderma-logo.png',
    productImage: '/brands/bioderma-product.png',
    tagline: 'Biology at the Service of Skin',
    slug: 'bioderma',
    keywords: ['bioderma'],
    categories: ['Skincare'],
  },
  {
    id: '7',
    name: 'Eucerin',
    logo: '/brands/eucerin-logo.png',
    productImage: '/brands/eucerin-product.png',
    tagline: 'Medical Skincare',
    slug: 'eucerin',
    keywords: ['eucerin'],
    categories: ['Skincare'],
  },
  {
    id: '8',
    name: 'Dove',
    logo: '/brands/dove-logo.png',
    productImage: '/brands/dove-product.png',
    tagline: 'Real Beauty, Real Care',
    slug: 'dove',
    keywords: ['dove'],
    categories: ['Body Care', 'Haircare'],
  },
  {
    id: '9',
    name: 'Olay',
    logo: '/brands/olay-logo.png',
    productImage: '/brands/olay-product.png',
    tagline: 'Ageless Beauty',
    slug: 'olay',
    keywords: ['olay'],
    categories: ['Skincare'],
  },
  {
    id: '10',
    name: 'Garnier',
    logo: '/brands/garnier-logo.png',
    productImage: '/brands/garnier-product.png',
    tagline: 'Take Care',
    slug: 'garnier',
    keywords: ['garnier'],
    categories: ['Skincare', 'Haircare'],
  },
  {
    id: '11',
    name: "L'Oréal",
    logo: '/brands/loreal-logo.png',
    productImage: '/brands/loreal-product.png',
    tagline: "Because You're Worth It",
    slug: 'loreal',
    keywords: ['loreal', "l'oreal", 'l oreal'],
    categories: ['Skincare', 'Haircare', 'Makeup'],
  },
  {
    id: '12',
    name: 'Maybelline',
    logo: '/brands/maybelline-logo.png',
    productImage: '/brands/maybelline-product.png',
    tagline: 'Maybe She\'s Born With It',
    slug: 'maybelline',
    keywords: ['maybelline'],
    categories: ['Makeup'],
  },
];

// Get brand names for filter options (legacy - use useDynamicBrands instead)
export const getBrandNames = (): string[] => {
  return brands.map(brand => brand.name);
};

// Find brand by name (case insensitive) (legacy - use useDynamicBrands instead)
export const findBrandByName = (name: string): Brand | undefined => {
  return brands.find(
    brand => brand.name.toLowerCase() === name.toLowerCase()
  );
};

// Check if product matches brand (legacy - use useDynamicBrands instead)
export const productMatchesBrand = (productName: string, brandName: string): boolean => {
  const brand = findBrandByName(brandName);
  if (!brand) return false;

  const lowerProductName = productName.toLowerCase();

  // Check if product name starts with brand name
  if (lowerProductName.startsWith(brand.name.toLowerCase())) {
    return true;
  }

  // Check keywords
  return brand.keywords.some(keyword =>
    lowerProductName.includes(keyword.toLowerCase())
  );
};

export default brands;
