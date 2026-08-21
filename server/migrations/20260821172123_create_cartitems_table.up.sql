CREATE TABLE cartitems (
    id BIGSERIAL PRIMARY KEY,

    cart_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,

    quantity INT NOT NULL CHECK (quantity > 0),

    amount NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT cartitems_cart_id_fkey
        FOREIGN KEY (cart_id)
        REFERENCES carts(id)
        ON DELETE CASCADE,

    CONSTRAINT cartitems_menu_id_fkey
        FOREIGN KEY (menu_id)
        REFERENCES menuitems(id)
        ON DELETE CASCADE,

    CONSTRAINT cartitems_cart_menu_unique
        UNIQUE (cart_id, menu_id)
);