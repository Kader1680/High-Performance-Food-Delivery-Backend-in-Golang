package cart

import (
	"context"
	"errors"

	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/menuitem"
)

type Service struct {
	repo     Repository
	menuRepo menuitem.Repository
}

func NewService(
	repo Repository,
	menuRepo menuitem.Repository,
) *Service {

	return &Service{
		repo:     repo,
		menuRepo: menuRepo,
	}
}

func (s *Service) GetCart(
	ctx context.Context,
	userID int64,
) (*CartResponse, error) {

	cart, err := s.repo.GetOrCreate(ctx, userID)

	if err != nil {
		return nil, err
	}

	items, err := s.repo.GetItems(ctx, cart.ID)

	if err != nil {
		return nil, err
	}

	response := &CartResponse{
		ID:          cart.ID,
		UserID:      cart.UserID,
		TotalAmount: cart.TotalAmount,
	}

	for _, item := range items {

		response.Items = append(
			response.Items,
			CartItemResponse{
				ID:       item.ID,
				CartID:   item.CartID,
				MenuID:   item.MenuID,
				Quantity: item.Quantity,
				Amount:   item.Amount,
				Subtotal: item.Subtotal,
			},
		)
	}

	return response, nil
}

func (s *Service) AddItem(
	ctx context.Context,
	userID int64,
	req AddCartItemRequest,
) error {

	item, err := s.menuRepo.FindByID(
		ctx,
		req.MenuID,
	)

	if err != nil {
		return err
	}

	if !item.Availability {
		return errors.New("menu item is not available")
	}

	if item.Stock < req.Quantity {
		return errors.New("not enough stock")
	}

	cart, err := s.repo.GetOrCreate(
		ctx,
		userID,
	)

	if err != nil {
		return err
	}

	amount := item.Price
	subtotal := amount * float64(req.Quantity)

	err = s.repo.AddItem(
		ctx,
		cart.ID,
		req.MenuID,
		req.Quantity,
		amount,
		subtotal,
	)

	if err != nil {
		return err
	}

	return s.updateTotal(ctx, cart.ID)
}

 
func (s *Service) UpdateItem(
	ctx context.Context,
	userID int64,
	itemID int64,
	req UpdateCartItemRequest,
) error {

	cart, err := s.repo.GetOrCreate(
		ctx,
		userID,
	)

	if err != nil {
		return err
	}

	// Get the existing cart item
	cartItem, err := s.repo.FindItemByID(
		ctx,
		cart.ID,
		itemID,
	)

	if err != nil {
		return err
	}

	// Get the menu item using its menu_id
	menuItem, err := s.menuRepo.FindByID(
		ctx,
		cartItem.MenuID,
	)

	if err != nil {
		return err
	}

	if !menuItem.Availability {
		return errors.New("menu item is not available")
	}

	if menuItem.Stock < req.Quantity {
		return errors.New("not enough stock")
	}

	amount := menuItem.Price
	subtotal := amount * float64(req.Quantity)

	err = s.repo.UpdateItem(
		ctx,
		cart.ID,
		itemID,
		req.Quantity,
		amount,
		subtotal,
	)

	if err != nil {
		return err
	}

	return s.updateTotal(
		ctx,
		cart.ID,
	)
}





func (s *Service) updateTotal(
	ctx context.Context,
	cartID int64,
) error {

	items, err := s.repo.GetItems(ctx, cartID)
	if err != nil {
		return err
	}

	var total float64

	for _, item := range items {
		total += item.Subtotal
	}

	return s.repo.UpdateTotal(
		ctx,
		cartID,
		total,
	)
}

func (s *Service) DeleteItem(
	ctx context.Context,
	userID int64,
	itemID int64,
) error {

	cart, err := s.repo.GetOrCreate(
		ctx,
		userID,
	)

	if err != nil {
		return err
	}

	err = s.repo.DeleteItem(
		ctx,
		cart.ID,
		itemID,
	)

	if err != nil {
		return err
	}

	return s.updateTotal(
		ctx,
		cart.ID,
	)
}