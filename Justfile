# https://just.systems/man/en

# Lists available commands
default:
	just --list

# Starts the Claude container
claude:
	docker compose -f dev/docker-compose.dev.yml up --build --detach
