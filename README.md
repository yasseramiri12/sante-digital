# SanteDigital

**SanteDigital** is a Java-based web application built with Spring Boot. The name is derived from the French *santé* (health), positioning the project as a **digital health platform**. The repository is currently in its initial scaffolding phase — the application skeleton has been set up and is ready for feature development.

---

## Table of Contents

1. [Project Goal](#project-goal)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Source Files](#source-files)
5. [Getting Started](#getting-started)
6. [Running Tests](#running-tests)
7. [Current State & Roadmap](#current-state--roadmap)

---

## Project Goal

SanteDigital aims to provide a digital platform for healthcare-related services. The long-term vision is to deliver features such as:

- Patient and practitioner management
- Medical record handling
- Appointment scheduling
- Secure communication between healthcare actors

At this stage the project has been bootstrapped with Spring Boot and a baseline test, establishing the conventions and entry points that all future modules will build upon.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java |
| Framework | Spring Boot |
| Testing | JUnit 5 (Jupiter) + Spring Boot Test |
| Build tool | Maven or Gradle (wrapper scripts `./mvnw` / `./gradlew` expected) |

---

## Repository Structure

```
sante-digital/
├── README.md                                              ← This file
└── src/
    ├── main/
    │   └── java/
    │       └── com/
    │           └── example/
    │               └── santedigital/
    │                   └── SanteDigitalApplication.java  ← Application entry point
    └── test/
        └── java/
            └── com/
                └── example/
                    └── santedigital/
                        └── SanteDigitalApplicationTests.java  ← Integration test
```

---

## Source Files

### `src/main/java/com/example/santedigital/SanteDigitalApplication.java`

The main entry point of the Spring Boot application.

```java
package com.example.santedigital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SanteDigitalApplication {

    public static void main(String[] args) {
        SpringApplication.run(SanteDigitalApplication.class, args);
    }

}
```

- **`@SpringBootApplication`** — enables auto-configuration, component scanning, and configuration support for the entire `com.example.santedigital` package tree.
- **`main()`** — bootstraps the embedded web server and the Spring application context.

---

### `src/test/java/com/example/santedigital/SanteDigitalApplicationTests.java`

The baseline integration test that verifies the Spring context starts up successfully.

```java
package com.example.santedigital;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SanteDigitalApplicationTests {

    @Test
    void contextLoads() {
    }

}
```

- **`@SpringBootTest`** — loads the full application context for integration testing.
- **`contextLoads()`** — passes as long as the Spring context assembles without errors, acting as a smoke test for the application configuration.

---

## Getting Started

> **Prerequisites:** Java 11+ must be installed. The build commands below use the Maven and Gradle wrapper scripts (`./mvnw` / `./gradlew`) that are typically included in the project root and do **not** require a separately installed Maven or Gradle. If the wrappers are not present, install Maven or Gradle manually.

### Build

```bash
# Maven
./mvnw clean package

# Gradle
./gradlew build
```

### Run

```bash
# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun
```

The application will start on **`http://localhost:8080`** by default.

---

## Running Tests

```bash
# Maven
./mvnw test

# Gradle
./gradlew test
```

---

## Current State & Roadmap

| Area | Status |
|---|---|
| Spring Boot skeleton | ✅ Done |
| Application entry point | ✅ Done |
| Baseline context test | ✅ Done |
| Build configuration (`pom.xml` / `build.gradle`) | 🔲 Pending |
| Spring configuration (`application.properties`) | 🔲 Pending |
| Data models / entities | 🔲 Pending |
| Database integration | 🔲 Pending |
| REST API controllers | 🔲 Pending |
| Business-logic services | 🔲 Pending |
| Security / authentication | 🔲 Pending |
| Feature tests | 🔲 Pending |

The project is at the very beginning of its lifecycle. The next steps are to add a build descriptor, configure a data source, and implement the first domain model and REST endpoint.
