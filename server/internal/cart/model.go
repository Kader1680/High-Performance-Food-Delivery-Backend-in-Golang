package cart

import "time"

type Cart struct {
	ID          int64
	UserID      int64
	TotalAmount float64
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type CartItem struct {
	ID        int64
	CartID    int64
	MenuID    int64
	Quantity  int
	Amount    float64
	Subtotal  float64
	CreatedAt time.Time
	UpdatedAt time.Time
}