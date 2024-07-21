package us.ullberg.startpunkt;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.anything;
import static org.hamcrest.Matchers.equalTo;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.ws.rs.core.MediaType;

@QuarkusTest
class ConfigResourceTest {

  // Existing test method
  @Test
  void testGetConfigEndpoint() {
    given().when().get("/api/config").then().statusCode(200).contentType(MediaType.APPLICATION_JSON)
        .body("config.version", anything()).body("config.web.showGithubLink", equalTo(true))
        .body("config.web.checkForUpdates", equalTo(true))
        .body("config.web.title", equalTo("Startpunkt"));
  }
}
