# 📝 TaskFlow

TaskFlow is a full-stack project tasks management application designed to help users organize projects, track progress, and manage tasks with a simple, modern user interface.

## 📸 Interface & Features
![Register page](images/registerpage.jpg)
![Login page](images/loginpage.jpg)
![Add project](images/addproject.jpg)
![Add tasks](images/addtasks1.png)
![Dashboard Screenshot](images/dashboard1.jpg)

### **Key Functionalities**
- **🔐 User Authentication**: Secure Login and Registration using JWT.
- **📊 Project Dashboard**: Create, view, and delete projects.
- **✅ Task Management**: 
  - Add tasks with **titles**, **descriptions**, and **due dates**.
  - Toggle task completion status.
  - Delete unwanted tasks.
- **📈 Visual Progress**: Progress bars automatically update as tasks are completed.

---

## Database Architecture

The application is built on a relational database model linking **Users**, **Projects**, and **Tasks**.

![ER Diagram](images/taskflow.drawio.png)

- **Users 1:N Projects** (A user can have many projects)
- **Projects 1:N Tasks** (A project can have many tasks)

---

## 🚀 Technologies Used

### Backend (API)
- **Java** (JDK 21)
- **Spring Boot** (Web, Data JPA, Security)
- **PostgreSQL** (Database)
- **Hibernate** (ORM)
- **JWT** (JSON Web Tokens)

### Frontend (Client)
- **React.js** (Vite)
- **React Router** (Navigation)
- **Axios** (HTTP Client)
- **Custom CSS** (Responsive UI)

---

## 🐳 Docker Setup (Recommended)

The easiest way to run the application is using the provided automation scripts with Docker Compose.

### 1. Prerequisites
- Ensure **Docker Desktop** is installed and running.
- Create a `.env` file in the **root directory** of the project to configure your environment variables (Database credentials, JWT secret, etc.).
```bash
JWT_SECRET_KEY=YourSecretHere
POSTGRES_DB=taskflow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

### 2. Run the Application
I have provided scripts to automate the build and deployment process.

**🪟 For Windows:**
Double-click `run.bat` or run it from the terminal:
```bash
./run.bat
```

**🐧/🍎 For Linux & macOS:**
First, give the script permission to execute, then run it:

```Bash
chmod +x run.sh
./run.sh
```
These scripts will automatically:
- Build the backend JAR file.
- Build the Docker images.
- Start the containers (Frontend, Backend, Database) via Docker Compose.

The app will be accessible in: http://localhost:5173.
  
## ⚙️ Manual Setup

### 1. Database Configuration
The application uses **PostgreSQL** version 16, or you can use a compatible version. You do not need to manually create tables; the app handles this automatically.

1. **Create the Database**:
   ```sql
   CREATE DATABASE taskflow;
   ```
2. **Configure settings**: Open backend/src/main/resources/application.properties and update it to match your PostgreSQL local settings:
Note: Replace ${JWT_SECRET_KEY} with your actual secret key or set it as an Environment Variable.
 ```Bash
spring.datasource.url=jdbc:postgresql://localhost:5432/taskflow
spring.datasource.username=postgres
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
jwt.secret=${JWT_SECRET_KEY}
 ```

### 2. Backend Setup (Spring Boot + Intellij IDEA)
1. **Navigate to the backend directory:**
```Bash
cd backend
```
2. **Run the application:**
```Bash
./mvnw spring-boot:run
```
3. The server will start on http://localhost:8080.

### 3. Frontend Setup (React + VSCode)
1. **Open a new terminal and navigate to the frontend:**
```Bash
cd frontend
```
2. **Install dependencies:**
```Bash
npm install
npm install axios react-router-dom
```
3. **Start the development server:**
```Bash
npm run dev
```
4. Open your browser to the link shown in your terminal, usually: http://localhost:5173.

## 🧪 Unit Testing

To ensure the reliability of the business logic, we implemented a comprehensive suite of **13 Unit Tests** using **JUnit 5** and **Mockito**. These tests cover the critical Service Layer without relying on the database or external dependencies.

### Test Coverage Summary

#### **1. Authentication Security (`AuthServiceTest`)**
- **Password Hashing:** Verified that passwords are never saved in plain text (BCrypt validation).
- **Duplicate Prevention:** Ensures users cannot register with an existing username.
- **Login Validation:** - Verified success flow returns a valid JWT token.
  - Verified failure flow (wrong password/user not found) throws correct exceptions.

#### **2. Project Logic (`ProjectServiceTest`)**
- **Data Isolation:** Verified users can only fetch their own projects.
- **Ownership:** Verified that created projects are correctly assigned to the logged-in user.
- **Progress Calculation (Math Logic):** Verified the algorithm `(completed / total * 100)` correctly calculates project progress percentages based on task status.

#### **3. Task Operations (`TaskServiceTest`)**
- **CRUD Operations:** Verified creation and deletion of tasks.
- **Status Toggling:** Verified the logic for switching task completion (`true`/`false`).
- **Error Handling (Sad Path):** Verified the system fails gracefully when attempting to access non-existent tasks.

### **Running Tests**
To run the tests manually, use the following command in the `backend` directory:
```bash
./mvnw test
```
Or run each test manually in test files.
