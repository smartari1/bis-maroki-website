'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Grid,
  Card,
  Image,
  ActionIcon,
  Modal,
  TextInput,
  Loader,
  Badge,
  FileButton,
} from '@mantine/core';
import { IconPlus, IconTrash, IconRefresh, IconPhoto, IconCloud } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

interface Media {
  _id: string;
  kind: string;
  fileKey: string;
  url: string;
  width?: number;
  height?: number;
  alt_he?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export function MediaLibrary() {
  const router = useRouter();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [altText, setAltText] = useState('');

  const fetchMedia = useCallback(async (sync: boolean = false) => {
    try {
      setLoading(true);
      const url = sync ? '/api/admin/media?sync=true' : '/api/admin/media';
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setMedia(data.media);
        if (sync) {
          notifications.show({
            title: 'הצלחה',
            message: 'המדיה סונכרנה עם הדלי',
            color: 'green',
          });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'שגיאה בטעינת המדיה',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setUploading(true);

    try {
      // Step 1: Get presigned upload URL
      const uploadResponse = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error);
      }

      const { uploadUrl, key, publicUrl } = uploadData;

      // Step 2: Upload file directly to R2
      const uploadToR2 = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadToR2.ok) {
        throw new Error('העלאה ל-R2 נכשלה');
      }

      // Step 3: Finalize and save to database
      const finalizeResponse = await fetch('/api/admin/media/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          url: publicUrl,
          kind: 'IMAGE',
          alt_he: file.name.replace(/\.[^.]+$/, ''),
        }),
      });

      const finalizeData = await finalizeResponse.json();

      if (!finalizeResponse.ok) {
        throw new Error(finalizeData.error);
      }

      notifications.show({
        title: 'הצלחה',
        message: 'הקובץ הועלה בהצלחה',
        color: 'green',
      });

      // Refresh media list
      fetchMedia();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'שגיאה בהעלאת הקובץ',
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`/api/admin/media/${selectedMedia._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      notifications.show({
        title: 'הצלחה',
        message: 'המדיה נמחקה בהצלחה',
        color: 'green',
      });

      setDeleteModalOpen(false);
      setSelectedMedia(null);
      fetchMedia();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'שגיאה במחיקת המדיה',
        color: 'red',
      });
    }
  };

  const handleUpdateAlt = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`/api/admin/media/${selectedMedia._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt_he: altText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      notifications.show({
        title: 'הצלחה',
        message: 'התיאור עודכן בהצלחה',
        color: 'green',
      });

      setDetailModalOpen(false);
      fetchMedia();
    } catch (error: any) {
      notifications.show({
        title: 'שגיאה',
        message: error.message || 'שגיאה בעדכון התיאור',
        color: 'red',
      });
    }
  };

  const openDetailModal = (m: Media) => {
    setSelectedMedia(m);
    setAltText(m.alt_he || '');
    setDetailModalOpen(true);
  };

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={1}>ספריית מדיה</Title>
            <Text c="dimmed">ניהול תמונות וקבצי מדיה</Text>
          </div>
          <Group>
            <Button
              variant="light"
              leftSection={<IconRefresh size={18} />}
              onClick={() => fetchMedia(true)}
              disabled={loading}
            >
              סנכרן עם הדלי
            </Button>
            <FileButton onChange={handleFileUpload} accept="image/*">
              {(props) => (
                <Button
                  {...props}
                  leftSection={<IconPlus size={18} />}
                  loading={uploading}
                >
                  העלאת תמונה
                </Button>
              )}
            </FileButton>
          </Group>
        </Group>

        {loading && (
          <Group justify="center" py="xl">
            <Loader size="lg" />
          </Group>
        )}

        {!loading && media.length === 0 && (
          <Card padding="xl" withBorder>
            <Stack align="center" gap="md" py="xl">
              <IconPhoto size={64} stroke={1} color="gray" />
              <Text size="lg" fw={500} c="dimmed">
                אין תמונות בספרייה
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                העלה תמונות או סנכרן עם הדלי של R2
              </Text>
            </Stack>
          </Card>
        )}

        {!loading && media.length > 0 && (
          <Grid>
            {media.map((m) => (
              <Grid.Col key={m._id} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                <Card padding="md" withBorder style={{ height: '100%' }}>
                  <Card.Section>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 200,
                        backgroundColor: '#f5f5f5',
                        cursor: 'pointer',
                      }}
                      onClick={() => openDetailModal(m)}
                    >
                      <Image
                        src={m.thumbnailUrl || m.url}
                        alt={m.alt_he || 'תמונה'}
                        fit="cover"
                        h={200}
                      />
                    </div>
                  </Card.Section>

                  <Stack gap="xs" mt="md">
                    <Text size="xs" lineClamp={1} fw={500}>
                      {m.alt_he || m.fileKey.split('/').pop()}
                    </Text>
                    <Group gap="xs" justify="space-between">
                      <Badge size="xs" variant="light">
                        {m.kind}
                      </Badge>
                      {m.width && m.height && (
                        <Text size="xs" c="dimmed">
                          {m.width}×{m.height}
                        </Text>
                      )}
                    </Group>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMedia(m);
                        setDeleteModalOpen(true);
                      }}
                      size="sm"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>

      {/* Detail Modal */}
      <Modal
        opened={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="פרטי מדיה"
        size="lg"
        centered
      >
        {selectedMedia && (
          <Stack gap="md">
            <Image
              src={selectedMedia.url}
              alt={selectedMedia.alt_he || 'תמונה'}
              fit="contain"
              h={300}
            />

            <TextInput
              label="תיאור (Alt Text)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="הזן תיאור לתמונה"
            />

            <Group gap="xs">
              <Badge>{selectedMedia.kind}</Badge>
              {selectedMedia.width && selectedMedia.height && (
                <Badge color="gray">
                  {selectedMedia.width}×{selectedMedia.height}
                </Badge>
              )}
            </Group>

            <Text size="xs" c="dimmed">
              קובץ: {selectedMedia.fileKey}
            </Text>

            <Group justify="flex-end" gap="sm">
              <Button variant="subtle" onClick={() => setDetailModalOpen(false)}>
                ביטול
              </Button>
              <Button onClick={handleUpdateAlt}>
                שמור שינויים
              </Button>
            </Group>
          </Stack>
        )}
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
            האם אתה בטוח שברצונך למחוק את המדיה הזו?
          </Text>
          <Text size="sm" c="red">
            פעולה זו אינה הפיכה. הקובץ יימחק גם מהדלי של R2.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpen(false)}
            >
              ביטול
            </Button>
            <Button color="red" onClick={handleDelete}>
              מחק
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
