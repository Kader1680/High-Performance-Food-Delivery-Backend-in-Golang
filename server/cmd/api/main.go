package main

import (
	"errors"
	"log"
	"os"
	"path/filepath"

	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/db"
	"github.com/Kader1680/High-Performance-Food-Delivery-Backend/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	loadEnvFile()

	databaseURL := "postgres://abdel:1234@localhost:5432/food_delivery?sslmode=disable"

	pool := db.NewPostgresDB(databaseURL)

	// 2. start server
	router := server.NewRouter(pool)

	log.Fatal(router.Run(":8080"))

}

func loadEnvFile() {
	for _, path := range []string{".env", filepath.Join("server", ".env")} {
		_, err := os.Stat(path)
		if errors.Is(err, os.ErrNotExist) {
			continue
		}
		if err != nil {
			log.Fatalf("check environment file %q: %v", path, err)
		}
		if err := godotenv.Load(path); err != nil {
			log.Fatalf("load environment file %q: %v", path, err)
		}
		return
	}
}
