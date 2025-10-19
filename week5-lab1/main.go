package main

import (
	"github.com/gin-gonic/gin"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func main() {
	r := gin.Default()

	r.GET("/users", func(c *gin.Context) {
		user := []User{{ID: "1", Name: "Thanayod"}}
		c.JSON(200, user)
	})
	// /users เป็นชื่อ api ที่ตั้งขึ้นมาเอง
	// นิยาม function โดยไม่ต้องมีชื่อ function ก็ได้

	r.Run(":8080")
	//
}
