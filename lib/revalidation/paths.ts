/**
 * ISR Revalidation Path Mapping
 *
 * Maps entity types to the paths that need revalidation when content changes
 */

export interface RevalidationResult {
  path: string;
  success: boolean;
  error?: string;
}

/**
 * Get paths to revalidate when a dish changes
 */
export function getDishRevalidationPaths(dish: any): string[] {
  const paths: string[] = [];

  // Always revalidate the dishes list endpoint
  paths.push('/api/public/dishes');

  // Revalidate the specific dish page
  if (dish.slug) {
    paths.push(`/api/public/dishes/${dish.slug}`);
  }

  // Revalidate type-specific menu pages
  if (dish.type === 'RESTAURANT') {
    paths.push('/menu');
  } else if (dish.type === 'CATERING') {
    paths.push('/catering');
  } else if (dish.type === 'EVENT') {
    paths.push('/events');
  }

  return paths;
}

/**
 * Get paths to revalidate when a category changes
 */
export function getCategoryRevalidationPaths(category: any): string[] {
  const paths: string[] = [];

  // Always revalidate categories list
  paths.push('/api/public/categories');

  // Revalidate dishes that might be affected
  paths.push('/api/public/dishes');

  // Revalidate type-specific pages
  if (category.typeScope === 'RESTAURANT') {
    paths.push('/menu');
  } else if (category.typeScope === 'CATERING') {
    paths.push('/catering');
  } else if (category.typeScope === 'EVENT') {
    paths.push('/events');
  }

  return paths;
}

/**
 * Get paths to revalidate when a bundle changes
 */
export function getBundleRevalidationPaths(bundle: any): string[] {
  const paths: string[] = [];

  // Revalidate bundle-related pages
  paths.push('/catering');
  paths.push('/events');

  // Revalidate specific bundle if slug exists
  if (bundle.slug) {
    paths.push(`/api/public/bundles/${bundle.slug}`);
  }

  return paths;
}

/**
 * Get paths to revalidate when settings change
 */
export function getSettingsRevalidationPaths(): string[] {
  return [
    '/',
    '/menu',
    '/restaurant',
    '/catering',
    '/events',
    '/about',
    '/api/public/settings',
  ];
}

/**
 * Get paths to revalidate for a given entity type
 */
export function getPathsToRevalidate(entityType: string, entity: any): string[] {
  switch (entityType) {
    case 'dish':
      return getDishRevalidationPaths(entity);
    case 'category':
      return getCategoryRevalidationPaths(entity);
    case 'bundle':
      return getBundleRevalidationPaths(entity);
    case 'settings':
      return getSettingsRevalidationPaths();
    default:
      return [];
  }
}
