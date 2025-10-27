import { AdminShell } from '@/components/admin/AdminShell';
import { SettingsEditor } from '@/components/admin/SettingsEditor';
import { Title, Text, Container, Stack } from '@mantine/core';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Settings from '@/lib/db/models/Settings';

async function getSettings() {
  await connectDB();

  // Get or create settings singleton
  const settings = await Settings.getSingleton();

  // Convert to plain object for client component
  return JSON.parse(JSON.stringify(settings));
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <AdminShell>
      <Container size="lg">
        <Stack gap="lg">
          <div>
            <Title order={1}>הגדרות</Title>
            <Text c="dimmed">נהל את פרטי המסעדה, שעות פעילות וקישורי רשתות חברתיות</Text>
          </div>

          <SettingsEditor initialData={settings} />
        </Stack>
      </Container>
    </AdminShell>
  );
}
