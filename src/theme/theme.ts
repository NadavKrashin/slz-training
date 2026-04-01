'use client';

import { createTheme } from '@mantine/core';
import { brandBlue, warmOrange } from './colors';

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand: brandBlue, warm: warmOrange },
  fontFamily: "'Heebo', sans-serif",
  headings: { fontFamily: "'Heebo', sans-serif" },
  defaultRadius: 'md',
  white: '#ffffff',
  black: '#1a1b3a',
  components: {
    Button: {
      defaultProps: { radius: 'xl' },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
        },
      },
    },
    Card: {
      defaultProps: { radius: 'lg', shadow: 'none', padding: 'lg' },
      styles: {
        root: {
          border: '1px solid var(--mantine-color-gray-2)',
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.04)',
          transition: 'box-shadow 0.2s, transform 0.15s',
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
