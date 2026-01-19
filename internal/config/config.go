package config

type Config struct {
	Language      string `json:"language"`
	Theme         string `json:"theme"`
	DBPath        string `json:"db_path"`
	TemplatesPath string `json:"templates_path"`
}

func DefaultConfig() *Config {
	return &Config{
		Language:      "ru",
		Theme:         "light",
		DBPath:        "",
		TemplatesPath: "",
	}
}
