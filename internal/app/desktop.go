package app

import (
	"context"
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
