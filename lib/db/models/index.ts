/**
 * Model Registry
 *
 * Import all models in one place to ensure they're registered with Mongoose
 * This prevents "Schema hasn't been registered" errors during population
 */

// Import all models to register schemas
import Dish from './Dish';
import Category from './Category';
import Menu from './Menu';
import Media from './Media';
import SeoMeta from './SeoMeta';
import HeroScene from './HeroScene';
import PageContent from './Page';
import NavigationMenu from './NavigationMenu';
import Settings from './Settings';

// Export for convenience
export {
  Dish,
  Category,
  Menu,
  Media,
  SeoMeta,
  HeroScene,
  PageContent,
  NavigationMenu,
  Settings,
};
