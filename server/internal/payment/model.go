package payment

import "time"

type PaymentStatus string

const (
	StatusPending   PaymentStatus = "pending"
	StatusAccepted  PaymentStatus = "succeeded"
	StatusPreparing PaymentStatus = "failed"
	StatusCancelled PaymentStatus = "refunded"
)

type Payment struct {
	ID                int64         `json:"id"`
	Status            PaymentStatus `json:"status"`
	OrderID           int64         `json:"order_id"`
	Provider          string        `json:"provider"`
	CheckoutSessionID string        `json:"checkout_session_id"`
	PaymentIntentID   string        `json:"payment_intent_id"`
	Amount       	  float64       `json:"amount"`
	Currency          string        `json:"currency"`
	CreatedAt         time.Time     `json:"created_at"`
	UpdatedAt         time.Time     `json:"updated_at"`
}

 