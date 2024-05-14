.PHONY: release
release:
	git tag -d v1
	git tag v1 HEAD
	git push -f origin v1
