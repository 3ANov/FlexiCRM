package main

import (
	"FlexiCRM/internal/app"
	"FlexiCRM/internal/bindings"
	"FlexiCRM/internal/config"
	"FlexiCRM/internal/db"
	"FlexiCRM/internal/repository"
	service "FlexiCRM/internal/services"
	"context"
	"log"
	"os"

	"embed"
	"fmt"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	paths, err := config.ResolvePaths("flexicrm")
	if err != nil {
		panic(err)
	}

	// -----------------------------------------------------
	// 2. Загружаем config.json или создаём пустой
	// -----------------------------------------------------
	cfg, err := config.LoadConfig(paths.ConfigPath)
	if err != nil {
		panic(err)
	}

	// -----------------------------------------------------
	// 3. Если конфиг пуст — проставляем значения путей
	// -----------------------------------------------------
	updated := false

	if cfg.DBPath == "" {
		cfg.DBPath = paths.DBPath
		updated = true
	}

	if cfg.TemplatesPath == "" {
		cfg.TemplatesPath = paths.TemplatesPath
		updated = true
	}

	// Создаём директорию шаблонов, если её нет
	os.MkdirAll(cfg.TemplatesPath, 0755)

	if updated {
		config.SaveConfig(paths.ConfigPath, cfg)
	}

	if err := db.Init(cfg.DBPath); err != nil {
		log.Fatalf("❌ Ошибка инициализации базы данных: %v", err)
	}
	fmt.Println("📦 Подключение к базе данных установлено")
	repos := repository.InitRepositories(db.DB)
	services := service.InitServices(repos, cfg)
	binds := bindings.InitBindings(services)

	desktop := app.NewDesktop()
	err = wails.Run(&options.App{
		Title:  "FlexiCRM",
		Width:  1200,
		Height: 800,
		OnStartup: func(ctx context.Context) {
			desktop.Startup(ctx)
			binds.SetContext(ctx)
		},
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
			binds.DocumentTemplates,
			binds.ClientDocuments,
			binds.EmployeeDocuments,
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
