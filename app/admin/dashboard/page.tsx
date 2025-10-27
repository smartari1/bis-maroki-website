import { AdminShell } from '@/components/admin/AdminShell';
import { Title, Text, Container, SimpleGrid, Paper, Group, Stack, Button } from '@mantine/core';
import { IconToolsKitchen2, IconCategory, IconMenu2, IconChartBar } from '@tabler/icons-react';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Dish from '@/lib/db/models/Dish';
import Category from '@/lib/db/models/Category';
import Menu from '@/lib/db/models/Menu';

async function getStats() {
  await connectDB();

  const [totalDishes, totalCategories, totalMenus, publishedDishes] = await Promise.all([
    Dish.countDocuments(),
    Category.countDocuments(),
    Menu.countDocuments(),
    Dish.countDocuments({ status: 'PUBLISHED' }),
  ]);

  return {
    totalDishes,
    totalCategories,
    totalMenus,
    publishedDishes,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <AdminShell>
      <Container size="xl">
        <Stack gap="lg">
          <div>
            <Title order={1}>לוח בקרה</Title>
            <Text c="dimmed">ברוך הבא לממשק הניהול</Text>
          </div>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            <Paper p="lg" withBorder>
              <Group>
                <IconToolsKitchen2 size={32} color="var(--mantine-color-blue-6)" />
                <div>
                  <Text size="xl" fw={700}>
                    {stats.totalDishes}
                  </Text>
                  <Text size="sm" c="dimmed">
                    מנות
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper p="lg" withBorder>
              <Group>
                <IconChartBar size={32} color="var(--mantine-color-green-6)" />
                <div>
                  <Text size="xl" fw={700}>
                    {stats.publishedDishes}
                  </Text>
                  <Text size="sm" c="dimmed">
                    מנות פורסמו
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper p="lg" withBorder>
              <Group>
                <IconCategory size={32} color="var(--mantine-color-orange-6)" />
                <div>
                  <Text size="xl" fw={700}>
                    {stats.totalCategories}
                  </Text>
                  <Text size="sm" c="dimmed">
                    קטגוריות
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper p="lg" withBorder>
              <Group>
                <IconMenu2 size={32} color="var(--mantine-color-violet-6)" />
                <div>
                  <Text size="xl" fw={700}>
                    {stats.totalMenus}
                  </Text>
                  <Text size="sm" c="dimmed">
                    תפריטים
                  </Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          <Paper p="lg" withBorder>
            <Title order={3} mb="md">
              פעולות מהירות
            </Title>
            <Group>
              <Button component="a" href="/admin/dishes/new" variant="light">
                מנה חדשה
              </Button>
              <Button component="a" href="/admin/categories" variant="light">
                נהל קטגוריות
              </Button>
              <Button component="a" href="/admin/menus" variant="light">
                נהל תפריטים
              </Button>
            </Group>
          </Paper>
        </Stack>
      </Container>
    </AdminShell>
  );
}
