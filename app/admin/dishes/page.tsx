import { AdminShell } from '@/components/admin/AdminShell';
import { DishesTable } from '@/components/admin/DishesTable';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Dish from '@/lib/db/models/Dish';
import Menu from '@/lib/db/models/Menu';
import Category from '@/lib/db/models/Category';

async function getData() {
  await connectDB();

  // Fetch dishes
  const dishes = await Dish.find({})
    .populate('menuIds', 'title')
    .populate('categoryIds', 'name_he')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // Fetch all menus
  const menus = await Menu.find({})
    .select('_id title')
    .sort({ title: 1 })
    .lean();

  // Fetch all categories
  const categories = await Category.find({})
    .select('_id name_he')
    .sort({ order: 1, name_he: 1 })
    .lean();

  return {
    dishes: dishes.map((dish: any) => ({
      _id: dish._id.toString(),
      title_he: dish.title_he,
      slug: dish.slug,
      menuNames: dish.menuIds?.map((m: any) => m?.title).filter(Boolean) || [],
      categoryNames: dish.categoryIds?.map((c: any) => c?.name_he).filter(Boolean) || [],
      price: dish.price,
      status: dish.status,
      availability: dish.availability,
    })),
    menus: menus.map((menu: any) => ({
      _id: menu._id.toString(),
      title: menu.title,
    })),
    categories: categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name_he: cat.name_he,
    })),
  };
}

export default async function DishesPage() {
  const { dishes, menus, categories } = await getData();

  return (
    <AdminShell>
      <DishesTable dishes={dishes} menus={menus} categories={categories} />
    </AdminShell>
  );
}
