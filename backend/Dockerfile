FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
COPY --from=build /app/target/*.jar /app.jar
EXPOSE 8080
# Batasi memori JVM agar muat di paket gratis 512 MB
ENV JAVA_TOOL_OPTIONS="-Xmx300m -Xss512k"
CMD ["java", "-jar", "/app.jar"]
