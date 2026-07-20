pipeline {
    agent any

    stages {
        stage('Install Dependencies & Run Tests') {
            steps {
                checkout scm
                
                sh '''
                    echo "=== 1. Установка системных зависимостей (включая Chromium) ==="
                    apk update
                    # Устанавливаем Node.js, Java и все библиотеки, необходимые для работы Chromium в Alpine
                    apk add curl wget openjdk17 nodejs npm git chromium nss freetype harfbuzz ca-certificates ttf-freefont
                    
                    echo "=== Проверка версий ==="
                    node -v
                    npm -v
                    java -version
                    chromium --version
                    
                    echo "=== 2. Установка зависимостей проекта ==="
                    npm ci
                    
                    echo "=== 3. Запуск тестов (используем системный Chromium) ==="
                    # Мы НЕ запускаем npx playwright install, так как используем системный браузер
                    npm t
                    
                    echo "=== 4. Генерация отчета Allure ==="
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