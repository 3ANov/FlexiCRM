package core

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func StartServer(addr string) {
	router := gin.Default()

	router.GET("/api/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	log.Printf("Сервер слушает на %s\n", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal(err)
	}
}
