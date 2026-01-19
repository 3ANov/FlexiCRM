package config

import (
	"os"
	"path/filepath"
	"runtime"
)

type AppPaths struct {
	ConfigPath    string
	DBPath        string
	TemplatesPath string
}

func ResolvePaths(appName string) (*AppPaths, error) {

	// ---------------------------------------
	// WINDOWS — всё рядом с EXE
	// ---------------------------------------
	if runtime.GOOS == "windows" {
		exe, err := os.Executable()
		if err != nil {
			return nil, err
		}
		dir := filepath.Dir(exe)

		templatesDir := filepath.Join(dir, "templates")
		os.MkdirAll(templatesDir, 0755)

		return &AppPaths{
			ConfigPath:    filepath.Join(dir, "config.json"),
			DBPath:        filepath.Join(dir, appName+".db"),
			TemplatesPath: templatesDir,
		}, nil
	}

	// ---------------------------------------
	// LINUX — XDG стандарт
	// ---------------------------------------
	configHome := os.Getenv("XDG_CONFIG_HOME")
	if configHome == "" {
		configHome = filepath.Join(os.Getenv("HOME"), ".config")
	}

	dataHome := os.Getenv("XDG_DATA_HOME")
	if dataHome == "" {
		dataHome = filepath.Join(os.Getenv("HOME"), ".local", "share")
	}

	// ~/.config/flexicrm/
	configDir := filepath.Join(configHome, appName)
	// ~/.local/share/flexicrm/
	dataDir := filepath.Join(dataHome, appName)
	// ~/.local/share/flexicrm/templates/
	templatesDir := filepath.Join(dataDir, "templates")

	os.MkdirAll(configDir, 0755)
	os.MkdirAll(dataDir, 0755)
	os.MkdirAll(templatesDir, 0755)

	return &AppPaths{
		ConfigPath:    filepath.Join(configDir, "config.json"),
		DBPath:        filepath.Join(dataDir, appName+".db"),
		TemplatesPath: templatesDir,
	}, nil
}
