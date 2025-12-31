// src/config/brands.ts
// Shared brand configuration for OurPartners and ProductFilters

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
}

export const brands: Brand[] = [
  {
    id: '1',
    name: 'CeraVe',
    logo: '/brands/cerave-logo.png',
    productImage: '/brands/cerave-product.png',
    tagline: 'Developed with Dermatologists',
    slug: 'cerave',
    keywords: ['cerave', 'cera ve'],
  },
  {
    id: '2',
    name: 'Neutrogena',
    logo: '/brands/neutrogena-logo.png',
    productImage: '/brands/neutrogena-product.png',
    tagline: 'Dermatologist Recommended',
    discount: 'Upto 25% Off',
    slug: 'neutrogena',
    keywords: ['neutrogena'],
  },
  {
    id: '3',
    name: 'NIVEA',
    logo: '/brands/nivea-logo.png',
    productImage: '/brands/nivea-product.png',
    tagline: 'Skincare You Can Trust',
    slug: 'nivea',
    keywords: ['nivea'],
  },
  {
    id: '4',
    name: 'La Roche-Posay',
    logo: '/brands/laroche-logo.png',
    productImage: '/brands/laroche-product.png',
    tagline: 'Sensitive Skin Experts',
    slug: 'la-roche-posay',
    keywords: ['la roche', 'laroche', 'roche-posay', 'roche posay'],
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
  },
  {
    id: '6',
    name: 'Bioderma',
    logo: '/brands/bioderma-logo.png',
    productImage: '/brands/bioderma-product.png',
    tagline: 'Biology at the Service of Skin',
    slug: 'bioderma',
    keywords: ['bioderma'],
  },
  {
    id: '7',
    name: 'Eucerin',
    logo: '/brands/eucerin-logo.png',
    productImage: '/brands/eucerin-product.png',
    tagline: 'Medical Skincare',
    slug: 'eucerin',
    keywords: ['eucerin'],
  },
  {
    id: '8',
    name: 'Dove',
    logo: '/brands/dove-logo.png',
    productImage: '/brands/dove-product.png',
    tagline: 'Real Beauty, Real Care',
    slug: 'dove',
    keywords: ['dove'],
  },
  {
    id: '9',
    name: 'Olay',
    logo: '/brands/olay-logo.png',
    productImage: '/brands/olay-product.png',
    tagline: 'Ageless Beauty',
    slug: 'olay',
    keywords: ['olay'],
  },
  {
    id: '10',
    name: 'Garnier',
    logo: '/brands/garnier-logo.png',
    productImage: '/brands/garnier-product.png',
    tagline: 'Take Care',
    slug: 'garnier',
    keywords: ['garnier'],
  },
  {
    id: '11',
    name: "L'Oréal",
    logo: '/brands/loreal-logo.png',
    productImage: '/brands/loreal-product.png',
    tagline: "Because You're Worth It",
    slug: 'loreal',
    keywords: ['loreal', "l'oreal", 'l oreal'],
  },
  {
    id: '12',
    name: 'Maybelline',
    logo: '/brands/maybelline-logo.png',
    productImage: '/brands/maybelline-product.png',
    tagline: 'Maybe She\'s Born With It',
    slug: 'maybelline',
    keywords: ['maybelline'],
  },
];

// Get brand names for filter options
export const getBrandNames = (): string[] => {
  return brands.map(brand => brand.name);
};

// Find brand by name (case insensitive)
export const findBrandByName = (name: string): Brand | undefined => {
  return brands.find(
    brand => brand.name.toLowerCase() === name.toLowerCase()
  );
};

// Check if product matches brand
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
