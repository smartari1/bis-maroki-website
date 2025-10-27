'use client';

import { AppShell, Burger, Group, NavLink, ScrollArea, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDashboard,
  IconToolsKitchen2,
  IconCategory,
  IconMenu2,
  IconPhoto,
  IconSettings,
  IconLogout,
  IconStar,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'לוח בקרה', icon: <IconDashboard size={20} />, href: '/admin/dashboard' },
  { label: 'מנות', icon: <IconToolsKitchen2 size={20} />, href: '/admin/dishes' },
  { label: 'קטגוריות', icon: <IconCategory size={20} />, href: '/admin/categories' },
  { label: 'תפריטים', icon: <IconMenu2 size={20} />, href: '/admin/menus' },
  { label: 'המלצות', icon: <IconStar size={20} />, href: '/admin/reviews' },
  { label: 'מדיה', icon: <IconPhoto size={20} />, href: '/admin/media' },
  { label: 'הגדרות', icon: <IconSettings size={20} />, href: '/admin/settings' },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      dir="rtl"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="lg" fw={700} c="orange.5">
              ביס מרוקאי - ניהול
            </Text>
          </Group>
          <UnstyledButton onClick={handleLogout}>
            <Group gap="xs">
              <IconLogout size={20} />
              <Text size="sm">יציאה</Text>
            </Group>
          </UnstyledButton>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={item.icon}
              active={pathname === item.href || pathname?.startsWith(item.href + '/')}
              mb="xs"
            />
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main pt={80}>{children}</AppShell.Main>
    </AppShell>
  );
}
