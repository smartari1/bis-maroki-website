interface DietaryBadgeProps {
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
}

/**
 * Displays dietary restriction badges with appropriate colors
 * Vegan: Green, Vegetarian: Green, Gluten-Free: Orange
 */
export default function DietaryBadge({ isVegan, isVegetarian, isGlutenFree }: DietaryBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {isVegan && (
        <span className="px-2 py-1 text-xs rounded-full bg-brand-green/10 text-brand-green border border-brand-green">
          🌱 טבעוני
        </span>
      )}
      {isVegetarian && !isVegan && (
        <span className="px-2 py-1 text-xs rounded-full bg-brand-green/10 text-brand-green border border-brand-green">
          🥬 צמחוני
        </span>
      )}
      {isGlutenFree && (
        <span className="px-2 py-1 text-xs rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange">
          🌾 ללא גלוטן
        </span>
      )}
    </div>
  );
}
