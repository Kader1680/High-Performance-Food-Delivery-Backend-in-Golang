package menuitem

import "time"

type MenuItemStatus string

const (
	StatusActive   MenuItemStatus = "active"
	StatusInactive MenuItemStatus = "inactive"
)

type MenuItem struct {
	ID           int64
	Title        string
	Description  string
	Status       MenuItemStatus
	Price        float64
	Image        string
	CategoryID   int64
	Stock        int
	Availability bool
	CreatedAt    time.Time
	UpdatedAt    time.Time
}