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
        sshPublisher(publishers: [
          sshPublisherDesc(
            configName: 'EC2-Docker',  // the SSH name you created in "Publish over SSH"
            transfers: [
              sshTransfer(
                execCommand: '''
                  sudo docker stop devops-container || true
                  sudo docker rm devops-container || true
                  sudo docker pull rampdocker77/devops-insights-portal:${BUILD_NUMBER}
                  sudo docker run -d --name devops-container -p 8080:8080 rampdocker77/devops-insights-portal:${BUILD_NUMBER}
                '''
              )
            ]
          )
        ])
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline succeeded — deployed to EC2!"
    }
    failure {
      echo "❌ Pipeline failed."
    }
  }
}
