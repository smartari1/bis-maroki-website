'use client';

import {
  Title,
  Button,
  Container,
  Stack,
  Group,
  TextInput,
  Select,
  Paper,
  Text,
} from '@mantine/core';
import {
  IconDeviceFloppy,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

interface MenuFormProps {
  menu?: any;
  isNew?: boolean;
}

const SCOPE_OPTIONS = [
  { value: 'HOME', label: 'דף הבית' },
  { value: 'RESTAURANT', label: 'מסעדה' },
  { value: 'CATERING', label: 'אירוח' },
  { value: 'EVENTS', label: 'אירועים' },
  { value: 'CUSTOM', label: 'מותאם אישית' },
];

export function MenuForm({ menu, isNew = false }: MenuFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState(menu?.title || '');
  const [slug, setSlug] = useState(menu?.slug || '');
  const [scope, setScope] = useState(menu?.scope || 'CUSTOM');

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && title && !slug) {
      const latinSlug = title
        .toLowerCase()
        .replace(/[א-ת]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      setSlug(latinSlug || 'menu');
    }
  }, [title, isNew, slug]);

  const handleSave = async () => {
    if (!title || !slug || !scope) {
      notifications.show({
        title: 'שגיאה',
        message: 'נא למלא את כל השדות החובה',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const data = {
        title,
        slug,
        scope,
        items: menu?.items || [],
      };

      const url = isNew
        ? '/api/admin/menus'
        : `/api/admin/menus/${menu._id}`;

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה בשמירת תפריט');
      }

      notifications.show({
        title: 'הצלחה',
        message: isNew ? 'התפריט נוצר בהצלחה' : 'התפריט עודכן בהצלחה',
        color: 'green',
      });

      router.push('/admin/menus');
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
    if (!confirm(`האם למחוק את התפריט "${title}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/menus/${menu._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('שגיאה במחיקת תפריט');
      }

      notifications.show({
        title: 'הצלחה',
        message: 'התפריט נמחק בהצלחה',
        color: 'green',
      });

      router.push('/admin/menus');
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
              onClick={() => router.push('/admin/menus')}
              leftSection={<IconArrowLeft size={18} />}
            >
              חזרה
            </Button>
            <Title order={2}>{isNew ? 'תפריט חדש' : `עריכת: ${title}`}</Title>
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

        <Paper p="lg" withBorder>
          <Stack gap="md">
            <TextInput
              label="כותרת התפריט"
              placeholder="למשל: תפריט ראשי, תפריט אירועים"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <TextInput
              label="מזהה ייחודי (slug)"
              placeholder="למשל: main-menu, events-menu"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              description="באותיות לטיניות בלבד, ללא רווחים"
              required
            />

            <Select
              label="תחום"
              placeholder="בחר תחום"
              value={scope}
              onChange={(value) => setScope(value || 'CUSTOM')}
              data={SCOPE_OPTIONS}
              required
            />

            <Text size="sm" c="dimmed" mt="md">
              הוספת פריטים לתפריט תהיה זמינה בעתיד
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
