bundle: ## generate source bundles
	GITHUB_REPOSITORY=rl1809/paperback-extensions yarn bundle


deploy: bundle ## deploy to gh-pages
	git checkout gh-pages
	rsync -av bundles/* .
	git add .
	git commit -m "Deploy gh-pages from commit: $(shell git rev-parse --short HEAD)"
	git push origin gh-pages
	git checkout main


# Help target to display usage information
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | sed -e 's/\(\:.*\#\#\)/\:\ /' | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

.PHONY: bundle deploy help
