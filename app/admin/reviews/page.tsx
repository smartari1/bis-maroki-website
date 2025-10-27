import { Title, Button, Group, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import connectDB from '@/lib/db/mongoose';
import Review from '@/lib/db/models/Review';
import ReviewsTable from '@/components/admin/ReviewsTable';

export const dynamic = 'force-dynamic';

async function getReviews() {
  await connectDB();
  const reviews = await Review.find().sort({ order: 1, createdAt: -1 }).lean();

  return reviews.map(review => ({
    ...review,
    _id: review._id.toString(),
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  }));
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <div>
          <Title order={1}>המלצות לקוחות</Title>
          <Text c="dimmed" size="sm">
            ניהול המלצות המוצגות בעמוד הבית
          </Text>
        </div>
        <Link href="/admin/reviews/new" style={{ textDecoration: 'none' }}>
          <Button leftSection={<IconPlus size={16} />}>
            המלצה חדשה
          </Button>
        </Link>
      </Group>

      <ReviewsTable reviews={reviews} />
    </Stack>
  );
}
