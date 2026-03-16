INSERT INTO users (
  first_name,
  last_name,
  email,
  password_hash,
  role,
  is_active
)
VALUES (
  'Juan',
  'Admin',
  'admin@techsolutionsjp.com',
  '$2b$10$7jQfZ6xg9mW3sP8fLQx2Ue1mH0nK0i9M2uP6lJ5vH8pQ3zR1tY7dK',
  'admin',
  TRUE
)
ON CONFLICT (email) DO NOTHING;