LOCAL_COVER_DIR := cover-test

.PHONY: release
release:
	git tag -d v1
	git tag v1 HEAD
	git push -f origin v1

$(LOCAL_COVER_DIR)/revisions:
	@mkdir -p "$(LOCAL_COVER_DIR)/revisions"

$(LOCAL_COVER_DIR)/revisions/local.html: $(LOCAL_COVER_DIR)/revisions
	@cd go-test-app-01; make test
	@cd go-test-app-01; go tool cover -html=cover.out -o "../$(LOCAL_COVER_DIR)/revisions/local.html"
	@cp $(LOCAL_COVER_DIR)/revisions/local.html $(LOCAL_COVER_DIR)/revisions/local-inc.html
	@for file in assets/*; do ln -s "$$PWD/$$file" "$(LOCAL_COVER_DIR)/$(shell basename "$$file")"; done
	@cd $(LOCAL_COVER_DIR); REVISION=local ../scripts/beautify-html.sh

preview: clean $(LOCAL_COVER_DIR)/revisions/local.html
	@echo ""
	@echo preview live at: http://localhost:8000?hash=local
	@echo "  ctrl+c to stop"
	@echo ""
	@cd $(LOCAL_COVER_DIR); python3 -m http.server 8000 > /dev/null

clean:
	@rm -rf "$(LOCAL_COVER_DIR)"
	@cd go-test-app-01; make clean
