package payment

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
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
