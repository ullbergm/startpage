package us.ullberg.startpunkt;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.net.HttpURLConnection;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.fabric8.kubernetes.api.model.ObjectMetaBuilder;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.Resource;
import io.fabric8.kubernetes.client.dsl.base.CustomResourceDefinitionContext;
import io.fabric8.kubernetes.client.server.mock.KubernetesServer;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.kubernetes.client.KubernetesTestServer;
import io.quarkus.test.kubernetes.client.WithKubernetesTestServer;
import jakarta.inject.Inject;
import us.ullberg.startpunkt.crd.Bookmark;
import us.ullberg.startpunkt.crd.BookmarkSpec;

// Mark this class as a Quarkus test
@QuarkusTest
// Enable Kubernetes mock server for testing
@WithKubernetesTestServer
class BookmarkResourceTest {
  // Define the type of the custom resource
  private static final Class<Bookmark> RESOURCE_TYPE = Bookmark.class;

  // Inject the Kubernetes mock server
  @KubernetesTestServer
  KubernetesServer server;

  // Inject the Kubernetes client
  @Inject
  KubernetesClient client;

  // Setup method to initialize the test environment before each test
  @BeforeEach
  public void before() {

    // Create a CustomResourceDefinition (CRD) for the Bookmark resource
    CustomResourceDefinition crd =
        CustomResourceDefinitionContext.v1CRDFromCustomResourceType(Bookmark.class).build();

    // Set up the mock server to expect a POST request for creating the CRD
    server.expect().post().withPath("/apis/apiextensions.k8s.io/v1/customresourcedefinitions")
        .andReturn(HttpURLConnection.HTTP_OK, crd).once();

    // Create the CRD in the mock Kubernetes cluster
    CustomResourceDefinition createdBookmarkCrd =
        client.apiextensions().v1().customResourceDefinitions().resource(crd).create();

    // Verify that the CRD was created
    assertNotNull(createdBookmarkCrd);

    // Create a new BookmarkSpec for the Makerworld bookmark
    BookmarkSpec makerworldSpec = new BookmarkSpec();
    makerworldSpec.setName("Makerworld");
    makerworldSpec.setGroup("3D Printing");
    makerworldSpec.setIcon("simple-icons:makerworld");
    makerworldSpec.setUrl("https://makerworld.com");

    // Create a new Bookmark resource using the BookmarkSpec
    Bookmark makerworld = new Bookmark();
    makerworld.setMetadata(new ObjectMetaBuilder().withName("makerworld").build());
    makerworld.setSpec(makerworldSpec);

    // Create or replace the Makerworld bookmark resource in the default namespace
    createOrReplace("default", makerworld);

    // Create a new BookmarkSpec for the Printables bookmark
    BookmarkSpec printablesSpec = new BookmarkSpec();
    printablesSpec.setName("Printables");
    printablesSpec.setGroup("3D Printing");
    printablesSpec.setIcon("simple-icons:printables");
    printablesSpec.setUrl("https://printables.com");
    printablesSpec.setLocation(1);

    // Create a new Bookmark resource using the BookmarkSpec
    Bookmark printables = new Bookmark();
    printables.setMetadata(new ObjectMetaBuilder().withName("printables").build());
    printables.setSpec(printablesSpec);

    // Create or replace the Printables bookmark resource in the default namespace
    createOrReplace("default", printables);

    // Create a new BookmarkSpec for the Quarkus bookmark
    BookmarkSpec quarkusSpec = new BookmarkSpec();
    quarkusSpec.setName("Quarkus");
    quarkusSpec.setGroup("Development");
    quarkusSpec.setIcon("simple-icons:quarkus");
    quarkusSpec.setUrl("https://quarkus.io");

    // Create a new Bookmark resource using the BookmarkSpec
    Bookmark quarkus = new Bookmark();
    quarkus.setMetadata(new ObjectMetaBuilder().withName("quarkus").build());
    quarkus.setSpec(quarkusSpec);

    // Create or replace the Quarkus bookmark resource in the default namespace
    createOrReplace("default", quarkus);
  }

  // Method to create or replace a custom resource in the specified namespace
  private void createOrReplace(String namespace, Bookmark object) {
    Resource<Bookmark> resource =
        client.resources(RESOURCE_TYPE).inNamespace(namespace).resource(object);

    // Check if the resource already exists
    if (resource.get() != null) {
      // Replace the existing resource
      resource.update();
    } else {
      // Create the new resource
      resource.create();
    }
  }

  // Test to verify that the bookmarks API endpoint is accessible
  @Test
  void testBookmarkApiEndpoint() {
    given().when().get("/api/bookmarks").then().log().all().statusCode(200);
  }

  // Test to verify that the list of bookmarks contains exactly two groups
  @Test
  void testGroupListSize() {
    given().when().get("/api/bookmarks").then().body("groups.size()", equalTo(2));
  }

  // Test to verify that the groups are in the right order
  @Test
  void testGroupOrder() {
    given().when().get("/api/bookmarks").then().body("groups[0].name", equalTo("3d printing"))
        .body("groups[1].name", equalTo("development"));
  }

  // Test to verify that the number of bookmarks in the two groups are correct
  @Test
  void testBookmarkCount() {
    given().when().get("/api/bookmarks").then().body("groups[0].bookmarks.size()", equalTo(2))
        .body("groups[1].bookmarks.size()", equalTo(1));
  }

  // Test to verify that all the bookmarks are present and the values are correct
  @Test
  void testBookmarkValues() {
    given().when().get("/api/bookmarks").then()
        .body("groups[0].bookmarks[0].name", equalTo("Printables"))
        .body("groups[0].bookmarks[0].url", equalTo("https://printables.com"))
        .body("groups[0].bookmarks[0].icon", equalTo("simple-icons:printables"))

        .body("groups[0].bookmarks[1].name", equalTo("Makerworld"))
        .body("groups[0].bookmarks[1].url", equalTo("https://makerworld.com"))
        .body("groups[0].bookmarks[1].icon", equalTo("simple-icons:makerworld"))

        .body("groups[1].bookmarks[0].name", equalTo("Quarkus"))
        .body("groups[1].bookmarks[0].url", equalTo("https://quarkus.io"))
        .body("groups[1].bookmarks[0].icon", equalTo("simple-icons:quarkus"));
  }
}
