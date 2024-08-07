package us.ullberg.startpunkt.health;

import org.eclipse.microprofile.health.HealthCheck;
import org.eclipse.microprofile.health.HealthCheckResponse;
import org.eclipse.microprofile.health.Liveness;

import us.ullberg.startpunkt.rest.BookmarkResource;

/**
 * {@link HealthCheck} to ping the Bookmark service
 */
@Liveness
public class PingBookmarkResourceHealthCheck implements HealthCheck {
  private final BookmarkResource bookmarkResource;

  public PingBookmarkResourceHealthCheck(BookmarkResource bookmarkResource) {
    this.bookmarkResource = bookmarkResource;
  }

  @Override
  public HealthCheckResponse call() {
    var response = this.bookmarkResource.ping();

    return HealthCheckResponse.named("Ping Bookmark REST Endpoint").withData("Response", response)
        .up().build();
  }
}
