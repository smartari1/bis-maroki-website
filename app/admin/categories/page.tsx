import { AdminShell } from '@/components/admin/AdminShell';
import { CategoriesTable } from '@/components/admin/CategoriesTable';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Category from '@/lib/db/models/Category';

async function getCategories() {
  await connectDB();

  const categories = await Category.find({})
    .sort({ order: 1, name_he: 1 })
    .lean();

  return categories.map((category: any) => ({
    _id: category._id.toString(),
    name_he: category.name_he,
    slug: category.slug,
    typeScope: category.typeScope,
    order: category.order,
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminShell>
      <CategoriesTable categories={categories} />
    </AdminShell>
  );
}
