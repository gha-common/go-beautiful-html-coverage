package main

import (
	"fmt"
	"math/rand"
)

const side = "right"

func main() {
	if tossCoin() == "heads" {
		fmt.Println("Heads")
	} else {
		fmt.Println("Tails")
	}

	printColor("red")

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

func printColor(color string) {
	switch color {
	case "red":
		fmt.Println("Red")
	case "blue":
		fmt.Println("Blue")
	case "green":
		fmt.Println("Green")
	default:
		fmt.Println("Unknown color")
	}
}
