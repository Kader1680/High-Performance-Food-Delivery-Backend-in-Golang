package order

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	Create(ctx context.Context, order *Order) error
	GetAll(ctx context.Context) ([]Order, error)
	FindByID(ctx context.Context, id int64) (*Order, error)
	UpdateStatus(ctx context.Context, id int64, status OrderStatus) (*Order, error)
	Delete(ctx context.Context, id int64) error

	CreateItem(ctx context.Context, item *OrderItem) error
	GetItems(ctx context.Context, orderID int64) ([]OrderItem, error)
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
	order *Order,
) error {

	const query = `
		INSERT INTO orders (
			code_order,
			user_id,
			cart_id,
			status,
			address,
			delivery_fee,
			total_amount
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7
		)
		RETURNING
			id,
			created_at,
			updated_at;
	`

	err := r.db.QueryRow(
		ctx,
		query,
		order.CodeOrder,
		order.UserID,
		order.CartID,
		order.Status,
		order.Address,
		order.DeliveryFee,
		order.TotalAmount,
	).Scan(
		&order.ID,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}


func (r *repository) GetAll(
	ctx context.Context,
) ([]Order, error) {

	const query = `
		SELECT
			id,
			code_order,
			user_id,
			cart_id,
			status,
			address,
			delivery_fee,
			total_amount,
			created_at,
			updated_at
		FROM orders
		ORDER BY created_at DESC;
	`

	rows, err := r.db.Query(ctx, query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var orders []Order

	for rows.Next() {

		var order Order

		err := rows.Scan(
			&order.ID,
			&order.CodeOrder,
			&order.UserID,
			&order.CartID,
			&order.Status,
			&order.Address,
			&order.DeliveryFee,
			&order.TotalAmount,
			&order.CreatedAt,
			&order.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		orders = append(orders, order)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return orders, nil
}


func (r *repository) FindByID(
	ctx context.Context,
	id int64,
) (*Order, error) {

	const query = `
		SELECT
			id,
			code_order,
			user_id,
			cart_id,
			status,
			address,
			delivery_fee,
			total_amount,
			created_at,
			updated_at
		FROM orders
		WHERE id = $1;
	`

	var order Order

	err := r.db.QueryRow(
		ctx,
		query,
		id,
	).Scan(
		&order.ID,
		&order.CodeOrder,
		&order.UserID,
		&order.CartID,
		&order.Status,
		&order.Address,
		&order.DeliveryFee,
		&order.TotalAmount,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &order, nil
}


func (r *repository) UpdateStatus(
	ctx context.Context,
	id int64,
	status OrderStatus,
) (*Order, error) {

	const query = `
		UPDATE orders
		SET
			status = $2,
			updated_at = NOW()
		WHERE id = $1
		RETURNING
			id,
			code_order,
			user_id,
			cart_id,
			status,
			address,
			delivery_fee,
			total_amount,
			created_at,
			updated_at;
	`

	var order Order

	err := r.db.QueryRow(
		ctx,
		query,
		id,
		status,
	).Scan(
		&order.ID,
		&order.CodeOrder,
		&order.UserID,
		&order.CartID,
		&order.Status,
		&order.Address,
		&order.DeliveryFee,
		&order.TotalAmount,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &order, nil
} 

func (r *repository) Delete(
	ctx context.Context,
	id int64,
) error {

	const query = `
		DELETE FROM orders
		WHERE id = $1;
	`

	_, err := r.db.Exec(
		ctx,
		query,
		id,
	)

	return err
}


func (r *repository) CreateItem(
	ctx context.Context,
	item *OrderItem,
) error {

	const query = `
		INSERT INTO orderitems (
			order_id,
			menu_id,
			unit_price,
			subtotal
		)
		VALUES (
			$1,
			$2,
			$3,
			$4
		)
		RETURNING
			id,
			created_at,
			updated_at;
	`

	err := r.db.QueryRow(
		ctx,
		query,
		item.OrderID,
		item.MenuID,
		item.UnitPrice,
		item.Subtotal,
	).Scan(
		&item.ID,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func (r *repository) GetItems(
	ctx context.Context,
	orderID int64,
) ([]OrderItem, error) {

	const query = `
		SELECT
			id,
			order_id,
			menu_id,
			unit_price,
			subtotal,
			created_at,
			updated_at
		FROM orderitems
		WHERE order_id = $1
		ORDER BY id;
	`

	rows, err := r.db.Query(
		ctx,
		query,
		orderID,
	)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var items []OrderItem

	for rows.Next() {

		var item OrderItem

		err := rows.Scan(
			&item.ID,
			&item.OrderID,
			&item.MenuID,
			&item.UnitPrice,
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