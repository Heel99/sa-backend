pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git clone https://github.com/Heel99/sa-backend.git
        }
        
        stage('Build and Package') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh "pm2 start npm --name "testing" -- start"
            }
        
        }
    }
}
