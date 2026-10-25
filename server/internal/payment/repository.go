
package payment

import (
	"context"

 	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, payment *Payment) error
	 
}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{db: db}
}

func (r *repository) Create(
	ctx context.Context,
	payment *Payment,
) error {
	const query = `
		INSERT INTO payments (
			order_id,
			provider,
			checkout_session_id,
			payment_intent_id,
			amount,
			currency,
			status
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at;
	`

	return r.db.QueryRow(
		ctx,
		query,
		payment.OrderID,
		payment.Provider,
		payment.CheckoutSessionID,
		payment.PaymentIntentID,
		payment.Amount,
		payment.Currency,
		payment.Status,
	).Scan(
		&payment.ID,
		&payment.CreatedAt,
		&payment.UpdatedAt,
	)
}
