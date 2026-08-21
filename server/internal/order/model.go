package order

import "time"

type OrderStatus string

const (
	StatusPending   OrderStatus = "pending"
	StatusAccepted  OrderStatus = "accepted"
	StatusPreparing OrderStatus = "preparing"
	StatusReady     OrderStatus = "ready"
	StatusDelivering OrderStatus = "delivering"
	StatusDelivered OrderStatus = "delivered"
	StatusCancelled OrderStatus = "cancelled"
)

type Order struct {
	ID           int64       `json:"id"`
	CodeOrder    string      `json:"code_order"`
	UserID       int64       `json:"user_id"`
	CartID       *int64      `json:"cart_id"`
	Status       OrderStatus `json:"status"`
	Address      string      `json:"address"`
	DeliveryFee  float64     `json:"delivery_fee"`
	TotalAmount  float64     `json:"total_amount"`
	CreatedAt    time.Time   `json:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at"`
}

type OrderItem struct {
	ID        int64     `json:"id"`
	OrderID   int64     `json:"order_id"`
	MenuID    int64     `json:"menu_id"`
	UnitPrice float64   `json:"unit_price"`
	Subtotal  float64   `json:"subtotal"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}