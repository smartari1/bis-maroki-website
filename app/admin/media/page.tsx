import { AdminShell } from '@/components/admin/AdminShell';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export default function MediaPage() {
  return (
    <AdminShell>
      <MediaLibrary />
    </AdminShell>
  );
}
