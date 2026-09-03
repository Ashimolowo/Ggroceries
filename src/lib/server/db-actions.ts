// query: fetch data
// mutation: insert, update, delete data

import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { ggoceriesItems } from "./db/schema";

export const listGgoceriesItems = async () => {
  const rows = await db
    .select()
    .from(ggoceriesItems)
    .orderBy(desc(ggoceriesItems.updated_at));

  return rows;
};

export const createGgoceriesItem = async (input: {
  name: string;
  category: string;
  quantity: number;
  priority: string;
}) => {
  const rows = await db
    .insert(ggoceriesItems)
    .values({
      id: crypto.randomUUID(),
      name: input.name,
      category: input.category,
      quantity: Math.max(1, input.quantity),
      purchased: false,
      priority: input.priority,
      updated_at: Date.now(),
    })
    .returning();

  return rows[0];
};

export const setGgoceriesItemPurchased = async (
  id: string,
  purchased: boolean,
) => {
  const rows = await db
    .update(ggoceriesItems)
    .set({ purchased, updated_at: Date.now() })
    .where(eq(ggoceriesItems.id, id))
    .returning();

  if (!rows.length) return null;

  return rows[0];
};

export const updateGgoceriesItemQuantity = async (
  id: string,
  quantity: number,
) => {
  const rows = await db
    .update(ggoceriesItems)
    .set({
      quantity: Math.max(1, Math.floor(quantity)),
      updated_at: Date.now(),
    })
    .where(eq(ggoceriesItems.id, id))
    .returning();

  if (!rows.length) return null;
  return null;
};

export const deleteGgoceriesItem = async (id: string) => {
  await db.delete(ggoceriesItems).where(eq(ggoceriesItems.id, id));
};

export const clearPurchasedItems = async () => {
  await db.delete(ggoceriesItems).where(eq(ggoceriesItems.purchased, true));
};
