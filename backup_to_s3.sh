#!/bin/bash
# Usage: backup_to_s3.sh /path/to/data s3://bucket-name/backup-dir
SOURCE="$1"
DEST="$2"
TIMESTAMP=$(date +%F_%H%M)
ARCHIVE="/tmp/backup_${TIMESTAMP}.tar.gz"
tar -czf ${ARCHIVE} -C "$(dirname ${SOURCE})" "$(basename ${SOURCE})"
aws s3 cp ${ARCHIVE} ${DEST}/
rm -f ${ARCHIVE}
