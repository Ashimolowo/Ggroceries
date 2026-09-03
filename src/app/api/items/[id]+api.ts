import { deleteGgoceriesItem, setGgoceriesItemPurchased, updateGgoceriesItemQuantity } from "@/lib/server/db-actions";


export async function PATCH(request: Request, {id}:{id: string}) {
    try {
        const body = await request.json();

        const item = body.quantity ? await updateGgoceriesItemQuantity(id, body.quantity)
        : await setGgoceriesItemPurchased(id, body.purchased ?? true)

        if (!item) return Response.json({ error: "Item not found."}, {status: 404})

            return Response.json({item})
    } catch (error) {
         const message = error instanceof Error ? error.message : "Failed to update item";
         return Response.json({ error: message }, { status: 500 });
 
    }
}
export async function DELETE(_request: Request, { id }: { id: string }) {
  try {
    await deleteGgoceriesItem(id);
    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete item";
    return Response.json({ error: message }, { status: 500 });
  }
}
