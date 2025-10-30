pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building the project...'
                // your build commands here
            }
        }

        stage('Docker Build & Push') {
            steps {
                echo 'Building and pushing Docker image...'
                // your docker build and push steps
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'EC2-Docker',   // 🔹 must match the name in "Publish over SSH"
                        transfers: [
                            sshTransfer(
                                execCommand: '''
                                    echo "Deploying container on EC2..."
                                    sudo docker stop devops-container || true
                                    sudo docker rm devops-container || true
                                    sudo docker pull rampdocker77/devops-insights-portal:8
                                    sudo docker run -d -p 8080:3000 --name devops-container rampdocker77/devops-insights-portal:8
                                    echo "Deployment completed successfully!"
                                '''
                            )
                        ],
                        usePromotionTimestamp: false,
                        verbose: true
                    )
                ])
            }
        }
    }
}
