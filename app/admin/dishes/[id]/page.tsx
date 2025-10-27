import { AdminShell } from '@/components/admin/AdminShell';
import { DishForm } from '@/components/admin/DishForm';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Dish from '@/lib/db/models/Dish';
import Category from '@/lib/db/models/Category';
import Menu from '@/lib/db/models/Menu';
import { notFound } from 'next/navigation';

async function getDish(id: string) {
  await connectDB();

  const dish = await Dish.findById(id).lean();

  if (!dish) {
    return null;
  }

  return {
    _id: dish._id.toString(),
    title_he: dish.title_he,
    slug: dish.slug,
    menuIds: dish.menuIds?.map((id: any) => id.toString()) || [],
    categoryIds: dish.categoryIds?.map((id: any) => id.toString()) || [],
    description_he: dish.description_he,
    price: dish.price,
    currency: dish.currency,
    spiceLevel: dish.spiceLevel,
    isVegan: dish.isVegan,
    isVegetarian: dish.isVegetarian,
    isGlutenFree: dish.isGlutenFree,
    allergens: dish.allergens,
    badges: dish.badges,
    mediaIds: dish.mediaIds?.map((id: any) => id.toString()),
    availability: dish.availability,
    status: dish.status,
    seoId: dish.seoId?.toString(),
  };
}

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

export default async function EditDishPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [dish, categories, menus] = await Promise.all([
    getDish(id),
    getCategories(),
    getMenus(),
  ]);

  if (!dish) {
    notFound();
  }

  return (
    <AdminShell>
      <DishForm dish={dish} categories={categories} menus={menus} />
    </AdminShell>
  );
}
