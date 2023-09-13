pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git clone https://github.com/Heel99/sa-backend.git
        }
        
        stage('Build and Package') {
            steps {
                // Build and package your Node.js application here, e.g., npm install and npm build
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                // Use SSH to copy your application files to the EC2 instance
                sshagent(credentials: ['<YOUR_SSH_KEY_CREDENTIALS_ID>']) {
                    sh "scp -i /var/lib/jenkins/your-ssh-key.pem -o StrictHostKeyChecking=no -r ./dist ec2-user@<YOUR_EC2_IP>:~/nodebackend"
                }
                
                // SSH into the EC2 instance and deploy the application
                sshagent(credentials: ['<YOUR_SSH_KEY_CREDENTIALS_ID>']) {
                    sh "ssh -i /var/lib/jenkins/your-ssh-key.pem -o StrictHostKeyChecking=no ec2-user@<YOUR_EC2_IP> 'cd ~/nodebackend && pm2 restart app.js'"
                }
            }
        }
    }
}
