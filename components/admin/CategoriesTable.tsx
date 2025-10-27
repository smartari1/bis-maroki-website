'use client';

import {
  Title,
  Text,
  Button,
  Container,
  Stack,
  Group,
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  NumberInput,
} from '@mantine/core';
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconGripVertical,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

interface Category {
  _id: string;
  name_he: string;
  slug: string;
  order: number;
}

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name_he, setNameHe] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState(0);

  const handleAdd = () => {
    setEditingCategory(null);
    setNameHe('');
    setSlug('');
    setOrder(0);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNameHe(category.name_he);
    setSlug(category.slug);
    setOrder(category.order);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = { name_he, slug, order };

      if (editingCategory) {
        // Update existing
        const response = await fetch(`/api/admin/categories/${editingCategory._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'שגיאה בעדכון קטגוריה');
        }

        const result = await response.json();
        setCategories(cats =>
          cats.map(c => (c._id === editingCategory._id ? result.data : c))
        );
        notifications.show({
          title: 'הצלחה',
          message: 'הקטגוריה עודכנה בהצלחה',
          color: 'green',
        });
      } else {
        // Create new
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'שגיאה ביצירת קטגוריה');
        }

        const result = await response.json();
        setCategories([...categories, result.data]);
        notifications.show({
          title: 'הצלחה',
          message: 'הקטגוריה נוצרה בהצלחה',
          color: 'green',
        });
      }

      setModalOpen(false);
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

  const handleDelete = async (category: Category) => {
    if (!confirm(`האם למחוק את הקטגוריה "${category.name_he}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${category._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה במחיקת קטגוריה');
      }

      setCategories(cats => cats.filter(c => c._id !== category._id));
      notifications.show({
        title: 'הצלחה',
        message: 'הקטגוריה נמחקה בהצלחה',
        color: 'green',
      });
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
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={1}>קטגוריות</Title>
            <Text c="dimmed">ניהול קטגוריות המנות</Text>
          </div>
          <Button onClick={handleAdd} leftSection={<IconPlus size={18} />}>
            קטגוריה חדשה
          </Button>
        </Group>

        <Table.ScrollContainer minWidth={600}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 50 }}></Table.Th>
                <Table.Th>שם</Table.Th>
                <Table.Th>מזהה ייחודי</Table.Th>
                <Table.Th>סדר</Table.Th>
                <Table.Th>פעולות</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.map(category => (
                <Table.Tr key={category._id}>
                  <Table.Td>
                    <IconGripVertical size={16} style={{ cursor: 'grab' }} />
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{category.name_he}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {category.slug}
                    </Text>
                  </Table.Td>
                  <Table.Td>{category.order}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        onClick={() => handleEdit(category)}
                        variant="subtle"
                        color="blue"
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => handleDelete(category)}
                        variant="subtle"
                        color="red"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {categories.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            אין קטגוריות במערכת
          </Text>
        )}
      </Stack>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}
        dir="rtl"
      >
        <Stack gap="md">
          <TextInput
            label="שם הקטגוריה"
            placeholder="למשל: בשרים, סלטים, קינוחים"
            value={name_he}
            onChange={e => setNameHe(e.target.value)}
            required
          />

          <TextInput
            label="מזהה ייחודי (slug)"
            placeholder="למשל: meats, salads, desserts"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            description="באותיות לטיניות בלבד, ללא רווחים"
            required
          />

          <NumberInput
            label="סדר תצוגה"
            value={order}
            onChange={value => setOrder(Number(value) || 0)}
            description="מספר נמוך יופיע ראשון"
            min={0}
          />

          <Group justify="flex-start" mt="md">
            <Button onClick={handleSave} loading={loading}>
              {editingCategory ? 'עדכן' : 'צור'}
            </Button>
            <Button variant="subtle" onClick={() => setModalOpen(false)}>
              ביטול
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
