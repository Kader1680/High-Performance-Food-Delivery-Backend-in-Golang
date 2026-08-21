package restaurant

type CreateRestaurantRequest struct {
	Name        string `json:"name" binding:"required,min=3"`
	Description string `json:"description"`
	Phone       string `json:"phone" binding:"required"`
	Address     string `json:"address" binding:"required"`
}

type RestaurantResponse struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Phone       string `json:"phone"`
	Address     string `json:"address"`
	Status      string `json:"status"`
	IsOpen      bool   `json:"is_open"`
}

type UpdateRestaurantRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Phone       string `json:"phone"`
	Address     string `json:"address"`
	Status      string `json:"status"`
	IsOpen      bool   `json:"is_open"`
}