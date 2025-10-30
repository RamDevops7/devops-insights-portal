pipeline {
  agent any
  environment {
    DOCKER_IMAGE = "rampdocker77/devops-insights-portal"
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
        bat 'npm install'
      }
    }

    stage('Build Docker Image') {
      steps {
        bat "docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% ."
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PW', usernameVariable: 'DOCKER_USER')]) {
          bat '''
          echo %DOCKER_PW% | docker login -u %DOCKER_USER% --password-stdin
          docker push %DOCKER_IMAGE%:%DOCKER_TAG%
          '''
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        echo "Deployment will be done from Linux EC2 (skip in Windows build)"
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

