package cart

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	GetOrCreate(ctx context.Context, userID int64) (*Cart, error)

	GetItems(ctx context.Context, cartID int64) ([]CartItem, error)

	AddItem(
		ctx context.Context,
		cartID int64,
		menuID int64,
		quantity int,
		amount float64,
		subtotal float64,
	) error

	UpdateItem(
		ctx context.Context,
		cartID int64,
		itemID int64,
		quantity int,
		amount float64,
		subtotal float64,
	) error

	DeleteItem(
		ctx context.Context,
		cartID int64,
		itemID int64,
	) error

	UpdateTotal(
		ctx context.Context,
		cartID int64,
		total float64,
	) error

	FindItemByID(
	ctx context.Context,
	cartID int64,
	itemID int64,
	) (*CartItem, error)




}

type repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) Repository {
	return &repository{
		db: db,
	}
}


func (r *repository) GetOrCreate(
	ctx context.Context,
	userID int64,
) (*Cart, error) {

	const query = `
		INSERT INTO carts (user_id)
		VALUES ($1)
		ON CONFLICT (user_id)
		DO UPDATE SET updated_at = NOW()
		RETURNING id, user_id, total_amount, created_at, updated_at;
	`

	var cart Cart

	err := r.db.QueryRow(
		ctx,
		query,
		userID,
	).Scan(
		&cart.ID,
		&cart.UserID,
		&cart.TotalAmount,
		&cart.CreatedAt,
		&cart.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &cart, nil
}

func (r *repository) GetItems(
	ctx context.Context,
	cartID int64,
) ([]CartItem, error) {

	const query = `
		SELECT
			id,
			cart_id,
			menu_id,
			quantity,
			amount,
			subtotal,
			created_at,
			updated_at
		FROM cartitems
		WHERE cart_id = $1
		ORDER BY id;
	`

	rows, err := r.db.Query(ctx, query, cartID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var items []CartItem

	for rows.Next() {

		var item CartItem

		err := rows.Scan(
			&item.ID,
			&item.CartID,
			&item.MenuID,
			&item.Quantity,
			&item.Amount,
			&item.Subtotal,
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

func (r *repository) AddItem(
	ctx context.Context,
	cartID int64,
	menuID int64,
	quantity int,
	amount float64,
	subtotal float64,
) error {

	const query = `
		INSERT INTO cartitems (
			cart_id,
			menu_id,
			quantity,
			amount,
			subtotal
		)
		VALUES ($1, $2, $3, $4, $5);
	`

	_, err := r.db.Exec(
		ctx,
		query,
		cartID,
		menuID,
		quantity,
		amount,
		subtotal,
	)

	return err
}

func (r *repository) UpdateItem(
	ctx context.Context,
	cartID int64,
	itemID int64,
	quantity int,
	amount float64,
	subtotal float64,
) error {

	const query = `
		UPDATE cartitems
		SET
			quantity = $3,
			amount = $4,
			subtotal = $5,
			updated_at = NOW()
		WHERE id = $2
		AND cart_id = $1;
	`

	_, err := r.db.Exec(
		ctx,
		query,
		cartID,
		itemID,
		quantity,
		amount,
		subtotal,
	)

	return err
}

func (r *repository) DeleteItem(
	ctx context.Context,
	cartID int64,
	itemID int64,
) error {

	const query = `
		DELETE FROM cartitems
		WHERE id = $2
		AND cart_id = $1;
	`

	_, err := r.db.Exec(
		ctx,
		query,
		cartID,
		itemID,
	)

	return err
}

func (r *repository) UpdateTotal(
	ctx context.Context,
	cartID int64,
	total float64,
) error {

	const query = `
		UPDATE carts
		SET
			total_amount = $2,
			updated_at = NOW()
		WHERE id = $1;
	`

	_, err := r.db.Exec(
		ctx,
		query,
		cartID,
		total,
	)

	return err
}

func (r *repository) FindItemByID(
	ctx context.Context,
	cartID int64,
	itemID int64,
) (*CartItem, error) {

	const query = `
		SELECT
			id,
			cart_id,
			menu_id,
			quantity,
			amount,
			subtotal,
			created_at,
			updated_at
		FROM cartitems
		WHERE id = $1
		AND cart_id = $2;
	`

	var item CartItem

	err := r.db.QueryRow(
		ctx,
		query,
		itemID,
		cartID,
	).Scan(
		&item.ID,
		&item.CartID,
		&item.MenuID,
		&item.Quantity,
		&item.Amount,
		&item.Subtotal,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &item, nil
}