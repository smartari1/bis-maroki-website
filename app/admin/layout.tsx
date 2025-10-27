import { MantineProvider } from '@/components/providers/MantineProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ניהול - ביס מרוקאי',
  description: 'ממשק ניהול למסעדת ביס מרוקאי',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MantineProvider>{children}</MantineProvider>;
}
