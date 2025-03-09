FROM postgres:latest

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/
COPY migrations /docker-entrypoint-initdb.d/migrations/
COPY seeds /docker-entrypoint-initdb.d/seeds/

# Custom configuration can be added here
# COPY postgresql.conf /etc/postgresql/postgresql.conf

# Set environment variables
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB recipe_manager

EXPOSE 5432
