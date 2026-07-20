pipeline {
    agent any

    stages {
        stage('Install Node.js & Run Tests') {
            steps {
                checkout scm
                
                sh '''
                    echo "=== Определяем ОС и доступные инструменты ==="
                    cat /etc/os-release || echo "Не удалось прочитать os-release"
                    
                    # 1. Устанавливаем зависимости в зависимости от типа ОС
                    if command -v apk >/dev/null 2>&1; then
                        echo "Обнаружен Alpine Linux. Устанавливаем через apk..."
                        apk update
                        apk add curl wget openjdk17
                    elif command -v apt-get >/dev/null 2>&1; then
                        echo "Обнаружен Debian/Ubuntu. Устанавливаем через apt-get..."
                        (apt-get update || sudo apt-get update) && (apt-get install -y curl wget default-jre || sudo apt-get install -y curl wget default-jre)
                    elif command -v yum >/dev/null 2>&1; then
                        echo "Обнаружен CentOS/RHEL. Устанавливаем через yum..."
                        yum install -y curl wget java-17-openjdk
                    else
                        echo "Менеджер пакетов не найден. Надеемся, что curl, wget и java уже установлены."
                    fi
                    
                    # 2. Устанавливаем Node.js 22 через nvm
                    echo "=== Устанавливаем Node.js ==="
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                    nvm install 22
                    nvm use 22
                    
                    # 3. Запускаем тесты
                    echo "=== Запускаем тесты ==="
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
                    # Повторяем установку зависимостей для post-стадии (на случай, если окружение сбросилось)
                    if command -v apk >/dev/null 2>&1; then
                        apk add wget openjdk17 --no-cache
                    elif command -v apt-get >/dev/null 2>&1; then
                        (apt-get update || sudo apt-get update) && (apt-get install -y wget default-jre || sudo apt-get install -y wget default-jre)
                    elif command -v yum >/dev/null 2>&1; then
                        yum install -y wget java-17-openjdk
                    fi
                    
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
                    nvm use 22
                    
                    mkdir -p notifications
                    
                    echo "=== Скачиваем Allure Notifications ==="
                    wget https://github.com/qa-guru/allure-notifications/releases/download/v5.0.2/allure-notifications-5.0.2.jar -O notifications/allure-notifications-5.0.2.jar
                    
                    echo "=== Создаем config.json ==="
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
                    
                    echo "=== Отправляем уведомление в Telegram ==="
                    java "-DconfigFile=notifications/config.json" -jar notifications/allure-notifications-5.0.2.jar
                '''
            }
        }
    }
}