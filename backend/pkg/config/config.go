package config

import (
	"fmt"
	"log"
	"log/slog"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	AppName            string `mapstructure:"app_name"`
	AppAPIVersion      string `mapstructure:"app_api_version"`
	ServerName         string `mapstructure:"server_name"`
	ServerMaxConns     int    `mapstructure:"server_max_conns"`
	ServerScheme       string `mapstructure:"server_scheme"`
	ServerPort         string `mapstructure:"server_port"`
	ServerHost         string `mapstructure:"server_host"`
	BaseURL            string `mapstructure:"base_url"`
	BaseAPIURL         string `mapstructure:"base_api_url"`
	HashSecretKey      string `mapstructure:"hash_secret_key"`
	JWTSecretKey       string `mapstructure:"jwt_secret_key"`
	JWTExpiredIn       int    `mapstructure:"jwt_expired_in"`
	JWTMaxAge          int    `mapstructure:"jwt_max_age"`
	PostgresServerName string `mapstructure:"postgres_server_name"`
	PostgresPort       int    `mapstructure:"postgres_port"`
	PostgresDBName     string `mapstructure:"postgres_db_name"`
	PostgresUser       string `mapstructure:"postgres_user_name"`
	PostgresPassword   string `mapstructure:"postgres_password"`
}

const (
	productionConfigName = "config.prod.yaml"
	developConfigName    = "config.dev.yaml"
	configType           = "yaml"
	configPath           = "config"
)

func LoadConfig() (*viper.Viper, error) {
	v := viper.New()
	if os.Getenv("ENV") == "PRODUCTION" {
		v.SetConfigName(productionConfigName)
	} else {
		v.SetConfigName(developConfigName)
	}

	v.SetConfigType(configType)
	v.AddConfigPath(configPath)

	err := v.ReadInConfig()
	if err != nil {
		return nil, fmt.Errorf("LoadConfig: %w", err)
	}

	return v, nil
}

func ParseConfig(v *viper.Viper) (*Config, error) {
	var conf Config

	err := v.Unmarshal(&conf)
	if err != nil {
		err = fmt.Errorf("ParseConfig: %w", err)
		slog.Error(err.Error())
		return nil, err
	}

	if conf.ServerName == "" || conf.AppName == "" || conf.JWTSecretKey == "" {
		err = fmt.Errorf("ParseConfig: missing required configuration fields")
		slog.Error(err.Error())
		return nil, err
	}

	slog.Info("Configuration parsed successfully",
		"server_name", conf.ServerName,
		"app_name", conf.AppName,
		"scheme", conf.ServerScheme,
		"host", conf.ServerHost,
		"http_port", conf.ServerPort,
		"api_version", conf.AppAPIVersion,
	)

	return &conf, nil
}

func New() Config {
	v, err := LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	conf, err := ParseConfig(v)
	if err != nil {
		log.Fatal(err)
	}

	return *conf
}
