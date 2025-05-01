📚 Adaptive Competency Management System
The Adaptive Competency Management System is a web application designed to manage employee data efficiently. It supports adding, updating, retrieving, and deleting employee information. Additionally, it sends an email notification upon the creation of an employee account.

🚀 Features
Employee Management: Add, update, view, and delete employee details.

Email Notifications: Sends an email to the employee upon successful account creation.

Secure Password Storage: Stores encoded passwords using Base64 encoding.

Robust REST API: Uses Spring Boot for building RESTful APIs.

Database Integration: Uses PostgresDB for data persistence.

Cross-Origin Support: Enabled using @CrossOrigin for frontend integration.

🛠️ Technologies Used
Backend: Spring Boot, Spring Data JPA

Database: PostgreSQL Database

Email Service: Jakarta Mail (JavaMail API)

JSON Processing: Jackson

Dependency Management: Maven

IDE: IntelliJ IDEA

Frontend:
HTML

CSS

JavaScript

Bootstrap 5

VS Code (Recommended IDE)

📝 Prerequisites
Java 17 or above

Maven 3.8+

Spring Boot 3.1+

Postman (for API testing)

⚙️ Project Structure
adaptive-competency-management-system
├── src
│   └── main
│       └── java
│           └── adaptive_competency_management_system
│               ├── controller      # REST Controllers
│               ├── model           # Entity Classes
│               ├── repo            # Repository Interfaces
│               └── service         # Business Logic and Email Service
├── resources
│   ├── application.properties      # Configuration File
└── pom.xml                         # Project Dependencies

📝 Configuration
Update the application.properties file

# Server Configuration
server.port=8080

# postgresql Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ACMS
spring.datasource.username=postgres
spring.datasource.password=password
spring.datasource.driverClassName=org.postgresql.Driver

# JPA Configuration
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update

# Jakarta Mail Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-email-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

🚀 Running the Project
Clone the Repository:
git clone https://github.com/Chethan38999/Adaptive-Competency-Management-System.git
cd Adaptive-Competency-Management-System

Build the Project:
mvn clean install
Run the Application:
Username: sa
Password: password

💡 Tips
Make sure the backend server is running before opening the frontend.
Update the base URL in script.js if the server address changes.

🐛 Troubleshooting
Email Not Sent: Check your SMTP settings and make sure the credentials are correct.
Application Not Starting: Make sure you have the correct Java version and dependencies installed.
Database Connection Issues: Verify your PostgresDB configuration.


