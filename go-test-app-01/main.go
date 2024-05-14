package main

import (
	"fmt"
	"math/rand"
)

func main() {
	if tossCoin() == "heads" {
		fmt.Println("Heads")
	} else {
		fmt.Println("Tails")
	}
}

func tossCoin() string {
	if rand.Intn(2) == 0 {
		return "heads"
	} else {
		return "tails"
	}
}
