CREATE TABLE orderitems (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    menu_id BIGINT NOT NULL,

    unit_price NUMERIC(12,2) NOT NULL,

    subtotal NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT orderitems_order_id_fkey
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT orderitems_menu_id_fkey
        FOREIGN KEY (menu_id)
        REFERENCES menuitems(id)
        ON DELETE RESTRICT
);