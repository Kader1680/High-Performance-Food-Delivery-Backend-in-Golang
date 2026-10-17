package order

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


func (h *Handler) Create(c *gin.Context) {

	var req CreateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	 
	userID, ok := getUserID(c)
	if !ok {
		return
	}

	order, err := h.service.Create(
		c.Request.Context(),
		req,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order created successfully",
		"data":    order,
	})
}


func (h *Handler) GetAll(c *gin.Context) {
    userID, ok := getUserID(c)
    if !ok {
        return
    }

    orders, err := h.service.GetAll(
        c.Request.Context(),
        userID,
    )

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to retrieve orders",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "data": orders,
    })
}



func (h *Handler) FindByID(c *gin.Context) {

	userID, ok := getUserID(c)
    if !ok {
        return
    }


	id, err := strconv.ParseInt(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order ID",
		})
		return
	}

	order, err := h.service.FindByID(
		c.Request.Context(),
		id,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": order,
	})
}

func (h *Handler) UpdateStatus(c *gin.Context) {

	userID, ok := getUserID(c)
    if !ok {
        return
    }

	id, err := strconv.ParseInt(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order ID",
		})
		return
	}

	var req UpdateOrderStatusRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	order, err := h.service.UpdateStatus(
		c.Request.Context(),
		id,
		req.Status,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order status updated successfully",
		"data":    order,
	})
}

func (h *Handler) Delete(c *gin.Context) {

	userID, ok := getUserID(c)
    if !ok {
        return
    }

	id, err := strconv.ParseInt(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid order ID",
		})
		return
	}

	err = h.service.Delete(
		c.Request.Context(),
		id,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order deleted successfully",
	})
}