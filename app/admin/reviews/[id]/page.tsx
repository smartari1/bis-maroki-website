import { Stack, Title, Text } from '@mantine/core';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Review from '@/lib/db/models/Review';
import ReviewForm from '@/components/admin/ReviewForm';
import mongoose from 'mongoose';

type Params = Promise<{ id: string }>;

async function getReview(id: string) {
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  await connectDB();
  const review = await Review.findById(id).lean();

  if (!review) {
    return null;
  }

  return {
    ...review,
    _id: review._id.toString(),
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

export default async function EditReviewPage({ params }: { params: Params }) {
  const { id } = await params;
  const review = await getReview(id);

  if (!review) {
    notFound();
  }

  return (
    <Stack gap="xl">
      <div>
        <Title order={1}>עריכת המלצה</Title>
        <Text c="dimmed" size="sm">
          ערוך פרטי המלצה של {review.customerName}
        </Text>
      </div>

      <ReviewForm review={review} mode="edit" />
    </Stack>
  );
}
