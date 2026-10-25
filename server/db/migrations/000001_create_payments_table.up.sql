CREATE TABLE payments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id),
    provider TEXT NOT NULL DEFAULT 'stripe',
    checkout_session_id TEXT UNIQUE,
    payment_intent_id TEXT UNIQUE,
    amount BIGINT NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'succeeded',
            'failed',
            'cancelled',
            'refunded'
        )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id
    ON payments(order_id);