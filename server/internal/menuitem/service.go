package menuitem

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
	req CreateMenuItemRequest,
) error {

	item := &MenuItem{
		Title:        req.Title,
		Description:  req.Description,
		Status:       StatusActive,
		Price:        req.Price,
		Image:        req.Image,
		CategoryID:   req.CategoryID,
		Stock:        req.Stock,
		Availability: req.Availability,
	}

	return s.repo.Create(ctx, item)
}

func (s *Service) GetAll(
	ctx context.Context,
) ([]MenuItem, error) {

	return s.repo.GetAll(ctx)
}

func (s *Service) FindByID(
	ctx context.Context,
	id int64,
) (*MenuItem, error) {

	return s.repo.FindByID(ctx, id)
}

func (s *Service) Update(
	ctx context.Context,
	item *MenuItem,
) (*MenuItem, error) {

	if item.Status != StatusActive &&
		item.Status != StatusInactive {
		return nil, errors.New("invalid menu item status")
	}

	return s.repo.Update(ctx, item)
}

func (s *Service) Delete(
	ctx context.Context,
	id int64,
) error {

	return s.repo.Delete(ctx, id)
}