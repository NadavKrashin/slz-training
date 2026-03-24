'use client';

import { createTheme } from '@mantine/core';
import { brandBlue } from './colors';

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand: brandBlue },
  fontFamily: "'Heebo', sans-serif",
  headings: { fontFamily: "'Heebo', sans-serif" },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#1a1b3a',
  components: {
    Button: {
      defaultProps: { radius: 'xl' },
      styles: {
        root: { fontWeight: 600 },
      },
    },
    Card: {
      defaultProps: { radius: 'lg', shadow: 'sm', padding: 'lg' },
      styles: {
        root: {
          border: 'none',
          boxShadow: '0 2px 12px rgba(76, 110, 245, 0.08)',
        },
      },
    },
    TextInput: { defaultProps: { radius: 'md' } },
    PasswordInput: { defaultProps: { radius: 'md' } },
    Select: { defaultProps: { radius: 'md' } },
    NumberInput: { defaultProps: { radius: 'md' } },
    Paper: {
      defaultProps: { radius: 'md' },
      styles: {
        root: { border: 'none' },
      },
    },
    Modal: { defaultProps: { radius: 'lg', centered: true } },
    Switch: { defaultProps: { radius: 'xl' } },
    Badge: {
      defaultProps: { radius: 'xl' },
      styles: {
        root: { fontWeight: 600 },
      },
    },
    ActionIcon: {
      defaultProps: { radius: 'xl' },
    },
    ThemeIcon: {
      defaultProps: { radius: 'xl' },
    },
  },
});
