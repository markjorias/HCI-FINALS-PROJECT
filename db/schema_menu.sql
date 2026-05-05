-- schema_menu.sql
-- Database schema for managing the coffee shop menu

CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT CHECK(category IN ('ICE COFFEE', 'HOT DRINKS', 'NON COFFEE', 'LIGHT BITE SNACKS', 'NINETY-NINERS', 'ADD-ONS')),
    image_url TEXT,
    variations TEXT, -- Comma-separated or JSON
    sizes TEXT,      -- Comma-separated or JSON
    addons TEXT,     -- JSON array of addon item IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial data seed
INSERT INTO menu_items (name, description, price, category, image_url) 
VALUES ('Hazelnut Latte', 'Smooth and nutty latte available in different sizes.', 100.00, 'NON COFFEE', 'https://www.figma.com/api/mcp/asset/e0e64626-ca4a-4e32-9a95-f78972e62b6a');
