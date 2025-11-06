package main

import (
	"FlexiCRM/internal/app"
	"FlexiCRM/internal/db"
	"log"

	"embed"
	"flag"
	"fmt"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	desktop := app.NewDesktop()
	serverMode := flag.Bool("server", false, "Запуск в серверном режиме")
	addr := flag.String("addr", "127.0.0.1:8080", "Адрес сервера")
	flag.Parse()

	if err := db.Init(); err != nil {
		log.Fatalf("❌ Ошибка инициализации базы данных: %v", err)
	}
	fmt.Println("📦 Подключение к базе данных установлено")

	if *serverMode {
		fmt.Println("FlexiCRM запущен в SERVER режиме на", *addr)
		app.StartServer(*addr)
		return
	}

	fmt.Println("FlexiCRM запущен в DESKTOP режиме")

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
