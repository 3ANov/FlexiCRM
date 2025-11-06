package app

import (
	"context"
	"fmt"
)

type Desktop struct {
	ctx context.Context
}

func NewDesktop() *Desktop {
	return &Desktop{}
}

func (a *Desktop) Startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *Desktop) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
