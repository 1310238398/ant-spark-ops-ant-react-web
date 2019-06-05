.PHONY: build

all: start

build:
	npm run build

publish: build
	scp -r dist/* root@39.98.250.155:/root/services/smartpark/dist/

start: 
	npm start
	