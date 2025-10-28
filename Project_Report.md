# DevOps Capstone Project: DevOps Insights Portal

## 1. Introduction
(Overview of the application and technologies used)
- Purpose: simulate and display CI/CD metrics...
- Tech stack: Node.js, Docker, Jenkins, AWS EC2, Prometheus, Grafana, Bash/cron

## 2. Architecture Diagram
(Insert diagram image here or ASCII flow)
GitHub → Jenkins (Build/Test/Push) → Docker Hub → EC2 (docker run) → Prometheus & Grafana → Backups (cron -> S3)

## 3. Tools & Services Used
- Source control: Git, GitHub
- CI/CD: Jenkins on EC2
- Containerization: Docker, Docker Hub
- Infrastructure: AWS EC2 (Ubuntu)
- Monitoring: Prometheus, Grafana, node_exporter
- Storage: AWS S3 (backups)
- Scripting: Bash + cron

## 4. Pipeline Stages Explanation
### Build
- Jenkins pulls code, runs `npm ci`, builds Docker image.
### Test
- (Unit tests could be added; for now lint/build verifies)
### Push
- Jenkins authenticates to Docker Hub and pushes image.
### Deploy
- Jenkins SSHs to App EC2 and runs `deploy.sh` to pull and run the container.
### Monitor
- Prometheus scrapes `/metrics` and node_exporter; Grafana visualizes.

## 5. Implementation Details
- Code structure: `app.js`, `views/`, `public/`
- Prometheus config: `prometheus.yml`
- Grafana dashboard JSON: `grafana/dashboard.json`
- Jenkinsfile: Declarative pipeline (checkout, build, push, deploy)

## 6. Challenges & Learnings
(List real issues you faced while implementing, e.g.)
- Docker image permissions on EC2 and non-root Docker usage
- Jenkins SSH key management and credentials
- Prometheus scraping targets behind firewalls (fix: security groups)
- Automating backups & cron timezones

## 7. Screenshots
- Add Jenkins console output, Docker images, EC2 instance listing, Grafana dashboard screenshots.

## 8. How to run (Appendix)
- Steps to reproduce locally and on AWS (copy README content here)
