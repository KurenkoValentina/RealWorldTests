pipeline {
    agent any

    stages {
        stage('Build & Test') {
            steps {
                checkout scm
                sh '''
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    nvm install 22
                    nvm use 22
                    
                    npm ci
                    npx playwright install --with-deps
                    npm t
                    npx allure awesome ./allure-results
                '''
            }
        }
    }

    post {
        always {
            withCredentials([
                string(credentialsId: 'tg-bot-token', variable: 'TG_TOKEN'),
                string(credentialsId: 'tg-chat-id', variable: 'TG_CHAT_ID')
            ]) {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                    nvm use 22
                    
                    mkdir -p notifications
                    wget https://github.com/qa-guru/allure-notifications/releases/download/v5.0.2/allure-notifications-5.0.2.jar -O notifications/allure-notifications-5.0.2.jar
                    
                    cat <<EOF > notifications/config.json
                    {
                      "base": {
                        "project": "RealWorldTests",
                        "environment": "Jenkins",
                        "comment": "Jenkins CI Build",
                        "language": "ru",
                        "allureFolder": "allure-report/",
                        "allureResultsFolder": "allure-results/",
                        "enableChart": true
                      },
                      "telegram": {
                        "token": "${TG_TOKEN}",
                        "chat": "${TG_CHAT_ID}"
                      }
                    }
                    EOF
                    
                    java "-DconfigFile=notifications/config.json" -jar notifications/allure-notifications-5.0.2.jar
                '''
            }
        }
    }
}