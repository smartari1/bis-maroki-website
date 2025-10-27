'use client';

import { useState } from 'react';
import { Table, Badge, ActionIcon, Group, Text, Modal, Button, Stack, Rating } from '@mantine/core';
import { IconEdit, IconTrash, IconStar } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

interface Review {
  _id: string;
  customerName: string;
  customerInitials: string;
  rating: number;
  testimonialText: string;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  order: number;
  createdAt: string;
}

interface ReviewsTableProps {
  reviews: Review[];
}

export default function ReviewsTable({ reviews }: ReviewsTableProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (reviewId: string) => {
    router.push(`/admin/reviews/${reviewId}`);
  };

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'שגיאה במחיקת המלצה');
      }

      notifications.show({
        title: 'הצלחה',
        message: 'המלצה נמחקה בהצלחה',
        color: 'green',
      });

      setDeleteModalOpen(false);
      setReviewToDelete(null);
      router.refresh();

    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'אירעה שגיאה במחיקת ההמלצה',
        color: 'red',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const rows = reviews.map((review) => (
    <Table.Tr key={review._id}>
      <Table.Td>
        <Group gap="xs">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#E0723E',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {review.customerInitials}
          </div>
          <div>
            <Text size="sm" fw={500}>
              {review.customerName}
            </Text>
            <Rating value={review.rating} readOnly size="xs" />
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm" lineClamp={2} maw={400}>
          {review.testimonialText}
        </Text>
      </Table.Td>
      <Table.Td>
        {review.isFeatured ? (
          <Badge color="orange" variant="light" leftSection={<IconStar size={12} />}>
            מומלץ
          </Badge>
        ) : (
          <Badge color="gray" variant="light">
            רגיל
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Badge color={review.status === 'PUBLISHED' ? 'green' : 'gray'}>
          {review.status === 'PUBLISHED' ? 'פורסם' : 'טיוטה'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{review.order}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={() => handleEdit(review._id)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => handleDeleteClick(review)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>לקוח</Table.Th>
            <Table.Th>המלצה</Table.Th>
            <Table.Th>סוג</Table.Th>
            <Table.Th>סטטוס</Table.Th>
            <Table.Th>סדר</Table.Th>
            <Table.Th style={{ textAlign: 'left' }}>פעולות</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed">
                  אין המלצות
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="מחיקת המלצה"
        centered
      >
        <Stack>
          <Text>
            האם אתה בטוח שברצונך למחוק את ההמלצה של{' '}
            <strong>{reviewToDelete?.customerName}</strong>?
          </Text>
          <Text size="sm" c="red">
            פעולה זו לא ניתנת לביטול.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              ביטול
            </Button>
            <Button
              color="red"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              מחק
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
