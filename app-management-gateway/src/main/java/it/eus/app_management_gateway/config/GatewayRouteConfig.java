package it.eus.app_management_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRouteConfig {

    @Bean
     RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("dummy-route", r -> r
                .path("/dummy-route")
                .uri("https://httpbin.org:80")
            )
            .build();
    }
}
