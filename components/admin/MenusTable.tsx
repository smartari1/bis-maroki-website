'use client';

import {
  Title,
  Text,
  Button,
  Container,
  Stack,
  Table,
  Group,
  Badge,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

interface Menu {
  _id: string;
  title: string;
  slug: string;
  scope: string;
  itemsCount: number;
}

interface MenusTableProps {
  menus: Menu[];
}

const SCOPE_COLORS: Record<string, string> = {
  HOME: 'blue',
  RESTAURANT: 'green',
  CATERING: 'orange',
  EVENTS: 'violet',
  CUSTOM: 'gray',
};

const SCOPE_LABELS: Record<string, string> = {
  HOME: 'דף הבית',
  RESTAURANT: 'מסעדה',
  CATERING: 'אירוח',
  EVENTS: 'אירועים',
  CUSTOM: 'מותאם אישית',
};

export function MenusTable({ menus }: MenusTableProps) {
  const router = useRouter();

  const handleDelete = async (menu: Menu) => {
    if (!confirm(`האם למחוק את התפריט "${menu.title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/menus/${menu._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'שגיאה במחיקת תפריט');
      }

      notifications.show({
        title: 'הצלחה',
        message: 'התפריט נמחק בהצלחה',
        color: 'green',
      });

      router.refresh();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message,
        color: 'red',
      });
    }
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={1}>תפריטים</Title>
            <Text c="dimmed">ניהול תפריטי האתר</Text>
          </div>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => router.push('/admin/menus/new')}
          >
            תפריט חדש
          </Button>
        </Group>

        {menus.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            אין תפריטים במערכת. צור תפריט חדש כדי להתחיל.
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>כותרת</Table.Th>
                  <Table.Th>מזהה ייחודי</Table.Th>
                  <Table.Th>תחום</Table.Th>
                  <Table.Th>פריטים</Table.Th>
                  <Table.Th>פעולות</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {menus.map((menu) => (
                  <Table.Tr key={menu._id}>
                    <Table.Td>
                      <Text fw={500}>{menu.title}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {menu.slug}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={SCOPE_COLORS[menu.scope]} variant="light">
                        {SCOPE_LABELS[menu.scope]}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{menu.itemsCount} פריטים</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          variant="light"
                          leftSection={<IconEdit size={14} />}
                          onClick={() => router.push(`/admin/menus/${menu._id}`)}
                        >
                          ערוך
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => handleDelete(menu)}
                        >
                          מחק
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Stack>
    </Container>
  );
}
