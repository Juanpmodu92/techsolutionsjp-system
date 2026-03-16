CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  movement_type VARCHAR(20) NOT NULL CHECK (
    movement_type IN ('entry', 'exit', 'adjustment')
  ),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  previous_stock INTEGER NOT NULL CHECK (previous_stock >= 0),
  new_stock INTEGER NOT NULL CHECK (new_stock >= 0),
  reason TEXT,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id
ON inventory_movements(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at
ON inventory_movements(created_at DESC);