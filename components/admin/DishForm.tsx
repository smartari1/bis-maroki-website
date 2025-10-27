'use client';

import {
  Title,
  Text,
  Button,
  Container,
  Stack,
  Group,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Tabs,
  Switch,
  Slider,
  MultiSelect,
  Badge,
  Paper,
  Image,
  Card,
  ActionIcon,
  SimpleGrid,
} from '@mantine/core';
import {
  IconDeviceFloppy,
  IconArrowLeft,
  IconInfoCircle,
  IconPhoto,
  IconTags,
  IconClockCheck,
  IconSeo,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { MediaPicker } from './MediaPicker';

interface Category {
  _id: string;
  name_he: string;
}

interface Menu {
  _id: string;
  title: string;
}

interface DishFormProps {
  dish?: any;
  categories: Category[];
  menus: Menu[];
  isNew?: boolean;
}

const ALLERGEN_OPTIONS = [
  { value: 'gluten', label: 'גלוטן' },
  { value: 'dairy', label: 'חלב' },
  { value: 'eggs', label: 'ביצים' },
  { value: 'nuts', label: 'אגוזים' },
  { value: 'sesame', label: 'שומשום' },
  { value: 'soy', label: 'סויה' },
];

export function DishForm({ dish, categories, menus, isNew = false }: DishFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('general');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // General tab
  const [title_he, setTitleHe] = useState(dish?.title_he || '');
  const [slug, setSlug] = useState(dish?.slug || '');
  const [menuIds, setMenuIds] = useState<string[]>(
    dish?.menuIds?.map((m: any) => m._id || m) || []
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    dish?.categoryIds?.map((c: any) => c._id || c) || []
  );

  // Extract text from rich text JSON object
  const extractTextFromRichText = (richText: any): string => {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;
    if (richText.blocks && Array.isArray(richText.blocks)) {
      return richText.blocks.map((block: any) => block.data?.text || '').join('\n');
    }
    return '';
  };

  const [description_he, setDescriptionHe] = useState(
    extractTextFromRichText(dish?.description_he)
  );
  const [price, setPrice] = useState<number | string>(dish?.price || '');

  // Media tab
  const [mediaIds, setMediaIds] = useState<string[]>(dish?.mediaIds || []);
  const [mediaObjects, setMediaObjects] = useState<any[]>([]);

  // Tags tab
  const [spiceLevel, setSpiceLevel] = useState(dish?.spiceLevel || 0);
  const [isVegan, setIsVegan] = useState(dish?.isVegan || false);
  const [isVegetarian, setIsVegetarian] = useState(dish?.isVegetarian || false);
  const [isGlutenFree, setIsGlutenFree] = useState(dish?.isGlutenFree || false);
  const [allergens, setAllergens] = useState<string[]>(dish?.allergens || []);
  const [badges, setBadges] = useState(dish?.badges?.join(', ') || '');

  // Availability tab
  const [availability, setAvailability] = useState(dish?.availability || 'AVAILABLE');

  // Fetch media objects
  useEffect(() => {
    if (mediaIds.length > 0) {
      Promise.all(
        mediaIds.map(id =>
          fetch(`/api/admin/media/${id}`)
            .then(res => res.json())
            .then(data => data.media)
            .catch(() => null)
        )
      ).then(results => {
        setMediaObjects(results.filter(Boolean));
      });
    }
  }, [mediaIds]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && title_he && !slug) {
      const latinSlug = title_he
        .toLowerCase()
        .replace(/[א-ת]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      setSlug(latinSlug || 'dish');
    }
  }, [title_he, isNew, slug]);

  const handleSave = async () => {
    if (!title_he || !slug || categoryIds.length === 0) {
      notifications.show({
        title: 'שגיאה',
        message: 'נא למלא את כל השדות החובה (כותרת, slug, לפחות קטגוריה אחת)',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      // Convert plain text to rich text JSON format
      const convertToRichText = (text: string) => {
        if (!text) return { blocks: [] };
        const paragraphs = text.split('\n').filter(p => p.trim());
        return {
          blocks: paragraphs.map(paragraph => ({
            type: 'paragraph',
            data: { text: paragraph }
          }))
        };
      };

      const data = {
        title_he,
        slug,
        menuIds,
        categoryIds,
        description_he: convertToRichText(description_he),
        price: price ? Number(price) : undefined,
        currency: 'ILS',
        mediaIds,
        spiceLevel,
        isVegan,
        isVegetarian,
        isGlutenFree,
        allergens,
        badges: badges ? badges.split(',').map((b: string) => b.trim()).filter(Boolean) : [],
        availability,
        status: dish?.status || 'DRAFT',
      };

      const url = isNew
        ? '/api/admin/dishes'
        : `/api/admin/dishes/${dish._id}`;

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה בשמירת מנה');
      }

      notifications.show({
        title: 'הצלחה',
        message: isNew ? 'המנה נוצרה בהצלחה' : 'המנה עודכנה בהצלחה',
        color: 'green',
      });

      router.push('/admin/dishes');
      router.refresh();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`האם למחוק את המנה "${title_he}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dishes/${dish._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('שגיאה במחיקת מנה');
      }

      notifications.show({
        title: 'הצלחה',
        message: 'המנה נמחקה בהצלחה',
        color: 'green',
      });

      router.push('/admin/dishes');
      router.refresh();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Group justify="space-between">
          <Group>
            <Button
              variant="subtle"
              onClick={() => router.push('/admin/dishes')}
              leftSection={<IconArrowLeft size={18} />}
            >
              חזרה
            </Button>
            <Title order={2}>{isNew ? 'מנה חדשה' : `עריכת: ${title_he}`}</Title>
          </Group>

          <Group>
            {!isNew && (
              <Button variant="subtle" color="red" onClick={handleDelete}>
                מחק
              </Button>
            )}
            <Button
              onClick={handleSave}
              loading={loading}
              leftSection={<IconDeviceFloppy size={18} />}
            >
              שמור
            </Button>
          </Group>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab} dir="rtl">
          <Tabs.List>
            <Tabs.Tab value="general" leftSection={<IconInfoCircle size={16} />}>
              כללי
            </Tabs.Tab>
            <Tabs.Tab value="media" leftSection={<IconPhoto size={16} />}>
              מדיה
            </Tabs.Tab>
            <Tabs.Tab value="tags" leftSection={<IconTags size={16} />}>
              תגיות ואלרגנים
            </Tabs.Tab>
            <Tabs.Tab value="availability" leftSection={<IconClockCheck size={16} />}>
              זמינות
            </Tabs.Tab>
            <Tabs.Tab value="seo" leftSection={<IconSeo size={16} />}>
              SEO
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <TextInput
                  label="שם המנה"
                  placeholder="למשל: פטה כבד, קובה סלק"
                  value={title_he}
                  onChange={e => setTitleHe(e.target.value)}
                  required
                />

                <TextInput
                  label="מזהה ייחודי (slug)"
                  placeholder="למשל: pate-kaved, kubeh-selek"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  description="באותיות לטיניות בלבד, ללא רווחים"
                  required
                />

                <MultiSelect
                  label="תפריטים"
                  placeholder="בחר תפריטים (אופציונלי)"
                  value={menuIds}
                  onChange={setMenuIds}
                  data={menus.map(menu => ({
                    value: menu._id,
                    label: menu.title,
                  }))}
                  description="המנה יכולה להופיע במספר תפריטים"
                  clearable
                />

                <MultiSelect
                  label="קטגוריות"
                  placeholder="בחר לפחות קטגוריה אחת"
                  value={categoryIds}
                  onChange={setCategoryIds}
                  data={categories.map(cat => ({
                    value: cat._id,
                    label: cat.name_he,
                  }))}
                  description="המנה יכולה להשתייך למספר קטגוריות"
                  required
                />

                <Textarea
                  label="תיאור"
                  placeholder="תיאור מפורט של המנה..."
                  value={description_he}
                  onChange={e => setDescriptionHe(e.target.value)}
                  minRows={4}
                />

                <NumberInput
                  label="מחיר (₪)"
                  placeholder="0.00"
                  value={price}
                  onChange={setPrice}
                  decimalScale={2}
                  fixedDecimalScale
                  min={0}
                />
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="media" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm" fw={500}>
                    תמונות המנה ({mediaIds.length})
                  </Text>
                  <Button
                    size="sm"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setMediaPickerOpen(true)}
                  >
                    הוסף תמונה
                  </Button>
                </Group>

                {mediaObjects.length > 0 ? (
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                    {mediaObjects.map((media, index) => (
                      <Card key={media._id} padding="xs" withBorder>
                        <Card.Section>
                          <div style={{ position: 'relative' }}>
                            <Image
                              src={media.thumbnailUrl || media.url}
                              alt={media.alt_he || 'תמונה'}
                              fit="cover"
                              h={150}
                            />
                            <ActionIcon
                              variant="filled"
                              color="red"
                              size="sm"
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                              }}
                              onClick={() => {
                                setMediaIds(mediaIds.filter(id => id !== media._id));
                                setMediaObjects(mediaObjects.filter(m => m._id !== media._id));
                              }}
                            >
                              <IconX size={14} />
                            </ActionIcon>
                            {index === 0 && (
                              <Badge
                                style={{
                                  position: 'absolute',
                                  bottom: 8,
                                  left: 8,
                                }}
                                color="blue"
                              >
                                תמונה ראשית
                              </Badge>
                            )}
                          </div>
                        </Card.Section>
                        <Text size="xs" mt="xs" lineClamp={1}>
                          {media.alt_he || media.fileKey}
                        </Text>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text c="dimmed" size="sm" ta="center" py="xl">
                    לא הוספו תמונות עדיין. לחץ על "הוסף תמונה" להתחיל.
                  </Text>
                )}
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="tags" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    רמת חריפות
                  </Text>
                  <Slider
                    value={spiceLevel}
                    onChange={setSpiceLevel}
                    min={0}
                    max={3}
                    marks={[
                      { value: 0, label: 'לא חריף' },
                      { value: 1, label: 'קל' },
                      { value: 2, label: 'בינוני' },
                      { value: 3, label: 'חריף' },
                    ]}
                  />
                </div>

                <Group grow>
                  <Switch
                    label="טבעוני"
                    checked={isVegan}
                    onChange={e => setIsVegan(e.currentTarget.checked)}
                  />
                  <Switch
                    label="צמחוני"
                    checked={isVegetarian}
                    onChange={e => setIsVegetarian(e.currentTarget.checked)}
                  />
                  <Switch
                    label="ללא גלוטן"
                    checked={isGlutenFree}
                    onChange={e => setIsGlutenFree(e.currentTarget.checked)}
                  />
                </Group>

                <MultiSelect
                  label="אלרגנים"
                  placeholder="בחר אלרגנים"
                  value={allergens}
                  onChange={setAllergens}
                  data={ALLERGEN_OPTIONS}
                />

                <TextInput
                  label="תגיות (באדג'ים)"
                  placeholder="למשל: מומלץ, חדש, מנה מיוחדת"
                  value={badges}
                  onChange={e => setBadges(e.target.value)}
                  description="הפרד באמצעות פסיקים"
                />

                {badges && (
                  <Group gap="xs">
                    {badges.split(',').map((badge: string, i: number) => (
                      <Badge key={i} variant="light">
                        {badge.trim()}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="availability" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <Select
                  label="זמינות"
                  value={availability}
                  onChange={value => setAvailability(value || 'AVAILABLE')}
                  data={[
                    { value: 'AVAILABLE', label: 'זמין' },
                    { value: 'OUT_OF_STOCK', label: 'אזל המלאי' },
                    { value: 'SEASONAL', label: 'עונתי' },
                  ]}
                />

                <Text c="dimmed" size="sm">
                  מידע תזונתי ואופציות התאמה אישית יהיו זמינים בשלב הבא
                </Text>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="seo" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <Text c="dimmed" size="sm">
                  הגדרות SEO יהיו זמינות בשלב הבא
                </Text>
                <Text c="dimmed" size="xs">
                  seoId: {dish?.seoId || 'ללא'}
                </Text>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      {/* Media Picker Modal */}
      <MediaPicker
        opened={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => {
          if (!mediaIds.includes(media._id)) {
            setMediaIds([...mediaIds, media._id]);
            setMediaObjects([...mediaObjects, media]);
          }
        }}
        selectedIds={mediaIds}
      />
    </Container>
  );
}
