import { EditWorkoutClient } from './EditWorkoutClient';

export function generateStaticParams() { return [{ dateKey: '_' }]; }

export default function EditWorkoutPage() {
  return <EditWorkoutClient />;
}
