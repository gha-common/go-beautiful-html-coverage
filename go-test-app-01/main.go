package main

import (
	"fmt"
	"math/rand"
)

const side = "left"

func main() {
	if tossCoin() == "heads" {
		fmt.Println("Heads")
	} else {
		fmt.Println("Tails")
	}

	fmt.Println("Maybe:", maybe())
}

func tossCoin() string {
	if rand.Intn(2) == 0 {
		return "heads"
	} else {
		return "tails"
	}
}

func maybe() bool {
	if side == "right" {
		return true
	} else {
		return false
	}
}
