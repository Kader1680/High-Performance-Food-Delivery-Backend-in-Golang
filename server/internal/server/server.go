package server

import (
	"time"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/auth"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/categories"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/restaurant"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/middleware"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/menuitem"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/cart"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/order"
)

func NewRouter(pool *pgxpool.Pool) *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "server running",
		})
	})
	
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	authRepo := auth.NewRepository(pool)
	authService := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authService)

	authRoutes := r.Group("/api/auth")
	{
		authRoutes.POST("/register", authHandler.Register)
		authRoutes.POST("/login", authHandler.Login)
	}
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/users/me", authHandler.GetMe)
	}

	restaurantRepo := restaurant.NewRepository(pool)
	restaurantService := restaurant.NewService(restaurantRepo)
	restaurantHandler := restaurant.NewHandler(restaurantService)
	restaurants := r.Group("/api/restaurants")
	{
		restaurants.POST("", restaurantHandler.Create)
		restaurants.GET("", restaurantHandler.GetAll)
		restaurants.GET("/:id", restaurantHandler.FindByID)
		restaurants.PUT("/:id", restaurantHandler.Update)
		restaurants.DELETE("/:id", restaurantHandler.Delete)
	}

	categoryRepo := categories.NewRepository(pool)
	categoryService := categories.NewService(categoryRepo)
	categoryHandler := categories.NewHandler(categoryService)
	categories := r.Group("/categories")
	{
		categories.POST("/", categoryHandler.Create)
		categories.GET("/", categoryHandler.GetAll)
	}

	menuItemRepo := menuitem.NewRepository(pool)
	menuItemService := menuitem.NewService(menuItemRepo)
	menuItemHandler := menuitem.NewHandler(menuItemService)

	menuItems := r.Group("/api/menuitems")
	{
		menuItems.POST("", menuItemHandler.Create)
		menuItems.GET("", menuItemHandler.GetAll)
		menuItems.GET("/:id", menuItemHandler.FindByID)
		menuItems.PUT("/:id", menuItemHandler.Update)
		menuItems.DELETE("/:id", menuItemHandler.Delete)
	}

	cartRepo := cart.NewRepository(pool)


	cartService := cart.NewService(
		cartRepo,
		menuItemRepo,
	)

	cartHandler := cart.NewHandler(cartService)

	carts := r.Group("/api/cart")
	{
		carts.GET("", cartHandler.GetCart)
		carts.POST("/items", cartHandler.AddItem)
		carts.DELETE("/items/:itemID", cartHandler.DeleteItem)
		carts.PUT("/items/:itemID", cartHandler.UpdateItem)
	}


	orderRepo := order.NewRepository(pool)
	orderService := order.NewService(orderRepo)
	orderHandler := order.NewHandler(orderService)

	orders := r.Group("/api/orders")
	{
		orders.POST("", orderHandler.Create)
		orders.GET("", orderHandler.GetAll)
		orders.GET("/:id", orderHandler.FindByID)
		orders.PUT("/:id/status", orderHandler.UpdateStatus)
		orders.DELETE("/:id", orderHandler.Delete)
	}
	return r
}