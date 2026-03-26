import { UserDetailClient } from './UserDetailClient';

export function generateStaticParams() {
  return [{ uid: '_' }];
}

export default function UserDetailPage() {
  return <UserDetailClient />;
}
