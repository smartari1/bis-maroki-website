'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  TextInput,
  Stack,
  Group,
  Tabs,
  Paper,
  Title,
  Text,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface SettingsFormValues {
  brand: {
    name_he: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      tiktok: string;
      youtube: string;
    };
  };
  location: {
    address_he: string;
    lat: string;
    lng: string;
  };
  hours: {
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
  };
  catering: {
    minOrderAmount: string;
    minPersons: string;
    deliveryFee: string;
    freeDeliveryThreshold: string;
  };
}

interface SettingsEditorProps {
  initialData: any;
}

const HEBREW_DAYS = {
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת',
};

export function SettingsEditor({ initialData }: SettingsEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const form = useForm<SettingsFormValues>({
    initialValues: {
      brand: {
        name_he: initialData?.brand?.name_he || '',
      },
      contact: {
        phone: initialData?.contact?.phone || '',
        whatsapp: initialData?.contact?.whatsapp || '',
        email: initialData?.contact?.email || '',
        socialLinks: {
          facebook: initialData?.contact?.socialLinks?.facebook || '',
          instagram: initialData?.contact?.socialLinks?.instagram || '',
          tiktok: initialData?.contact?.socialLinks?.tiktok || '',
          youtube: initialData?.contact?.socialLinks?.youtube || '',
        },
      },
      location: {
        address_he: initialData?.location?.address_he || '',
        lat: initialData?.location?.lat?.toString() || '',
        lng: initialData?.location?.lng?.toString() || '',
      },
      hours: {
        sunday: initialData?.hours?.sunday || '',
        monday: initialData?.hours?.monday || '',
        tuesday: initialData?.hours?.tuesday || '',
        wednesday: initialData?.hours?.wednesday || '',
        thursday: initialData?.hours?.thursday || '',
        friday: initialData?.hours?.friday || '',
        saturday: initialData?.hours?.saturday || '',
      },
      catering: {
        minOrderAmount: initialData?.catering?.minOrderAmount?.toString() || '200',
        minPersons: initialData?.catering?.minPersons?.toString() || '10',
        deliveryFee: initialData?.catering?.deliveryFee?.toString() || '0',
        freeDeliveryThreshold: initialData?.catering?.freeDeliveryThreshold?.toString() || '0',
      },
    },
    validate: {
      contact: {
        email: (value) => {
          if (!value) return null;
          return /^\S+@\S+\.\S+$/.test(value) ? null : 'כתובת אימייל לא תקינה';
        },
      },
      location: {
        lat: (value) => {
          if (!value) return null;
          const num = parseFloat(value);
          return !isNaN(num) && num >= -90 && num <= 90 ? null : 'קו רוחב לא תקין';
        },
        lng: (value) => {
          if (!value) return null;
          const num = parseFloat(value);
          return !isNaN(num) && num >= -180 && num <= 180 ? null : 'קו אורך לא תקין';
        },
      },
      catering: {
        minOrderAmount: (value) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0 ? null : 'מינימום הזמנה חייב להיות מספר חיובי';
        },
        minPersons: (value) => {
          const num = parseInt(value);
          return !isNaN(num) && num >= 1 ? null : 'מינימום סועדים חייב להיות לפחות 1';
        },
        deliveryFee: (value) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0 ? null : 'דמי משלוח חייבים להיות מספר חיובי';
        },
        freeDeliveryThreshold: (value) => {
          const num = parseFloat(value);
          return !isNaN(num) && num >= 0 ? null : 'סף למשלוח חינם חייב להיות מספר חיובי';
        },
      },
    },
  });

  const handleGeocode = async () => {
    const address = form.values.location.address_he;
    if (!address || address.trim() === '') {
      notifications.show({
        title: 'שגיאה',
        message: 'אנא הזן כתובת תחילה',
        color: 'red',
      });
      return;
    }

    setGeocoding(true);

    try {
      // Using Nominatim (OpenStreetMap) free geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Bis-Maroki-Restaurant-Website',
          },
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        form.setFieldValue('location.lat', lat);
        form.setFieldValue('location.lng', lon);

        notifications.show({
          title: 'הצלחה',
          message: `נמצא מיקום: ${data[0].display_name}`,
          color: 'green',
        });
      } else {
        notifications.show({
          title: 'לא נמצא',
          message: 'לא נמצא מיקום עבור הכתובת. נסה כתובת מדויקת יותר',
          color: 'yellow',
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      notifications.show({
        title: 'שגיאה',
        message: 'שגיאה בחיפוש המיקום',
        color: 'red',
      });
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (values: SettingsFormValues) => {
    setLoading(true);

    try {
      // Convert lat/lng and catering values to numbers
      const payload = {
        ...values,
        location: {
          ...values.location,
          lat: values.location.lat ? parseFloat(values.location.lat) : undefined,
          lng: values.location.lng ? parseFloat(values.location.lng) : undefined,
        },
        catering: {
          minOrderAmount: parseFloat(values.catering.minOrderAmount),
          minPersons: parseInt(values.catering.minPersons),
          deliveryFee: parseFloat(values.catering.deliveryFee),
          freeDeliveryThreshold: parseFloat(values.catering.freeDeliveryThreshold),
        },
      };

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'שגיאה בשמירת ההגדרות');
      }

      notifications.show({
        title: 'הצלחה',
        message: 'ההגדרות נשמרו בהצלחה',
        color: 'green',
      });

      router.refresh();
    } catch (error) {
      console.error('Error saving settings:', error);
      notifications.show({
        title: 'שגיאה',
        message: error instanceof Error ? error.message : 'שגיאה בשמירת ההגדרות',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg">
        <Tabs defaultValue="contact" orientation="horizontal">
          <Tabs.List>
            <Tabs.Tab value="contact">יצירת קשר</Tabs.Tab>
            <Tabs.Tab value="hours">שעות פעילות</Tabs.Tab>
            <Tabs.Tab value="location">מיקום</Tabs.Tab>
            <Tabs.Tab value="brand">מותג</Tabs.Tab>
            <Tabs.Tab value="catering">מגשי אירוח</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="contact" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <div>
                  <Title order={3} mb="xs">
                    פרטי התקשרות
                  </Title>
                  <Text size="sm" c="dimmed">
                    טלפון, וואטסאפ ואימייל
                  </Text>
                </div>

                <TextInput
                  label="טלפון"
                  placeholder="05X-XXX-XXXX"
                  {...form.getInputProps('contact.phone')}
                />

                <TextInput
                  label="וואטסאפ"
                  placeholder="05X-XXX-XXXX"
                  {...form.getInputProps('contact.whatsapp')}
                />

                <TextInput
                  label="אימייל"
                  type="email"
                  placeholder="info@example.com"
                  {...form.getInputProps('contact.email')}
                />

                <div style={{ marginTop: '2rem' }}>
                  <Title order={3} mb="xs">
                    רשתות חברתיות
                  </Title>
                  <Text size="sm" c="dimmed" mb="md">
                    קישורים לדפי הרשתות החברתיות
                  </Text>

                  <Stack gap="md">
                    <TextInput
                      label="Facebook"
                      placeholder="https://facebook.com/..."
                      {...form.getInputProps('contact.socialLinks.facebook')}
                    />

                    <TextInput
                      label="Instagram"
                      placeholder="https://instagram.com/..."
                      {...form.getInputProps('contact.socialLinks.instagram')}
                    />

                    <TextInput
                      label="TikTok"
                      placeholder="https://tiktok.com/@..."
                      {...form.getInputProps('contact.socialLinks.tiktok')}
                    />

                    <TextInput
                      label="YouTube"
                      placeholder="https://youtube.com/..."
                      {...form.getInputProps('contact.socialLinks.youtube')}
                    />
                  </Stack>
                </div>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="hours" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <div>
                  <Title order={3} mb="xs">
                    שעות פעילות
                  </Title>
                  <Text size="sm" c="dimmed">
                    הזן שעות פתיחה לכל יום (לדוגמה: "09:00-22:00" או "סגור")
                  </Text>
                </div>

                <Grid gutter="md">
                  {Object.entries(HEBREW_DAYS).map(([key, label]) => (
                    <Grid.Col key={key} span={6}>
                      <TextInput
                        label={label}
                        placeholder="09:00-22:00"
                        {...form.getInputProps(`hours.${key}`)}
                      />
                    </Grid.Col>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="location" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <div>
                  <Title order={3} mb="xs">
                    מיקום
                  </Title>
                  <Text size="sm" c="dimmed">
                    כתובת וקואורדינטות GPS
                  </Text>
                </div>

                <Stack gap="xs">
                  <TextInput
                    label="כתובת"
                    placeholder="רחוב, מספר בית, עיר"
                    {...form.getInputProps('location.address_he')}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    onClick={handleGeocode}
                    loading={geocoding}
                    fullWidth
                  >
                    🔍 חפש מיקום וקבל קואורדינטות
                  </Button>
                </Stack>

                <Group grow>
                  <TextInput
                    label="קו רוחב (Latitude)"
                    placeholder="32.0853"
                    {...form.getInputProps('location.lat')}
                    disabled
                    styles={{
                      input: {
                        backgroundColor: '#f8f9fa',
                        cursor: 'not-allowed',
                      },
                    }}
                  />

                  <TextInput
                    label="קו אורך (Longitude)"
                    placeholder="34.7818"
                    {...form.getInputProps('location.lng')}
                    disabled
                    styles={{
                      input: {
                        backgroundColor: '#f8f9fa',
                        cursor: 'not-allowed',
                      },
                    }}
                  />
                </Group>

                <Text size="sm" c="dimmed">
                  הקואורדינטות מתמלאות אוטומטית לאחר חיפוש הכתובת
                </Text>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="brand" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <div>
                  <Title order={3} mb="xs">
                    מותג
                  </Title>
                  <Text size="sm" c="dimmed">
                    שם המסעדה ומידע על המותג
                  </Text>
                </div>

                <TextInput
                  label="שם המסעדה"
                  placeholder="ביס מרוקאי"
                  required
                  {...form.getInputProps('brand.name_he')}
                />

                <Text size="sm" c="dimmed">
                  העלאת לוגו תתאפשר במסך ניהול המדיה
                </Text>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="catering" pt="lg">
            <Paper p="lg" withBorder>
              <Stack gap="md">
                <div>
                  <Title order={3} mb="xs">
                    הגדרות מגשי אירוח
                  </Title>
                  <Text size="sm" c="dimmed">
                    מינימום הזמנה, דמי משלוח ועוד
                  </Text>
                </div>

                <Grid gutter="md">
                  <Grid.Col span={6}>
                    <TextInput
                      label="מינימום הזמנה (₪)"
                      placeholder="200"
                      type="number"
                      required
                      {...form.getInputProps('catering.minOrderAmount')}
                      description="הסכום המינימלי להזמנה בשקלים"
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <TextInput
                      label="מינימום סועדים"
                      placeholder="10"
                      type="number"
                      required
                      {...form.getInputProps('catering.minPersons')}
                      description="מספר מינימלי של סועדים להזמנה"
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <TextInput
                      label="דמי משלוח (₪)"
                      placeholder="0"
                      type="number"
                      {...form.getInputProps('catering.deliveryFee')}
                      description="עלות משלוח בסיסית (0 למשלוח חינם)"
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <TextInput
                      label="משלוח חינם מעל (₪)"
                      placeholder="0"
                      type="number"
                      {...form.getInputProps('catering.freeDeliveryThreshold')}
                      description="סף להזמנה עם משלוח חינם (0 = לא פעיל)"
                    />
                  </Grid.Col>
                </Grid>

                <Text size="sm" c="blue">
                  💡 הגדרות אלו ישפיעו על עמוד מגשי האירוח ועל ההזמנות מהקונפיגורטור
                </Text>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-start" mt="xl">
          <Button type="submit" size="lg" loading={loading}>
            שמור הגדרות
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
