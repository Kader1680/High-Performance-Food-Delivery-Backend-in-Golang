package restaurant

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"

)

type Repository interface {
	Create(ctx context.Context, restaurant *Restaurant) error
	GetAll(ctx context.Context) ([]Restaurant, error)
	FindByID(ctx context.Context, id int64) (*Restaurant,error)
	Update(ctx context.Context, restaurant *Restaurant) (*Restaurant, error)
	Delete(ctx context.Context, id int64) error
}	

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) Create(ctx context.Context, restaurant *Restaurant) error {

	const query = `
	INSERT INTO restaurants
	(
		owner_id,
		name,
		description,
		status,
		is_open,
		phone,
		address
	)
	VALUES
	(
		$1,$2,$3,$4,$5,$6,$7
	)
	RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(
	ctx,
	query,
	restaurant.OwnerID,
	restaurant.Name,
	restaurant.Description,
	restaurant.Status,
	restaurant.IsOpen,
	restaurant.Phone,
	restaurant.Address,
	).Scan(
		&restaurant.ID,
		&restaurant.CreatedAt,
		&restaurant.UpdatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}


func (r *repository) GetAll(ctx context.Context) ([]Restaurant, error){
	const query = `
	SELECT
    id,
    owner_id,
    name,
    description,
    status,
    is_open,
    phone,
    address,
    created_at,
    updated_at
	FROM restaurants;
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var restaurants []Restaurant

	 
	for rows.Next() {

		var restaurant Restaurant

		err := rows.Scan(
			&restaurant.ID,
			&restaurant.OwnerID,
			&restaurant.Name,
			&restaurant.Description,
			&restaurant.Status,
			&restaurant.IsOpen,
			&restaurant.Phone,
			&restaurant.Address,
			&restaurant.CreatedAt,
			&restaurant.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		restaurants = append(restaurants, restaurant)
		}

		if err := rows.Err(); err != nil {
			return nil, err
		}

		return restaurants, nil
	
}

func (r *repository) FindByID(ctx context.Context, id int64,) (*Restaurant,error) {
	const query = `
		SELECT
			id,
			owner_id,
			name,
			description,
			status,
			is_open,
			phone,
			address,
			created_at,
			updated_at
		FROM restaurants
		WHERE id = $1;
	`

	var restaurant Restaurant

	err := r.db.QueryRow(ctx, query, id).Scan(
		&restaurant.ID,
		&restaurant.OwnerID,
		&restaurant.Name,
		&restaurant.Description,
		&restaurant.Status,
		&restaurant.IsOpen,
		&restaurant.Phone,
		&restaurant.Address,
		&restaurant.CreatedAt,
		&restaurant.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &restaurant, nil
}

func (r *repository) Update(
	ctx context.Context,
	restaurant *Restaurant,
) (*Restaurant, error) {

	const query = `
		UPDATE restaurants
		SET
			name = $2,
			description = $3,
			status = $4,
			is_open = $5,
			phone = $6,
			address = $7,
			updated_at = NOW()
		WHERE id = $1
		RETURNING
			id,
			owner_id,
			name,
			description,
			status,
			is_open,
			phone,
			address,
			created_at,
			updated_at;
	`

	var updated Restaurant

	err := r.db.QueryRow(
		ctx,
		query,
		restaurant.ID,
		restaurant.Name,
		restaurant.Description,
		restaurant.Status,
		restaurant.IsOpen,
		restaurant.Phone,
		restaurant.Address,
	).Scan(
		&updated.ID,
		&updated.OwnerID,
		&updated.Name,
		&updated.Description,
		&updated.Status,
		&updated.IsOpen,
		&updated.Phone,
		&updated.Address,
		&updated.CreatedAt,
		&updated.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &updated, nil
}
func (r *repository) Delete(ctx context.Context, id int64) error {
	const query = `
		DELETE FROM restaurants
		WHERE id = $1;
	`

	_, err := r.db.Exec(ctx, query, id)

	return err
}

