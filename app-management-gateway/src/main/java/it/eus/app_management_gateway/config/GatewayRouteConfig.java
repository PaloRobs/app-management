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
	        .route("user-service", r -> r
	            .path("/api/v1/users/**")
	            .filters(f -> f.tokenRelay())   // ATTENZIONE: abilita il token relay qui
	            .uri("http://user-service:8585") // backend MS user-service
	        )
	        .build();
	}
}
