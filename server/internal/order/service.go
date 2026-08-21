package order

import (
	"context"
	"errors"
	"fmt"
	"time"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) Create(
	ctx context.Context,
	req CreateOrderRequest,
	userID int64,
) (*Order, error) {

	if req.Address == "" {
		return nil, errors.New("address is required")
	}

	codeOrder := fmt.Sprintf(
		"ORD-%d",
		time.Now().UnixNano(),
	)

	order := &Order{
		CodeOrder:   codeOrder,
		UserID:      userID,
		Status:      StatusPending,
		Address:     req.Address,
		DeliveryFee: req.DeliveryFee,
		TotalAmount: req.DeliveryFee,
	}

	err := s.repo.Create(
		ctx,
		order,
	)

	if err != nil {
		return nil, err
	}

	return order, nil
}


func (s *Service) GetAll(
	ctx context.Context,
) ([]Order, error) {

	return s.repo.GetAll(ctx)
}

func (s *Service) FindByID(
	ctx context.Context,
	id int64,
) (*OrderResponse, error) {

	order, err := s.repo.FindByID(
		ctx,
		id,
	)

	if err != nil {
		return nil, err
	}

	items, err := s.repo.GetItems(
		ctx,
		order.ID,
	)

	if err != nil {
		return nil, err
	}

	response := &OrderResponse{
		ID:          order.ID,
		CodeOrder:   order.CodeOrder,
		UserID:      order.UserID,
		CartID:      order.CartID,
		Status:      string(order.Status),
		Address:     order.Address,
		DeliveryFee: order.DeliveryFee,
		TotalAmount: order.TotalAmount,
		Items:       items,
	}

	return response, nil
}


func (s *Service) UpdateStatus(
	ctx context.Context,
	id int64,
	status string,
) (*Order, error) {

	orderStatus := OrderStatus(status)

	switch orderStatus {
	case StatusPending,
		StatusAccepted,
		StatusPreparing,
		StatusReady,
		StatusDelivering,
		StatusDelivered,
		StatusCancelled:

	default:
		return nil, errors.New("invalid order status")
	}

	return s.repo.UpdateStatus(
		ctx,
		id,
		orderStatus,
	)
}

func (s *Service) Delete(
	ctx context.Context,
	id int64,
) error {

	return s.repo.Delete(
		ctx,
		id,
	)
}
