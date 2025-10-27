import { Stack, Title, Text } from '@mantine/core';
import ReviewForm from '@/components/admin/ReviewForm';

export default function NewReviewPage() {
  return (
    <Stack gap="xl">
      <div>
        <Title order={1}>המלצה חדשה</Title>
        <Text c="dimmed" size="sm">
          הוסף המלצת לקוח חדשה
        </Text>
      </div>

      <ReviewForm mode="create" />
    </Stack>
  );
}
