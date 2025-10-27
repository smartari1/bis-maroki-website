import { AdminShell } from '@/components/admin/AdminShell';
import { DishForm } from '@/components/admin/DishForm';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Category from '@/lib/db/models/Category';
import Menu from '@/lib/db/models/Menu';

async function getCategories() {
  await connectDB();

  const categories = await Category.find({})
    .sort({ order: 1, name_he: 1 })
    .lean();

  return categories.map((category: any) => ({
    _id: category._id.toString(),
    name_he: category.name_he,
  }));
}

async function getMenus() {
  await connectDB();

  const menus = await Menu.find({})
    .sort({ title: 1 })
    .lean();

  return menus.map((menu: any) => ({
    _id: menu._id.toString(),
    title: menu.title,
  }));
}

export default async function NewDishPage() {
  const [categories, menus] = await Promise.all([
    getCategories(),
    getMenus(),
  ]);

  return (
    <AdminShell>
      <DishForm categories={categories} menus={menus} isNew />
    </AdminShell>
  );
}
