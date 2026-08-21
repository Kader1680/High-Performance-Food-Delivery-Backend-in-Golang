package cart

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

func (h *Handler) GetCart(c *gin.Context) {

	// Temporary until authentication middleware provides user ID.
	userID := int64(1)

	cart, err := h.service.GetCart(
		c.Request.Context(),
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": cart,
	})
}

func (h *Handler) DeleteItem(c *gin.Context) {

	userID := int64(1)

	itemID, err := strconv.ParseInt(
		c.Param("itemID"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid cart item ID",
		})
		return
	}

	err = h.service.DeleteItem(
		c.Request.Context(),
		userID,
		itemID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart item deleted successfully",
	})
}


func (h *Handler) AddItem(c *gin.Context) {

	userID := int64(1)

	var req AddCartItemRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.service.AddItem(
		c.Request.Context(),
		userID,
		req,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Item added to cart successfully",
	})
}


func (h *Handler) UpdateItem(c *gin.Context) {

	userID := int64(1)

	itemID, err := strconv.ParseInt(
		c.Param("itemID"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid cart item ID",
		})
		return
	}

	var req UpdateCartItemRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err = h.service.UpdateItem(
		c.Request.Context(),
		userID,
		itemID,
		req,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart item updated successfully",
	})
}