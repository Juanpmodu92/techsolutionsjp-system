CREATE TABLE IF NOT EXISTS technical_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  received_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  related_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  ticket_number VARCHAR(30) NOT NULL UNIQUE,
  service_type VARCHAR(30) NOT NULL CHECK (
    service_type IN (
      'maintenance',
      'diagnostic',
      'installation',
      'repair',
      'upgrade',
      'network'
    )
  ),
  device_type VARCHAR(50) NOT NULL,
  device_brand VARCHAR(100),
  device_model VARCHAR(100),
  serial_number VARCHAR(100),
  problem_description TEXT NOT NULL,
  diagnosis TEXT,
  solution TEXT,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  estimated_delivery_date DATE,
  delivered_date DATE,
  service_cost NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (service_cost >= 0),
  status VARCHAR(30) NOT NULL DEFAULT 'received' CHECK (
    status IN (
      'received',
      'diagnosis',
      'in_progress',
      'waiting_parts',
      'completed',
      'delivered',
      'cancelled'
    )
  ),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_technical_services_client_id
ON technical_services(client_id);

CREATE INDEX IF NOT EXISTS idx_technical_services_status
ON technical_services(status);

CREATE INDEX IF NOT EXISTS idx_technical_services_ticket_number
ON technical_services(ticket_number);