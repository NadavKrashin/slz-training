'use client';

import { Container, ContainerProps } from '@mantine/core';
import { NAV_HEIGHT } from '@/lib/constants';

interface PageContainerProps extends ContainerProps {
  withNavPadding?: boolean;
}

export function PageContainer({ withNavPadding = true, children, ...props }: PageContainerProps) {
  return (
    <Container
      size="sm"
      px="md"
      pt="md"
      pb={withNavPadding ? NAV_HEIGHT + 24 : 'md'}
      {...props}
    >
      {children}
    </Container>
  );
}
