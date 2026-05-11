-- schema_orders.sql
-- Database schema for managing customer orders

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, -- e.g., 'ORD-001'
    customer_name TEXT NOT NULL,
    total_price REAL NOT NULL,
    status TEXT CHECK(status IN ('Received', 'Confirmed', 'Preparing', 'Ready', 'Completed')) DEFAULT 'Received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT,
    item_id INTEGER,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES menu_items(id)
);

