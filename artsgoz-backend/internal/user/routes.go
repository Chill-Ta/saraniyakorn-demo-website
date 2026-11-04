package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.RouterGroup, handler *Handler) {
	users := router.Group("/users")
	users.POST("/register", handler.Register)
}

func RegisterAdminRoutes(router *gin.RouterGroup, adminHandler *AdminHandler, requireAuth gin.HandlerFunc) {
	adminGroup := router.Group("/admin", requireAuth)
	adminGroup.GET("/dashboard", func(c *gin.Context) {
		username, _ := c.Get("username")
		c.JSON(http.StatusOK, gin.H{
			"message":  "Welcome to admin dashboard",
			"username": username,
		})
	})
	adminGroup.GET("/users", adminHandler.GetAllUsers)
	adminGroup.GET("/me", adminHandler.GetProfile)
	adminGroup.PUT("/me", adminHandler.UpdateProfile)
}
