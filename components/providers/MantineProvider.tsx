'use client';

import { MantineProvider as BaseMantineProvider, DirectionProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';

const theme = createTheme({
  /** Brand colors */
  primaryColor: 'orange',
  colors: {
    orange: [
      '#FFF6ED', // 0 - lightest (brand-cream)
      '#FFE4CC', // 1
      '#FFD1AA', // 2
      '#FFBE88', // 3
      '#FFAB66', // 4
      '#E0723E', // 5 - brand-orange (primary)
      '#C85F30', // 6
      '#B04C22', // 7
      '#983914', // 8
      '#802606', // 9 - darkest
    ],
    brown: [
      '#F5E4D2', // 0 - brand-beige
      '#E7D7C3', // 1 - border-light
      '#D9CAB4', // 2
      '#CBBDA5', // 3
      '#C7A88C', // 4 - border-strong
      '#7C4A27', // 5 - brand-brown (primary)
      '#6A3F22', // 6
      '#58341D', // 7
      '#462918', // 8
      '#341E13', // 9 - darkest
    ],
  },

  /** Typography */
  fontFamily: 'var(--font-heebo), system-ui, sans-serif',
  headings: {
    fontFamily: 'var(--font-heebo), system-ui, sans-serif',
    fontWeight: '700',
  },

  /** Spacing */
  spacing: {
    xs: '0.5rem',  // 8px
    sm: '0.75rem', // 12px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
  },

  /** Border radius */
  radius: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px
    xl: '1.5rem',  // 24px
  },

  /** Shadows */
  shadows: {
    xs: '0 1px 2px rgba(60, 30, 10, 0.08)',
    sm: '0 2px 4px rgba(60, 30, 10, 0.08)',
    md: '0 3px 6px rgba(60, 30, 10, 0.12)',
    lg: '0 8px 16px rgba(60, 30, 10, 0.16)',
    xl: '0 12px 24px rgba(60, 30, 10, 0.20)',
  },

  /** Component overrides for RTL */
  components: {
    AppShell: {
      styles: {
        main: {
          padding: 'var(--mantine-spacing-md)',
        },
      },
    },
  },
});

interface MantineProviderProps {
  children: React.ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <DirectionProvider>
      <BaseMantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider>
          <Notifications position="top-center" />
          {children}
        </ModalsProvider>
      </BaseMantineProvider>
    </DirectionProvider>
  );
}
