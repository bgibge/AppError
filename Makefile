NODE ?= node

test:
	@$(NODE) ./node_modules/.bin/eslint . && ./node_modules/.bin/jest

.PHONY: test
