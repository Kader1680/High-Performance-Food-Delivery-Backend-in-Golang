CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,

    code_order VARCHAR(50) NOT NULL UNIQUE,

    user_id BIGINT NOT NULL,

    cart_id BIGINT,

    status VARCHAR(30) NOT NULL DEFAULT 'pending',

    address TEXT NOT NULL,

    delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,

    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT orders_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT orders_cart_id_fkey
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE SET NULL
);