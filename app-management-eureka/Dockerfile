FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B
COPY src src
RUN ./mvnw clean package -DskipTests -B
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
RUN apk add --no-cache curl
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8761 8901
ENTRYPOINT ["java", "-jar", "app.jar"]