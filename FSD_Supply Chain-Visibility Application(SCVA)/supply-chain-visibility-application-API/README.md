# Postgres Installation instructions
- [Install Postgress from here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) : `https://www.enterprisedb.com/downloads/postgres-postgresql-downloads`
- After installation, open pgAdmin UI to connect to DB
- Passwordless login to postgress is configured in API. To update the same in postgres server Copy the file `pg_hba.conf` given in this folder to below location in your computer

`C:\Program Files\PostgreSQL\16\data`

# To run API with Postgress
- Below configuration is required 
- `pom.xml`
```		
        <dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>
```
- `application.properties`
```
spring.datasource.url=jdbc:postgresql://localhost:5432/test_db
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
```

# To run API with H2 
- `pom.xml`
```
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>

```
- `application.properties`
```
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2
```
