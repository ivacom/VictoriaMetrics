//go:build (linux || darwin || freebsd || netbsd || openbsd || dragonfly) && !appengine

package termutil

import "syscall"

const sysIoctl = syscall.SYS_IOCTL
