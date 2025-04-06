run:
	open http://localhost:3000
	uvx python -m http.server 3000

lint:
	prettier -w .

