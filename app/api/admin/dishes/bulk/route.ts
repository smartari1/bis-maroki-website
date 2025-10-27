import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import '@/lib/db/models';
import Dish from '@/lib/db/models/Dish';
import Menu from '@/lib/db/models/Menu';
import { revalidatePath } from 'next/cache';

// POST - Bulk add to menus or categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, dishIds, menuIds, categoryIds } = body;

    if (!action || !dishIds || !Array.isArray(dishIds) || dishIds.length === 0) {
      return NextResponse.json(
        { error: 'חסרים פרמטרים נדרשים' },
        { status: 400 }
      );
    }

    await connectDB();

    if (action === 'addToMenu') {
      if (!menuIds || !Array.isArray(menuIds) || menuIds.length === 0) {
        return NextResponse.json(
          { error: 'יש לבחור לפחות תפריט אחד' },
          { status: 400 }
        );
      }

      // Add dishes to each menu
      for (const menuId of menuIds) {
        const menu = await Menu.findById(menuId);
        if (!menu) continue;

        // Add each dish to the menu's items if not already present
        for (const dishId of dishIds) {
          const exists = menu.items.some(
            (item: any) => item.kind === 'DISH' && item.refId.toString() === dishId
          );

          if (!exists) {
            menu.items.push({
              kind: 'DISH',
              refId: dishId,
            });
          }
        }

        await menu.save();
      }

      // Also add menuIds to each dish's menuIds array
      await Dish.updateMany(
        { _id: { $in: dishIds } },
        { $addToSet: { menuIds: { $each: menuIds } } }
      );

      // Revalidate paths
      revalidatePath('/admin/dishes');
      revalidatePath('/admin/menus');

      return NextResponse.json({
        success: true,
        message: `${dishIds.length} מנות נוספו ל-${menuIds.length} תפריטים`,
      });
    }

    if (action === 'addToCategory') {
      if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return NextResponse.json(
          { error: 'יש לבחור לפחות קטגוריה אחת' },
          { status: 400 }
        );
      }

      // Add categoryIds to each dish's categoryIds array
      await Dish.updateMany(
        { _id: { $in: dishIds } },
        { $addToSet: { categoryIds: { $each: categoryIds } } }
      );

      // Revalidate paths
      revalidatePath('/admin/dishes');
      revalidatePath('/admin/categories');

      return NextResponse.json({
        success: true,
        message: `${dishIds.length} מנות נוספו ל-${categoryIds.length} קטגוריות`,
      });
    }

    return NextResponse.json(
      { error: 'פעולה לא מוכרת' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה בביצוע הפעולה' },
      { status: 500 }
    );
  }
}

// DELETE - Bulk delete dishes
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { dishIds } = body;

    if (!dishIds || !Array.isArray(dishIds) || dishIds.length === 0) {
      return NextResponse.json(
        { error: 'יש לבחור לפחות מנה אחת למחיקה' },
        { status: 400 }
      );
    }

    await connectDB();

    // Delete the dishes
    const result = await Dish.deleteMany({ _id: { $in: dishIds } });

    // Remove dish references from menus
    await Menu.updateMany(
      { 'items.refId': { $in: dishIds } },
      { $pull: { items: { refId: { $in: dishIds }, kind: 'DISH' } } }
    );

    // Revalidate paths
    revalidatePath('/admin/dishes');
    revalidatePath('/admin/menus');

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} מנות נמחקו בהצלחה`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { error: error.message || 'שגיאה במחיקת המנות' },
      { status: 500 }
    );
  }
}
