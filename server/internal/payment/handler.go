package payment

import (
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}
func getUserID(c *gin.Context) (int64, bool) {
	value, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return 0, false
	}

	userID, ok := value.(int64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid user ID in context",
		})
		return 0, false
	}

	return userID, true
}

func getOrderId(c *gin.Context) (int64, bool) {
	orderID, ok := c.Params.Get("id")
	if !ok || orderID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Order ID is required",
		})
		return 0, false
	}

	parsedOrderID, err := strconv.ParseInt(orderID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid order ID",
		})
		return 0, false
	}

	return parsedOrderID, true
}

func (h *Handler) Create(c *gin.Context) {
	var req CreatePaymentRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	orderID, ok := getOrderId(c)
	if !ok {
		return
	}
	if req.OrderID == 0 {
		req.OrderID = orderID
	}

	if _, ok := getUserID(c); !ok {
		return
	}

	payment, err := h.service.Create(
		c.Request.Context(),
		req,
		orderID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Payment created successfully",
		"data":    payment,
	})
}

func (h *Handler) CreateCheckoutUrl(c *gin.Context) {
	orderID, ok := getOrderId(c)
	if !ok {
		return
	}

	var body struct {
		Amount       int64  `form:"amount" json:"amount" binding:"required"`
		ReceiptEmail string `form:"email" json:"email"`
		Metadata     string `form:"metadata" json:"metadata"`
	}

	if err := c.ShouldBind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	stripeKey := strings.TrimSpace(os.Getenv("STRIPE_SECRET_KEY"))
	if stripeKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Payment service is not configured: STRIPE_SECRET_KEY is missing",
		})
		return
	}
	if strings.HasPrefix(stripeKey, "pk_") {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Payment service is misconfigured: STRIPE_SECRET_KEY must be a Stripe secret key, not a publishable key",
		})
		return
	}
	stripe.Key = stripeKey

	domain := strings.TrimRight(strings.TrimSpace(os.Getenv("FRONTEND_URL")), "/")
	if domain == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Payment service is not configured: FRONTEND_URL is missing",
		})
		return
	}
	params := &stripe.CheckoutSessionParams{
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("usd"),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String("Order #" + strconv.FormatInt(orderID, 10)),
					},
					UnitAmount: stripe.Int64(body.Amount),
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL: stripe.String(domain + "/orders/" + strconv.FormatInt(orderID, 10) + "?payment=success"),
		CancelURL:  stripe.String(domain + "/orders/" + strconv.FormatInt(orderID, 10) + "?payment=cancelled"),
	}
	if email := strings.TrimSpace(body.ReceiptEmail); email != "" {
		params.CustomerEmail = stripe.String(email)
	}
	params.AddMetadata("order_id", strconv.FormatInt(orderID, 10))

	s, err := session.New(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"checkout_url": s.URL})
}
