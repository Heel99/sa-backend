pipeline {
    agent any
        stages {
            
        stage('Build and Package') {
            steps { 
                 dir('sa-backend'){
                sh 'cd sa-backend/'
                sh 'git pull'
                
                sh 'npm cache clean --force'
                sh 'npm install'
                sh 'npm run build'
                sh 'sudo npm install pm2@latest -g'
                sh 'pm2 start npm --name "testing" -- start'
            }
            }
        }
    }
}
