package payment

import (
	"context"
	"errors"
 	 
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
	req CreatePaymentRequest,
	orderID int64,
) (*Payment, error) {
	if orderID > 0 {
		req.OrderID = orderID
	}
	if req.OrderID == 0 {
		return nil, errors.New("orderID is required")
	}

	payment := &Payment{
		OrderID:           req.OrderID,
		CheckoutSessionID: req.CheckoutSessionID,
		PaymentIntentID:   req.PaymentIntentID,
		Provider:          req.Provider,
		Amount:            req.Amount,
		Currency:          req.Currency,
		Status:            StatusPending,
	}

	err := s.repo.Create(
		ctx,
		payment,
	)

	if err != nil {
		return nil, err
	}

	return payment, nil
}
