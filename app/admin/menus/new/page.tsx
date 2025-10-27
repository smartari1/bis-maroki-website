import { AdminShell } from '@/components/admin/AdminShell';
import { MenuForm } from '@/components/admin/MenuForm';

export default async function NewMenuPage() {
  return (
    <AdminShell>
      <MenuForm isNew />
    </AdminShell>
  );
}
