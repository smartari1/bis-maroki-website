'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Select,
  Button,
  Stack,
  Group,
  Paper,
  Title,
  Rating,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

interface Review {
  _id?: string;
  customerName: string;
  customerInitials?: string;
  rating: number;
  testimonialText: string;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  order: number;
}

interface ReviewFormProps {
  review?: Review | null;
  mode: 'create' | 'edit';
}

export default function ReviewForm({ review, mode }: ReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      customerName: review?.customerName || '',
      customerInitials: review?.customerInitials || '',
      rating: review?.rating || 5,
      testimonialText: review?.testimonialText || '',
      isFeatured: review?.isFeatured || false,
      status: review?.status || 'DRAFT',
      order: review?.order || 0,
    },
    validate: {
      customerName: (value) => {
        if (!value) return 'שם הלקוח נדרש';
        if (value.length < 2) return 'שם הלקוח חייב להיות לפחות 2 תווים';
        if (value.length > 100) return 'שם הלקוח לא יכול להיות יותר מ-100 תווים';
        return null;
      },
      rating: (value) => {
        if (value < 1 || value > 5) return 'דירוג חייב להיות בין 1 ל-5';
        return null;
      },
      testimonialText: (value) => {
        if (!value) return 'טקסט המלצה נדרש';
        if (value.length < 10) return 'ההמלצה חייבת להיות לפחות 10 תווים';
        if (value.length > 500) return 'ההמלצה לא יכולה להיות יותר מ-500 תווים';
        return null;
      },
      order: (value) => {
        if (value < 0) return 'הסדר לא יכול להיות שלילי';
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);

    try {
      const url = mode === 'create'
        ? '/api/admin/reviews'
        : `/api/admin/reviews/${review?._id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'שגיאה בשמירת המלצה');
      }

      notifications.show({
        title: 'הצלחה',
        message: data.message || 'המלצה נשמרה בהצלחה',
        color: 'green',
      });

      router.push('/admin/reviews');
      router.refresh();

    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'אירעה שגיאה בשמירת ההמלצה',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper p="xl" withBorder>
      <Title order={3} mb="xl">
        {mode === 'create' ? 'המלצה חדשה' : 'עריכת המלצה'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Customer Name */}
          <TextInput
            label="שם הלקוח"
            placeholder="לדוגמה: יוסי כהן"
            required
            {...form.getInputProps('customerName')}
          />

          {/* Customer Initials (Optional) */}
          <TextInput
            label="ראשי תיבות (אופציונלי)"
            placeholder="לדוגמה: י.כ"
            description="אם לא מוזן, יווצר אוטומטית מהשם"
            maxLength={3}
            {...form.getInputProps('customerInitials')}
          />

          {/* Rating */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
              דירוג <span style={{ color: 'red' }}>*</span>
            </label>
            <Rating
              value={form.values.rating}
              onChange={(value) => form.setFieldValue('rating', value)}
              size="lg"
            />
          </div>

          {/* Testimonial Text */}
          <Textarea
            label="טקסט ההמלצה"
            placeholder="כתוב כאן את המלצת הלקוח..."
            required
            rows={4}
            maxLength={500}
            {...form.getInputProps('testimonialText')}
            description={`${form.values.testimonialText.length}/500 תווים`}
          />

          {/* Is Featured */}
          <Switch
            label="המלצה מומלצת (יוצג בקרוסלה הגדולה)"
            {...form.getInputProps('isFeatured', { type: 'checkbox' })}
          />

          {/* Status */}
          <Select
            label="סטטוס"
            data={[
              { value: 'DRAFT', label: 'טיוטה' },
              { value: 'PUBLISHED', label: 'פורסם' },
            ]}
            {...form.getInputProps('status')}
          />

          {/* Order */}
          <NumberInput
            label="סדר תצוגה"
            description="מספר נמוך יותר = יופיע ראשון"
            min={0}
            {...form.getInputProps('order')}
          />

          {/* Submit Buttons */}
          <Group justify="flex-start" mt="xl">
            <Button type="submit" loading={isSubmitting}>
              {mode === 'create' ? 'צור המלצה' : 'שמור שינויים'}
            </Button>
            <Button
              variant="subtle"
              onClick={() => router.push('/admin/reviews')}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
