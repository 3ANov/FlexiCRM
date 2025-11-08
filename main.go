package main

import (
	"FlexiCRM/internal/app"
	"FlexiCRM/internal/bindings"
	"FlexiCRM/internal/db"
	"FlexiCRM/internal/repository"
	service "FlexiCRM/internal/services"
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
	repos := repository.InitRepositories(db.DB)
	services := service.InitServices(repos)
	binds := bindings.InitBindings(services)

	err := wails.Run(&options.App{
		Title:     "FlexiCRM",
		Width:     1200,
		Height:    800,
		OnStartup: desktop.Startup,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Bind: []interface{}{
			desktop,
			binds.Clients,
			binds.Tasks,
			binds.Projects,
			binds.Employees,
			binds.Notes,
			binds.Transactions,
			binds.ClientDocuments,
			binds.EmployeeDocuments,
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
