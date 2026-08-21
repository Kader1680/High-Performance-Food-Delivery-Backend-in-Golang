package menuitem

type CreateMenuItemRequest struct {
	Title        string  `json:"title" binding:"required,min=3"`
	Description  string  `json:"description"`
	Price        float64 `json:"price" binding:"required,gt=0"`
	Image        string  `json:"image"`
	CategoryID   int64   `json:"category_id" binding:"required"`
	Stock        int     `json:"stock" binding:"gte=0"`
	Availability bool    `json:"availability"`
}

type UpdateMenuItemRequest struct {
	Title        string  `json:"title" binding:"required,min=3"`
	Description  string  `json:"description"`
	Status       string  `json:"status" binding:"required"`
	Price        float64 `json:"price" binding:"gt=0"`
	Image        string  `json:"image"`
	Stock        int     `json:"stock" binding:"gte=0"`
	Availability bool    `json:"availability"`
}

type MenuItemResponse struct {
	ID           int64   `json:"id"`
	Title        string  `json:"title"`
	Description  string  `json:"description"`
	Status       string  `json:"status"`
	Price        float64 `json:"price"`
	Image        string  `json:"image"`
	CategoryID   int64   `json:"category_id"`
	Stock        int     `json:"stock"`
	Availability bool    `json:"availability"`
}