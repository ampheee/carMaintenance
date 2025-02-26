package config

import (
	"fmt"
	"log"
	"log/slog"

	"github.com/spf13/viper"
)

type Config struct {
	AppName            string `mapstructure:"app_name"`
	AppAPIVersion      string `mapstructure:"app_api_version"`
	ServerName         string `mapstructure:"server_name"`
	ServerMaxConns     int    `mapstructure:"server_max_conns"`
	ServerScheme       string `mapstructure:"server_scheme"`
	ServerHTTPPort     string `mapstructure:"server_http_port"`
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
	MailUserName       string `mapstructure:"mail_user_name"`
	MailPassword       string `mapstructure:"mail_password"`
	MailServerName     string `mapstructure:"mail_server_name"`
	MailPort           string `mapstructure:"mail_port"`
	MailFromAddress    string `mapstructure:"mail_from_address"`
	MailFromName       string `mapstructure:"mail_from_name"`
}

const (
	configName = "config"
	configType = "yaml"
)

func LoadConfig(buildType string) (*viper.Viper, error) {
	v := viper.New()
	v.SetConfigName(configName + "." + buildType)
	v.SetConfigType(configType)
	v.AddConfigPath(configName)
	v.AddConfigPath(".")

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
		"http_port", conf.ServerHTTPPort,
		"api_version", conf.AppAPIVersion,
	)

	return &conf, nil
}

func New(configType string) *Config {
	v, err := LoadConfig(configType)
	if err != nil {
		log.Fatal(err)
	}

	conf, err := ParseConfig(v)
	if err != nil {
		log.Fatal(err)
	}

	return conf
}
