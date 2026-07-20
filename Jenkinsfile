pipeline {
    agent any

    stages {
        stage('Install Node.js & Run Tests') {
            steps {
                checkout scm
                
                sh '''
                    # 1. Устанавливаем недостающие системные утилиты (curl, wget, java)
                    echo "Installing system dependencies..."
                    sudo apt-get update || apt-get update
                    sudo apt-get install -y curl wget default-jre || apt-get install -y curl wget default-jre
                    
                    # 2. Устанавливаем Node.js 22 через nvm
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                    nvm install 22
                    nvm use 22
                    
                    # 3. Устанавливаем зависимости и запускаем тесты
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
                string(credentialsId: 'telegram-monitoring-bot-token', variable: 'TG_TOKEN'),
                string(credentialsId: 'telegram-monitoring-chat-id', variable: 'TG_CHAT_ID')
            ]) {
                sh '''
                    # Убеждаемся, что wget и java доступны и в post-стадии
                    sudo apt-get update || apt-get update
                    sudo apt-get install -y wget default-jre || apt-get install -y wget default-jre
                    
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                    nvm use 22
                    
                    mkdir -p notifications
                    
                    # Скачиваем утилиту уведомлений
                    wget https://github.com/qa-guru/allure-notifications/releases/download/v5.0.2/allure-notifications-5.0.2.jar -O notifications/allure-notifications-5.0.2.jar
                    
                    # Создаем config.json с секретами
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
                    
                    # Отправляем уведомление
                    java "-DconfigFile=notifications/config.json" -jar notifications/allure-notifications-5.0.2.jar
                '''
            }
        }
    }
}