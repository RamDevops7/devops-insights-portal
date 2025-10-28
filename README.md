# DevOps Insights Portal

## Project overview
DevOps Insights Portal is a single-container Node.js web application that simulates CI/CD metrics and exposes Prometheus metrics. This project demonstrates a full DevOps pipeline: GitHub → Jenkins → Docker Hub → EC2 (Docker) → Prometheus & Grafana + cron-based backups.

## Tech stack
- Node.js, Express, EJS
- Docker
- Jenkins (on EC2)
- AWS EC2 (Ubuntu)
- Prometheus, Grafana, node_exporter
- Bash, cron
- Docker Hub

## Quick run (local)
1. Clone repo
2. `npm install`
3. `npm start`
4. Open `http://localhost:3000`

## Docker (local)
1. `docker build -t devops-insights:local .`
2. `docker run -p 3000:3000 devops-insights:local`

## Jenkins pipeline (high level)
- Checkout → npm ci → docker build → docker push → ssh to app EC2 & deploy

## Prometheus & Grafana
- Configure `prometheus.yml` to scrape `http://<APP_IP>:3000/metrics` and `node_exporter`.
- Import `grafana/dashboard.json` as a starter.

## Deployment (EC2)
- Create EC2 Ubuntu instance for Jenkins and one or more App EC2(s).
- Install Docker on App EC2 (user-data script provided).
- Create Jenkins credentials:
  - `dockerhub-creds` (username/password)
  - `app-ec2-ssh` (SSH private key)
- Add `DEPLOY_HOST` env var in Jenkins job (App EC2 public IP).

## Backup & Logs
- `scripts/backup_to_s3.sh` for backups (needs AWS CLI & IAM creds).
- `scripts/cleanup_logs.sh` for log rotation/cleanup. Add cron entries as required.

## Files of interest
- `app.js`, `views/index.ejs` — app code
- `Dockerfile` — container build
- `Jenkinsfile` — pipeline
- `deploy/deploy.sh` — remote deploy helper
- `prometheus.yml`, `grafana/dashboard.json`
- `scripts/*` — backup & cleanup
