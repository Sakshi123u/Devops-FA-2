# 🌱 EcoCycle Spring Boot Backend

A production-ready Spring Boot 3.3.4 REST API for **EcoCycle – Smart Waste Management & Recycling Platform**.

---

## 🛠️ Tech Stack
- **Framework:** Spring Boot 3.3.4 (Java 17+)
- **Build Tool:** Apache Maven
- **Database:** H2 Database (In-Memory with web console) / easily switchable to PostgreSQL or MySQL
- **ORM:** Spring Data JPA / Hibernate
- **DevOps Ready:** Dockerfile, Jenkinsfile, Spring Actuator, and Prometheus metrics for Grafana / ELK

---

## 🚀 How to Run the Spring Boot Backend

### Prerequisites
- JDK 17 or higher (`java -version`)
- Apache Maven 3.8+ (`mvn -version`) or IntelliJ IDEA / Eclipse STS

### Step 1: Run via Command Line
```bash
cd backend
mvn clean spring-boot:run
```

The application will start on **`http://localhost:8080`**.

### Step 2: Access the H2 Database Web Console
1. Open your browser and navigate to:
   ```
   http://localhost:8080/h2-console
   ```
2. Enter the connection settings:
   - **JDBC URL:** `jdbc:h2:mem:ecocycledb`
   - **User Name:** `sa`
   - **Password:** *(leave blank)*
3. Click **Connect**. You will see tables: `WASTE_REPORTS`, `PICKUP_REQUESTS`, `RECYCLING_CENTERS`, and `USERS` pre-populated with sample Pune municipal records.

---

## 📡 REST API Endpoints

### 1. Waste Reports
- `GET /api/reports` – Retrieve all waste reports
- `GET /api/reports?user=Sakshi` – Retrieve reports submitted by a specific user
- `GET /api/reports/{id}` – Retrieve single report details
- `POST /api/reports` – Submit a new waste report
  ```json
  {
    "user": "Sakshi",
    "wasteType": "Plastic",
    "location": "Shivajinagar, Pune",
    "description": "Overflowing plastic bin near bus depot",
    "priority": "High"
  }
  ```
- `PATCH /api/reports/{id}/status` – Update report status (Pending, Assigned, Pickup Scheduled, Collected, Recycled)
  ```json
  {
    "status": "Collected"
  }
  ```

### 2. Doorstep Pickups
- `GET /api/pickups` – List all pickup schedules
- `POST /api/pickups` – Schedule a doorstep pickup
  ```json
  {
    "wasteType": "Paper & Cardboard",
    "quantityKg": 12.5,
    "date": "2026-10-10",
    "timeSlot": "9 AM – 11 AM",
    "address": "Flat 402, Green Meadows, Shivajinagar",
    "notes": "Near gate 2"
  }
  ```

### 3. Recycling Centers
- `GET /api/centers` – List all authorized recycling centers
- `GET /api/centers?query=kothrud` – Search centers by location, name, or accepted materials

### 4. Authentication
- `POST /api/auth/login` – Citizen and Admin login verification
  ```json
  {
    "email": "admin@ecocycle.com",
    "password": "admin123"
  }
  ```
- `POST /api/auth/register` – Citizen registration

### 5. DevOps / Monitoring (Prometheus & Health)
- `GET /actuator/health` – Health check for Kubernetes liveness & readiness probes
- `GET /actuator/prometheus` – Prometheus metrics scraper endpoint

---

## 🐳 Docker Containerization
```bash
cd backend
docker build -t ecocycle-backend:latest .
docker run -p 8080:8080 ecocycle-backend:latest
```
