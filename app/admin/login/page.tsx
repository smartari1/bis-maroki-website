'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
} from '@mantine/core';
import { IconAlertCircle, IconLogin } from '@tabler/icons-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to intended page or dashboard
        const redirect = searchParams.get('redirect') || '/admin/dashboard';
        router.push(redirect);
        router.refresh();
      } else {
        setError(data.error?.message || 'סיסמה שגויה');
      }
    } catch (err) {
      setError('שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40} dir="rtl">
      <Title ta="center" fw={900} c="orange.5">
        ביס מרוקאי
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        ממשק ניהול
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" title="שגיאה">
                {error}
              </Alert>
            )}

            <PasswordInput
              label="סיסמה"
              placeholder="הזן סיסמה"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="md"
            />

            <Button
              type="submit"
              fullWidth
              size="md"
              loading={loading}
              leftSection={<IconLogin size={18} />}
            >
              כניסה
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <LoginForm />
    </Suspense>
  );
}
