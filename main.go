package main

import (
	"FlexiCRM/internal/core"
	"embed"
	"flag"
	"fmt"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed frontend/dist
var assets embed.FS

type DummyDB struct{}

func (d *DummyDB) Ping() error {
	fmt.Println("Псевдо-подключение к базе данных установлено")
	return nil
}

func main() {
	app := NewApp()
	serverMode := flag.Bool("server", false, "Запуск в серверном режиме")
	addr := flag.String("addr", "127.0.0.1:8080", "Адрес сервера")
	flag.Parse()

	db := &DummyDB{}
	if err := db.Ping(); err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}

	if *serverMode {
		fmt.Println("FlexiCRM запущен в SERVER режиме на", *addr)
		core.StartServer(*addr)
		return
	}

	fmt.Println("FlexiCRM запущен в DESKTOP режиме")

	err := wails.Run(&options.App{
		Title:     "FlexiCRM",
		Width:     1200,
		Height:    800,
		OnStartup: app.startup,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Bind: []interface{}{app},
	})
	if err != nil {
		log.Fatal(err)
	}
}
