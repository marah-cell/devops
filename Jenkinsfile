pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'devops-pro_backend' //name of dockerfile image that i've built!i can use any name!
        DOCKER_TAG = 'latest'
        ECR_REPO = '597088020988.dkr.ecr.us-east-1.amazonaws.com/dev'
        AWS_REGION = 'us-east-1'
        EC2_USER = 'ec2-user'
        EC2_IP = '54.167.77.201'
        SSH_KEY_PATH = '/var/jenkins_home/.ssh/p.pem'
        CONTAINER_NAME = 'backend-app'
        AWS_ACCESS_KEY_ID = ''
        AWS_SECRET_ACCESS_KEY = ''
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
                export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} &&
                export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} && // cause jenk needs permission to access AWS services
                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO} &&
                docker pull ${ECR_REPO}:${DOCKER_TAG} &&
                docker stop \$(docker ps -q --filter "name=${CONTAINER_NAME}") || true &&
                docker rm \$(docker ps -a -q --filter "name=${CONTAINER_NAME}") || true &&
                docker run -d --name ${CONTAINER_NAME} -p 80:3000 ${ECR_REPO}:${DOCKER_TAG}
            '
            """
                }
            }
        }
    }
}
