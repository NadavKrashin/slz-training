'use client';

import { createTheme } from '@mantine/core';
import { brandBlue } from './colors';

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand: brandBlue },
  fontFamily: "'Heebo', sans-serif",
  headings: { fontFamily: "'Heebo', sans-serif" },
  defaultRadius: 'md',
  components: {
    Button: { defaultProps: { radius: 'xl' } },
    Card: { defaultProps: { radius: 'lg', shadow: 'sm', withBorder: true } },
    TextInput: { defaultProps: { radius: 'md' } },
    PasswordInput: { defaultProps: { radius: 'md' } },
    Select: { defaultProps: { radius: 'md' } },
    NumberInput: { defaultProps: { radius: 'md' } },
    Paper: { defaultProps: { radius: 'md' } },
    Modal: { defaultProps: { radius: 'lg', centered: true } },
    Switch: { defaultProps: { radius: 'xl' } },
  },
});
