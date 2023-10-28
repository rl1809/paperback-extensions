bundle:
	GITHUB_REPOSITORY=rl1809/paperback-extensions yarn bundle

deploy: bundle
	git checkout gh-pages
	rsync -av bundles/* .
	git add .
	git commit -m "Deploy gh-pages from commit: $(shell git rev-parse --short HEAD)"
	git push origin gh-pages
	git checkout main
