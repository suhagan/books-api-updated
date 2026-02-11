INSERT INTO customers (first_name, last_name, email, phone, city, country)
VALUES
('Anna', 'Andersson', 'anna@example.com', '0701234567', 'Stockholm', 'Sweden'),
('Erik', 'Eriksson', 'erik@example.com', '0709876543', 'Uppsala', 'Sweden');

-- Order for Anna (customer_id = 1)
INSERT INTO orders (customer_id, status, total_amount)
VALUES (1, 'NEW', 0);

-- Add items (order_id = 1)
INSERT INTO order_items (order_id, book_id, quantity, unit_price)
VALUES
(1, 1, 1, 349.00),
(1, 2, 1, 399.00);

-- Update total
UPDATE orders
SET total_amount = (
  SELECT COALESCE(SUM(quantity * unit_price), 0)
  FROM order_items
  WHERE order_id = 1
)
WHERE id = 1;
