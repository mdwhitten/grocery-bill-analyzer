"""
Categories Router

Manages the `categories` table — both built-in and user-created custom categories.
Custom categories work identically to built-ins for learning and AI categorization.

GET    /api/categories              — list all categories
POST   /api/categories              — create a new custom category
PATCH  /api/categories/{id}         — rename / recolor a custom category
DELETE /api/categories/{id}         — delete a custom category (not built-ins)
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import aiosqlite

from db.database import get_db

router = APIRouter()


class CategoryOut(BaseModel):
    id: int
    name: str
    color: str
    icon: str
    is_builtin: bool
    is_disabled: bool
    sort_order: int
    created_at: str


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=40)
    color: str = Field(default="#8a7d6b")
    icon: str = Field(default="🏷️")


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=40)
    color: Optional[str] = None
    icon: Optional[str] = None
    is_disabled: Optional[bool] = None


def _row_to_out(r) -> dict:
    return {
        "id": r["id"], "name": r["name"], "color": r["color"], "icon": r["icon"],
        "is_builtin": bool(r["is_builtin"]),
        "is_disabled": bool(r["is_disabled"]) if r["is_disabled"] is not None else False,
        "sort_order": r["sort_order"],
        "created_at": r["created_at"],
    }


@router.get("", response_model=list[CategoryOut])
async def list_categories(db: aiosqlite.Connection = Depends(get_db)):
    """All categories ordered by sort_order (built-ins first, then custom alpha)."""
    async with db.execute(
        "SELECT * FROM categories ORDER BY sort_order, name"
    ) as cur:
        rows = await cur.fetchall()
    return [_row_to_out(r) for r in rows]


@router.post("", response_model=CategoryOut, status_code=201)
async def create_category(
    body: CategoryCreate,
    db: aiosqlite.Connection = Depends(get_db),
):
    """Create a new custom category."""
    async with db.execute(
        "SELECT id FROM categories WHERE LOWER(name) = LOWER(?)", (body.name,)
    ) as cur:
        if await cur.fetchone():
            raise HTTPException(409, f"A category named '{body.name}' already exists.")

    async with db.execute(
        "SELECT COALESCE(MAX(sort_order), 90) as mx FROM categories"
    ) as cur:
        row = await cur.fetchone()
    next_order = (row["mx"] or 90) + 10

    cur = await db.execute(
        "INSERT INTO categories (name, color, icon, is_builtin, sort_order) VALUES (?, ?, ?, 0, ?)",
        (body.name.strip(), body.color, body.icon, next_order),
    )
    await db.commit()

    async with db.execute("SELECT * FROM categories WHERE id = ?", (cur.lastrowid,)) as c:
        row = await c.fetchone()
    return _row_to_out(row)


@router.patch("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: int,
    body: CategoryUpdate,
    db: aiosqlite.Connection = Depends(get_db),
):
    async with db.execute("SELECT * FROM categories WHERE id = ?", (category_id,)) as cur:
        existing = await cur.fetchone()
    if not existing:
        raise HTTPException(404, "Category not found")

    is_builtin = bool(existing["is_builtin"])

    # Built-ins cannot be renamed or recolored, but CAN be toggled disabled
    if is_builtin and (body.name or body.color or body.icon):
        raise HTTPException(403, "Built-in category name, color, and icon cannot be changed.")

    new_name  = body.name.strip()  if body.name  else existing["name"]
    new_color = body.color          if body.color else existing["color"]
    new_icon  = body.icon           if body.icon  else existing["icon"]
    new_disabled = int(body.is_disabled) if body.is_disabled is not None else (existing["is_disabled"] or 0)

    if new_name != existing["name"]:
        async with db.execute(
            "SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?",
            (new_name, category_id),
        ) as cur:
            if await cur.fetchone():
                raise HTTPException(409, f"A category named '{new_name}' already exists.")
        # Cascade rename through all historical data
        await db.execute("UPDATE item_mappings SET category = ? WHERE category = ?", (new_name, existing["name"]))
        await db.execute("UPDATE line_items SET category = ? WHERE category = ?",    (new_name, existing["name"]))

    await db.execute(
        "UPDATE categories SET name = ?, color = ?, icon = ?, is_disabled = ? WHERE id = ?",
        (new_name, new_color, new_icon, new_disabled, category_id),
    )
    await db.commit()

    async with db.execute("SELECT * FROM categories WHERE id = ?", (category_id,)) as cur:
        row = await cur.fetchone()
    return _row_to_out(row)


@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: aiosqlite.Connection = Depends(get_db),
):
    """Delete a custom category; items are reassigned to 'Other'. Built-ins are protected."""
    async with db.execute("SELECT * FROM categories WHERE id = ?", (category_id,)) as cur:
        existing = await cur.fetchone()
    if not existing:
        raise HTTPException(404, "Category not found")
    if existing["is_builtin"]:
        raise HTTPException(403, "Built-in categories cannot be deleted.")

    cat_name = existing["name"]
    await db.execute("UPDATE line_items   SET category = 'Other' WHERE category = ?", (cat_name,))
    await db.execute("UPDATE item_mappings SET category = 'Other' WHERE category = ?", (cat_name,))
    await db.execute("DELETE FROM categories WHERE id = ?", (category_id,))
    await db.commit()
    return {"status": "deleted", "reassigned_to": "Other"}
