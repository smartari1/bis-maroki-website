'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  Grid,
  Card,
  Image,
  Text,
  Stack,
  Group,
  Button,
  Loader,
  Badge,
  FileButton,
  ActionIcon,
} from '@mantine/core';
import { IconPlus, IconX, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface Media {
  _id: string;
  kind: string;
  fileKey: string;
  url: string;
  width?: number;
  height?: number;
  alt_he?: string;
  thumbnailUrl?: string;
}

interface MediaPickerProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  selectedIds?: string[];
  multiple?: boolean;
}

export function MediaPicker({
  opened,
  onClose,
  onSelect,
  selectedIds = [],
  multiple = false,
}: MediaPickerProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (opened) {
      fetchMedia();
      setLocalSelected(selectedIds);
    }
  }, [opened, selectedIds]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media');
      const data = await response.json();

      if (response.ok) {
        setMedia(data.media);
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
  };

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

      // Refresh media list and auto-select new media
      await fetchMedia();
      if (finalizeData.media) {
        onSelect(finalizeData.media);
      }
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

  const handleSelect = (m: Media) => {
    if (multiple) {
      if (localSelected.includes(m._id)) {
        setLocalSelected(localSelected.filter(id => id !== m._id));
      } else {
        setLocalSelected([...localSelected, m._id]);
      }
    } else {
      onSelect(m);
      onClose();
    }
  };

  const handleConfirmMultiple = () => {
    const selected = media.filter(m => localSelected.includes(m._id));
    selected.forEach(m => onSelect(m));
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="בחירת מדיה"
      size="xl"
      centered
    >
      <Stack gap="md">
        <Group justify="space-between">
          <FileButton onChange={handleFileUpload} accept="image/*">
            {(props) => (
              <Button
                {...props}
                leftSection={<IconPlus size={18} />}
                loading={uploading}
                size="sm"
              >
                העלאת תמונה חדשה
              </Button>
            )}
          </FileButton>
          {multiple && localSelected.length > 0 && (
            <Button size="sm" onClick={handleConfirmMultiple}>
              בחר ({localSelected.length})
            </Button>
          )}
        </Group>

        {loading && (
          <Group justify="center" py="xl">
            <Loader size="lg" />
          </Group>
        )}

        {!loading && media.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            אין תמונות זמינות. העלה תמונה חדשה.
          </Text>
        )}

        {!loading && media.length > 0 && (
          <Grid style={{ maxHeight: 400, overflow: 'auto' }}>
            {media.map((m) => {
              const isSelected = localSelected.includes(m._id);
              return (
                <Grid.Col key={m._id} span={{ base: 12, xs: 6, sm: 4 }}>
                  <Card
                    padding="xs"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #228be6' : undefined,
                      position: 'relative',
                    }}
                    onClick={() => handleSelect(m)}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 10,
                          backgroundColor: '#228be6',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconCheck size={16} color="white" />
                      </div>
                    )}
                    <Image
                      src={m.thumbnailUrl || m.url}
                      alt={m.alt_he || 'תמונה'}
                      fit="cover"
                      h={120}
                    />
                    <Text size="xs" mt="xs" lineClamp={1}>
                      {m.alt_he || m.fileKey.split('/').pop()}
                    </Text>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        )}
      </Stack>
    </Modal>
  );
}
