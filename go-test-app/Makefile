cover.out:
	@go test -coverprofile=cover.out ./

cover.txt: cover.out
	@go tool cover -func=cover.out -o cover.txt

cover.html: cover.out
	@go tool cover -html=cover.out -o cover.html

.PHONY: clean
clean:
	@rm -f cover.out cover.txt
