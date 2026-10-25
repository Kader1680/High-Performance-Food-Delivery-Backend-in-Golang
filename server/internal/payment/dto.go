package payment

type CreatePaymentRequest struct {
	OrderID             int64   `json:"order_id" binding:"required"`
	Provider            string  `json:"provider" binding:"required"`
	CheckoutSessionID   string  `json:"checkout_session_id" binding:"required"`
	PaymentIntentID     string  `json:"payment_intent_id" binding:"required"`
	Amount              float64 `json:"amount" binding:"required"`
	Currency            string  `json:"currency" binding:"required"`
 
}

type UpdatePaymentStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type PaymentResponse struct {
	ID          int64          `json:"id"`
	OrderID     int64          `json:"order_id"`
	Provider    string         `json:"provider"`
	Status      string         `json:"status"`
	Amount      float64        `json:"amount"`
	Currency    string         `json:"currency"`
}