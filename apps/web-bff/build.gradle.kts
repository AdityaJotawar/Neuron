plugins {
    java
    application
}

group = "com.neuron"
version = "1.0.0-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter:3.1.0")
    implementation("org.springframework.boot:spring-boot-starter-web:3.1.0")
    implementation("org.springframework.boot:spring-boot-starter-validation:3.1.0")
    
    // AWS Lambda
    implementation("com.amazonaws:aws-lambda-java-core:1.2.3")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.0")
    implementation("com.amazonaws:aws-lambda-java-log4j2:1.6.0")
    
    // Jackson for JSON
    implementation("com.fasterxml.jackson.core:jackson-databind:2.15.2")
    implementation("com.fasterxml.jackson.core:jackson-annotations:2.15.2")
    
    // Lombok
    compileOnly("org.projectlombok:lombok:1.18.30")
    annotationProcessor("org.projectlombok:lombok:1.18.30")
    
    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.1.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}

tasks.test {
    useJUnitPlatform()
}

application {
    mainClass.set("com.neuron.bff.BffApplication")
}
