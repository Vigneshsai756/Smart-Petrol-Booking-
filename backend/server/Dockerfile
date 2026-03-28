FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw && ./mvnw clean package

CMD ["java", "-jar", "target/server-0.0.1-SNAPSHOT.jar"]