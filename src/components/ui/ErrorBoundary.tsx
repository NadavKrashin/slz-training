'use client';

import { Component, ReactNode } from 'react';
import { Button, Stack, Text, Title } from '@mantine/core';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Stack align="center" justify="center" style={{ minHeight: '60vh' }} p="xl">
          <Title order={3} ta="center">
            משהו השתבש
          </Title>
          <Text c="dimmed" ta="center" size="sm">
            אירעה שגיאה בלתי צפויה. אפשר לנסות לרענן את הדף.
          </Text>
          <Button onClick={() => window.location.reload()} variant="light">
            רענן דף
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
}
