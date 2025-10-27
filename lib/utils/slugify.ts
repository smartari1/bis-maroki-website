/**
 * Slugify Utility
 *
 * Converts Hebrew text to URL-safe Latin slugs
 * Uses transliteration map for Hebrew → Latin conversion
 */

// Hebrew to Latin transliteration map
const hebrewToLatinMap: Record<string, string> = {
  א: 'a',
  ב: 'b',
  ג: 'g',
  ד: 'd',
  ה: 'h',
  ו: 'v',
  ז: 'z',
  ח: 'ch',
  ט: 't',
  י: 'y',
  כ: 'k',
  ך: 'k',
  ל: 'l',
  מ: 'm',
  ם: 'm',
  נ: 'n',
  ן: 'n',
  ס: 's',
  ע: '',
  פ: 'p',
  ף: 'p',
  צ: 'tz',
  ץ: 'tz',
  ק: 'k',
  ר: 'r',
  ש: 'sh',
  ת: 't',
  // Common Hebrew letter combinations
  שׂ: 's',
  שׁ: 'sh',
};

/**
 * Convert Hebrew text to Latin transliteration
 */
function transliterateHebrew(text: string): string {
  return text
    .split('')
    .map((char) => hebrewToLatinMap[char] || char)
    .join('');
}

/**
 * Convert text to URL-safe slug
 * Handles Hebrew transliteration automatically
 *
 * @param text - Input text (Hebrew or Latin)
 * @param maxLength - Maximum slug length (default: 100)
 * @returns URL-safe slug
 *
 * @example
 * slugify('פטה כבד') // 'pth-kbd'
 * slugify('Moroccan Food') // 'moroccan-food'
 * slugify('קובה סלק 2024') // 'kvbh-slk-2024'
 */
export function slugify(text: string, maxLength: number = 100): string {
  // Transliterate Hebrew characters
  let slug = transliterateHebrew(text);

  // Convert to lowercase
  slug = slug.toLowerCase();

  // Remove accents and diacritics
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Replace spaces and special characters with hyphens
  slug = slug.replace(/[^\w\s-]/g, ''); // Remove non-word chars except spaces and hyphens
  slug = slug.replace(/\s+/g, '-'); // Replace spaces with hyphens
  slug = slug.replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

  // Trim hyphens from start and end
  slug = slug.replace(/^-+|-+$/g, '');

  // Truncate to max length
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Remove trailing hyphen if truncation created one
    slug = slug.replace(/-+$/, '');
  }

  return slug;
}

/**
 * Generate unique slug by appending number if needed
 *
 * @param baseSlug - Base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 *
 * @example
 * makeUniqueSlug('pth-kbd', ['pth-kbd']) // 'pth-kbd-1'
 * makeUniqueSlug('pth-kbd', ['pth-kbd', 'pth-kbd-1']) // 'pth-kbd-2'
 */
export function makeUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Validate slug format
 * Ensures slug contains only lowercase letters, numbers, and hyphens
 *
 * @param slug - Slug to validate
 * @returns True if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
