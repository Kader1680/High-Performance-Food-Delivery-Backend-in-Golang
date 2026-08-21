package menuitem

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, item *MenuItem) error
	GetAll(ctx context.Context) ([]MenuItem, error)
	FindByID(ctx context.Context, id int64) (*MenuItem, error)
	Update(ctx context.Context, item *MenuItem) (*MenuItem, error)
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

func (r *repository) Create(
	ctx context.Context,
	item *MenuItem,
) error {

	const query = `
		INSERT INTO menuitems (
			title,
			description,
			status,
			price,
			image,
			category_id,
			stock,
			availability
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at;
	`

	err := r.db.QueryRow(
		ctx,
		query,
		item.Title,
		item.Description,
		item.Status,
		item.Price,
		item.Image,
		item.CategoryID,
		item.Stock,
		item.Availability,
	).Scan(
		&item.ID,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	return err
}

func (r *repository) GetAll(
	ctx context.Context,
) ([]MenuItem, error) {

	const query = `
		SELECT
			id,
			title,
			description,
			status,
			price,
			image,
			category_id,
			stock,
			availability,
			created_at,
			updated_at
		FROM menuitems
		ORDER BY id DESC;
	`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []MenuItem

	for rows.Next() {
		var item MenuItem

		err := rows.Scan(
			&item.ID,
			&item.Title,
			&item.Description,
			&item.Status,
			&item.Price,
			&item.Image,
			&item.CategoryID,
			&item.Stock,
			&item.Availability,
			&item.CreatedAt,
			&item.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}

func (r *repository) FindByID(
	ctx context.Context,
	id int64,
) (*MenuItem, error) {

	const query = `
		SELECT
			id,
			title,
			description,
			status,
			price,
			image,
			category_id,
			stock,
			availability,
			created_at,
			updated_at
		FROM menuitems
		WHERE id = $1;
	`

	var item MenuItem

	err := r.db.QueryRow(ctx, query, id).Scan(
		&item.ID,
		&item.Title,
		&item.Description,
		&item.Status,
		&item.Price,
		&item.Image,
		&item.CategoryID,
		&item.Stock,
		&item.Availability,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &item, nil
}

func (r *repository) Update(
	ctx context.Context,
	item *MenuItem,
) (*MenuItem, error) {

	const query = `
		UPDATE menuitems
		SET
			title = $2,
			description = $3,
			status = $4,
			price = $5,
			image = $6,
			stock = $7,
			availability = $8,
			updated_at = NOW()
		WHERE id = $1
		RETURNING
			id,
			title,
			description,
			status,
			price,
			image,
			category_id,
			stock,
			availability,
			created_at,
			updated_at;
	`

	var updated MenuItem

	err := r.db.QueryRow(
		ctx,
		query,
		item.ID,
		item.Title,
		item.Description,
		item.Status,
		item.Price,
		item.Image,
		item.Stock,
		item.Availability,
	).Scan(
		&updated.ID,
		&updated.Title,
		&updated.Description,
		&updated.Status,
		&updated.Price,
		&updated.Image,
		&updated.CategoryID,
		&updated.Stock,
		&updated.Availability,
		&updated.CreatedAt,
		&updated.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &updated, nil
}

func (r *repository) Delete(
	ctx context.Context,
	id int64,
) error {

	const query = `
		DELETE FROM menuitems
		WHERE id = $1;
	`

	_, err := r.db.Exec(ctx, query, id)

	return err
}