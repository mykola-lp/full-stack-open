# 📘 Fullstack Open – Part 11: Continuous Integration and Continuous Deployment (CI/CD)

## Overview

This project is part of the **Fullstack Open** course, focusing on **Continuous Integration and Continuous Deployment (CI/CD)**.

It is a **practical setup of a CI/CD pipeline** for a Node.js application, using automated testing, linting, and deployment workflows.

Unlike previous exercises, this is a **standalone repository** focuses on development workflow automation and software delivery processes.

Repository: [https://github.com/mykola-lp/fs-psql](https://github.com/mykola-lp/fs-pokedex)

---

## Key Topics Covered

* **Continuous Integration (CI)** – automatically running tests and checks on every push or pull request.
* **GitHub Actions workflows** – defining automated pipelines using YAML configuration files.
* **Linting and testing automation** – ensuring code quality before merging changes.
* **Build and validation steps** – verifying that the application compiles and runs correctly in CI environment.
* **Continuous Deployment (CD)** – automatically deploying the application to hosting services when changes pass all checks.

---

## CI/CD Pipeline Concepts

* **Triggers** – workflows run on events such as push, pull request, or merge to main branch.
* **Jobs and steps** – pipelines are divided into jobs, each containing multiple execution steps.
* **Runners** – jobs are executed in isolated virtual machines or containers.
* **Automated quality checks** – linting, unit tests, and build verification are executed automatically.
* **Deployment pipeline** – successful builds can be deployed to services like Render or Fly.io.
