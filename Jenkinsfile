pipeline {
    // Используем официальный образ Playwright. Он уже содержит Node.js и все браузеры!
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.45.0-jammy'
            args '-u root' // Важно: запускаем от root, чтобы не было проблем с правами в Jenkins
        }
    }

    stages {
        stage('Run Tests') {
            steps {
                checkout scm
                
                sh '''
                    echo "=== 1. Установка Java и Wget для уведомлений (в образе их нет) ==="
                    apt-get update
                    apt-get install -y default-jre wget
                    
                    echo "=== 2. Проверка версий ==="
                    node -v
                    npm -v
                    java -version
                    
                    echo "=== 3. Установка зависимостей проекта ==="
                    npm ci
                    
                    echo "=== 4. Запуск тестов ==="
                    npm t
                    
                    echo "=== 5. Генерация отчета Allure ==="
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
                    echo "=== Подготовка уведомления в Telegram ==="
                    mkdir -p notifications
                    
                    wget -q https://github.com/qa-guru/allure-notifications/releases/download/v5.0.2/allure-notifications-5.0.2.jar -O notifications/allure-notifications-5.0.2.jar
                    
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
                    
                    echo "=== Отправка уведомления ==="
                    java "-DconfigFile=notifications/config.json" -jar notifications/allure-notifications-5.0.2.jar
                '''
            }
        }
    }
}