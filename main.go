package main

import (
	"FlexiCRM/internal/app"
	"FlexiCRM/internal/db"
	"log"

	"embed"
	"fmt"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	desktop := app.NewDesktop()
	if err := db.Init(); err != nil {
		log.Fatalf("❌ Ошибка инициализации базы данных: %v", err)
	}
	fmt.Println("📦 Подключение к базе данных установлено")

	err := wails.Run(&options.App{
		Title:     "FlexiCRM",
		Width:     1200,
		Height:    800,
		OnStartup: desktop.Startup,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Bind: []interface{}{desktop},
	})
	if err != nil {
		log.Fatal(err)
	}
}
