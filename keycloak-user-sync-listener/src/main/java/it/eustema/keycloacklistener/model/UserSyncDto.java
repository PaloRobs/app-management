package it.eustema.keycloacklistener.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSyncDto {
    
    @JsonProperty("keycloakId")
    private String keycloakId;
    
    @JsonProperty("username")
    private String username;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("firstName")
    private String firstName;
    
    @JsonProperty("lastName")
    private String lastName;
    
    @JsonProperty("emailVerified")
    private Boolean emailVerified;
    
    @JsonProperty("enabled")
    private Boolean enabled;
    
    @JsonProperty("operation")
    @Builder.Default
    private String operation = "CREATE_OR_UPDATE";
}

