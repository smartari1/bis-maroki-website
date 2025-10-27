import { AdminShell } from '@/components/admin/AdminShell';
import { MenuForm } from '@/components/admin/MenuForm';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Menu from '@/lib/db/models/Menu';
import { notFound } from 'next/navigation';

async function getMenu(id: string) {
  await connectDB();

  const menu = await Menu.findById(id).lean();

  if (!menu) {
    return null;
  }

  return {
    _id: menu._id.toString(),
    title: menu.title,
    slug: menu.slug,
    scope: menu.scope,
    items: menu.items || [],
  };
}

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const menu = await getMenu(id);

  if (!menu) {
    notFound();
  }

  return (
    <AdminShell>
      <MenuForm menu={menu} />
    </AdminShell>
  );
}
