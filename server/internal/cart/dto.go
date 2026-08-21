package cart

type AddCartItemRequest struct {
	MenuID   int64 `json:"menu_id" binding:"required"`
	Quantity int   `json:"quantity" binding:"required,gt=0"`
}

type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" binding:"required,gt=0"`
}

type CartItemResponse struct {
	ID       int64   `json:"id"`
	CartID   int64   `json:"cart_id"`
	MenuID   int64   `json:"menu_id"`
	Quantity int     `json:"quantity"`
	Amount   float64 `json:"amount"`
	Subtotal float64 `json:"subtotal"`
}

type CartResponse struct {
	ID          int64             `json:"id"`
	UserID      int64             `json:"user_id"`
	TotalAmount float64           `json:"total_amount"`
	Items       []CartItemResponse `json:"items"`
}