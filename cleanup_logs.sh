#!/bin/bash
LOG_DIR=${1:-/var/log/devops-insights}
find "$LOG_DIR" -type f -mtime +15 -name '*.log' -delete
