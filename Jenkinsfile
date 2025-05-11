pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'devops-pro_backend' //name of dockerfile image that i've built!i can use any name!
        DOCKER_TAG = 'latest'
        ECR_REPO = '597088020988.dkr.ecr.us-east-1.amazonaws.com/dev'
        AWS_REGION = 'us-east-1'
        EC2_USER = 'ec2-user'
        EC2_IP = '54.90.133.120'
        SSH_KEY_PATH = '/home/memo/.ssh/p.pem'
        CONTAINER_NAME = 'backend-app'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                         sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }

        stage('Login to ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin 597088020988.dkr.ecr.us-east-1.amazonaws.com"
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${ECR_REPO}:${DOCKER_TAG}"
                    sh "docker push ${ECR_REPO}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    sh """
                    ssh -o StrictHostKeyChecking=no -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP} '
                        docker pull ${ECR_REPO}:${DOCKER_TAG} &&
                        docker stop ${CONTAINER_NAME} || true &&
                        docker rm ${CONTAINER_NAME} || true &&
                        docker run -d --name ${CONTAINER_NAME} -p 80:3000 ${ECR_REPO}:${DOCKER_TAG}
                    '
                    """
                }
            }
        }
    }
}
