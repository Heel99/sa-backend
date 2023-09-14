pipeline {
    agent any
        stages {
            
        stage('Build and Package') {
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh "pm2 start npm --name "testing" -- start"
            }
        
        }
    }
}
