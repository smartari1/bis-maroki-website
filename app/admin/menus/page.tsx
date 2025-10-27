import { AdminShell } from '@/components/admin/AdminShell';
import { MenusTable } from '@/components/admin/MenusTable';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Menu from '@/lib/db/models/Menu';

async function getMenus() {
  await connectDB();

  const menus = await Menu.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return menus.map((menu: any) => ({
    _id: menu._id.toString(),
    title: menu.title,
    slug: menu.slug,
    scope: menu.scope,
    itemsCount: menu.items?.length || 0,
  }));
}

export default async function MenusPage() {
  const menus = await getMenus();

  return (
    <AdminShell>
      <MenusTable menus={menus} />
    </AdminShell>
  );
}
