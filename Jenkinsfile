pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                nodejs('NodeJS2290') {
                    sh 'npm ci'  // ← исправлено
                    sh 'npx playwright install --with-deps'
                    sh 'npx playwright test --reporter=allure-playwright'  
                }
            }
        }
        
        stage('Reports') {
            steps {
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]  
                ])
            }
        }
    }
}
