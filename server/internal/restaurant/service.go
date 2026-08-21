package restaurant

import "context"

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
	req CreateRestaurantRequest,
	ownerID int64,
) error {

	restaurant := &Restaurant{
		Name:        req.Name,
		Description: req.Description,
		Phone:       req.Phone,
		Address:     req.Address,
		OwnerID:     ownerID,
		Status:      StatusActive,
		IsOpen:      false,
	}

	return s.repo.Create(ctx, restaurant)
}

func (s *Service) GetAll(
	ctx context.Context,
) ([]Restaurant, error) {

	return s.repo.GetAll(ctx)
}

func (s *Service) FindByID(
	ctx context.Context,
	id int64,
) (*Restaurant, error) {

	return s.repo.FindByID(ctx, id)
}

func (s *Service) Update(
	ctx context.Context,
	restaurant *Restaurant,
) (*Restaurant, error) {

	return s.repo.Update(ctx, restaurant)
}

func (s *Service) Delete(
	ctx context.Context,
	id int64,
) error {

	return s.repo.Delete(ctx, id)
}