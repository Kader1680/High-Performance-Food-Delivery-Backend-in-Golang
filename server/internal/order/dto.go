package order

type CreateOrderRequest struct {
	Address     string  `json:"address" binding:"required"`
	DeliveryFee float64 `json:"delivery_fee"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

type OrderResponse struct {
	ID          int64          `json:"id"`
	CodeOrder   string         `json:"code_order"`
	UserID      int64          `json:"user_id"`
	CartID      *int64         `json:"cart_id"`
	Status      string         `json:"status"`
	Address     string         `json:"address"`
	DeliveryFee float64        `json:"delivery_fee"`
	TotalAmount float64        `json:"total_amount"`
	Items       []OrderItem    `json:"items"`
}