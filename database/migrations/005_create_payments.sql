CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number VARCHAR(30) NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
  technical_service_id UUID REFERENCES technical_services(id) ON DELETE SET NULL,
  received_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method VARCHAR(30) NOT NULL CHECK (
    payment_method IN (
      'cash',
      'bank_transfer',
      'card',
      'nequi',
      'daviplata',
      'other'
    )
  ),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT payments_single_target_check CHECK (
    (sale_id IS NOT NULL AND technical_service_id IS NULL)
    OR
    (sale_id IS NULL AND technical_service_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_payments_client_id
ON payments(client_id);

CREATE INDEX IF NOT EXISTS idx_payments_sale_id
ON payments(sale_id);

CREATE INDEX IF NOT EXISTS idx_payments_technical_service_id
ON payments(technical_service_id);

CREATE INDEX IF NOT EXISTS idx_payments_payment_date
ON payments(payment_date DESC);