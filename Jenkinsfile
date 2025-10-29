pipeline {
  agent any
  environment {
    DOCKER_IMAGE = "yourdockerhubusername/devops-insights-portal"
    DOCKER_TAG = "${env.BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install & Test') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
      }
    }
    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PW', usernameVariable: 'DOCKER_USER')]) {
          sh 'echo $DOCKER_PW | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
      }
    }
    stage('Deploy to EC2') {
      steps {
        sshagent (credentials: ['app-ec2-ssh']) {
          sh """
            scp -o StrictHostKeyChecking=no deploy/deploy.sh ubuntu@${env.DEPLOY_HOST}:/home/ubuntu/deploy.sh
            ssh -o StrictHostKeyChecking=no ubuntu@${env.DEPLOY_HOST} 'bash /home/ubuntu/deploy.sh ${DOCKER_IMAGE} ${DOCKER_TAG}'
          """
        }
      }
    }
  }
  post {
    success {
      echo "Pipeline succeeded"
    }
    failure {
      echo "Pipeline failed"
    }
  }
}
