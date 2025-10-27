'use client';

import { useState } from 'react';
import {
  Title,
  Text,
  Button,
  Container,
  Stack,
  Group,
  TextInput,
  Table,
  Badge,
  ActionIcon,
  Checkbox,
  Menu,
  Modal,
  MultiSelect,
  Loader,
} from '@mantine/core';
import { IconPlus, IconSearch, IconPencil, IconTrash, IconDotsVertical } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

interface Dish {
  _id: string;
  title_he: string;
  slug: string;
  menuNames: string[];
  categoryNames: string[];
  price: number;
  status: string;
  availability: string;
}

interface DishesTableProps {
  dishes: Dish[];
  menus: Array<{ _id: string; title: string }>;
  categories: Array<{ _id: string; name_he: string }>;
}

const statusColors: Record<string, string> = {
  DRAFT: 'gray',
  PUBLISHED: 'green',
  SCHEDULED: 'blue',
};

const availabilityLabels: Record<string, string> = {
  AVAILABLE: 'זמין',
  OUT_OF_STOCK: 'אזל המלאי',
  SEASONAL: 'עונתי',
};

export function DishesTable({ dishes, menus, categories }: DishesTableProps) {
  const router = useRouter();
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());
  const [addToMenuModalOpen, setAddToMenuModalOpen] = useState(false);
  const [addToCategoryModalOpen, setAddToCategoryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Toggle single dish selection
  const toggleDish = (dishId: string) => {
    const newSelection = new Set(selectedDishes);
    if (newSelection.has(dishId)) {
      newSelection.delete(dishId);
    } else {
      newSelection.add(dishId);
    }
    setSelectedDishes(newSelection);
  };

  // Toggle all dishes selection
  const toggleAll = () => {
    if (selectedDishes.size === dishes.length) {
      setSelectedDishes(new Set());
    } else {
      setSelectedDishes(new Set(dishes.map((d) => d._id)));
    }
  };

  // Check if all dishes are selected
  const allSelected = dishes.length > 0 && selectedDishes.size === dishes.length;
  const someSelected = selectedDishes.size > 0 && selectedDishes.size < dishes.length;

  // Handle bulk add to menus
  const handleAddToMenus = async () => {
    if (selectedMenuIds.length === 0) {
      notifications.show({
        title: 'שגיאה',
        message: 'יש לבחור לפחות תפריט אחד',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/dishes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addToMenu',
          dishIds: Array.from(selectedDishes),
          menuIds: selectedMenuIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהוספה לתפריטים');
      }

      notifications.show({
        title: 'הצלחה',
        message: `${selectedDishes.size} מנות נוספו ל-${selectedMenuIds.length} תפריטים`,
        color: 'green',
      });

      setAddToMenuModalOpen(false);
      setSelectedMenuIds([]);
      setSelectedDishes(new Set());
      router.refresh();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'שגיאה בהוספה לתפריטים',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk add to categories
  const handleAddToCategories = async () => {
    if (selectedCategoryIds.length === 0) {
      notifications.show({
        title: 'שגיאה',
        message: 'יש לבחור לפחות קטגוריה אחת',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/dishes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addToCategory',
          dishIds: Array.from(selectedDishes),
          categoryIds: selectedCategoryIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהוספה לקטגוריות');
      }

      notifications.show({
        title: 'הצלחה',
        message: `${selectedDishes.size} מנות נוספו ל-${selectedCategoryIds.length} קטגוריות`,
        color: 'green',
      });

      setAddToCategoryModalOpen(false);
      setSelectedCategoryIds([]);
      setSelectedDishes(new Set());
      router.refresh();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'שגיאה בהוספה לקטגוריות',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dishes/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishIds: Array.from(selectedDishes),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה במחיקת המנות');
      }

      notifications.show({
        title: 'הצלחה',
        message: `${selectedDishes.size} מנות נמחקו בהצלחה`,
        color: 'green',
      });

      setDeleteModalOpen(false);
      setSelectedDishes(new Set());
      router.refresh();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'שגיאה במחיקת המנות',
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
            <Title order={1}>מנות</Title>
            <Text c="dimmed">ניהול מנות המסעדה</Text>
          </div>
          <Button
            onClick={() => router.push('/admin/dishes/new')}
            leftSection={<IconPlus size={18} />}
          >
            מנה חדשה
          </Button>
        </Group>

        {/* Bulk Actions Toolbar */}
        {selectedDishes.size > 0 && (
          <Group gap="sm" p="sm" style={{ backgroundColor: 'var(--mantine-color-blue-0)', borderRadius: '8px' }}>
            <Text size="sm" fw={500}>
              {selectedDishes.size} מנות נבחרו
            </Text>
            <Button
              size="xs"
              variant="light"
              onClick={() => setAddToMenuModalOpen(true)}
            >
              הוספה לתפריט
            </Button>
            <Button
              size="xs"
              variant="light"
              onClick={() => setAddToCategoryModalOpen(true)}
            >
              הוספה לקטגוריה
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => setDeleteModalOpen(true)}
            >
              מחיקה
            </Button>
            <Button
              size="xs"
              variant="subtle"
              onClick={() => setSelectedDishes(new Set())}
            >
              ביטול בחירה
            </Button>
          </Group>
        )}

        <TextInput
          placeholder="חיפוש מנות..."
          leftSection={<IconSearch size={18} />}
          size="md"
        />

        <Table.ScrollContainer minWidth={900}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    aria-label="בחר את כל המנות"
                  />
                </Table.Th>
                <Table.Th>כותרת</Table.Th>
                <Table.Th>תפריטים</Table.Th>
                <Table.Th>קטגוריות</Table.Th>
                <Table.Th>מחיר</Table.Th>
                <Table.Th>זמינות</Table.Th>
                <Table.Th>סטטוס</Table.Th>
                <Table.Th>פעולות</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {dishes.map((dish) => (
                <Table.Tr key={dish._id}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedDishes.has(dish._id)}
                      onChange={() => toggleDish(dish._id)}
                      aria-label={`בחר ${dish.title_he}`}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{dish.title_he}</Text>
                    <Text size="xs" c="dimmed">
                      {dish.slug}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {dish.menuNames && dish.menuNames.length > 0 ? (
                        dish.menuNames.map((name, i) => (
                          <Badge key={i} variant="light" color="blue" size="sm">
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <Text size="xs" c="dimmed">-</Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {dish.categoryNames && dish.categoryNames.length > 0 ? (
                        dish.categoryNames.map((name, i) => (
                          <Badge key={i} variant="light" color="grape" size="sm">
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <Text size="xs" c="dimmed">-</Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {dish.price ? `₪${dish.price.toFixed(2)}` : '-'}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="dot"
                      color={dish.availability === 'AVAILABLE' ? 'green' : 'gray'}
                      size="sm"
                    >
                      {availabilityLabels[dish.availability]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[dish.status]} size="sm">
                      {dish.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        onClick={() => router.push(`/admin/dishes/${dish._id}`)}
                        variant="subtle"
                        color="blue"
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red">
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {dishes.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            אין מנות במערכת
          </Text>
        )}
      </Stack>

      {/* Add to Menu Modal */}
      <Modal
        opened={addToMenuModalOpen}
        onClose={() => setAddToMenuModalOpen(false)}
        title="הוספה לתפריטים"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            בחר תפריטים להוספת {selectedDishes.size} מנות
          </Text>
          <MultiSelect
            label="תפריטים"
            placeholder="בחר תפריטים"
            data={menus.map((menu) => ({
              value: menu._id,
              label: menu.title,
            }))}
            value={selectedMenuIds}
            onChange={setSelectedMenuIds}
            searchable
          />
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => setAddToMenuModalOpen(false)}
              disabled={loading}
            >
              ביטול
            </Button>
            <Button
              onClick={handleAddToMenus}
              loading={loading}
            >
              הוסף לתפריטים
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Add to Category Modal */}
      <Modal
        opened={addToCategoryModalOpen}
        onClose={() => setAddToCategoryModalOpen(false)}
        title="הוספה לקטגוריות"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            בחר קטגוריות להוספת {selectedDishes.size} מנות
          </Text>
          <MultiSelect
            label="קטגוריות"
            placeholder="בחר קטגוריות"
            data={categories.map((cat) => ({
              value: cat._id,
              label: cat.name_he,
            }))}
            value={selectedCategoryIds}
            onChange={setSelectedCategoryIds}
            searchable
          />
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => setAddToCategoryModalOpen(false)}
              disabled={loading}
            >
              ביטול
            </Button>
            <Button
              onClick={handleAddToCategories}
              loading={loading}
            >
              הוסף לקטגוריות
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="אישור מחיקה"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            האם אתה בטוח שברצונך למחוק {selectedDishes.size} מנות?
          </Text>
          <Text size="sm" c="red">
            פעולה זו אינה הפיכה.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpen(false)}
              disabled={loading}
            >
              ביטול
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={loading}
            >
              מחק
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
