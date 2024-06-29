package us.ullberg.startpunkt;

import io.micrometer.core.annotation.Timed;
import io.micrometer.core.instrument.MeterRegistry;
import io.quarkus.cache.CacheResult;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collections;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import us.ullberg.startpunkt.model.Application;
import us.ullberg.startpunkt.model.Application.ApplicationComparator;
import us.ullberg.startpunkt.model.ApplicationGroup;

@Path("/api/apps")
@Produces(MediaType.APPLICATION_JSON)
public class ApplicationResource {
  @Inject ApplicationService ApplicationService;

  @Inject MeterRegistry registry;

  @ConfigProperty(name = "startpunkt.hajimari.enabled")
  private boolean hajimariEnabled = true;

  @ConfigProperty(name = "startpunkt.openshift.enabled")
  private boolean openshiftEnabled = true;

  private ArrayList<Application> retrieveApps() {
    // Create a list of applications
    var apps = new ArrayList<Application>();

    // If startpunkt.hajimari is set to true, get the Hajimari applications
    if (hajimariEnabled) apps.addAll(ApplicationService.retrieveHajimariApplications());

    // If startpunkt.openshift is set to true, get the OpenShift Route applications
    if (openshiftEnabled) apps.addAll(ApplicationService.retrieveRoutesApplications());

    // Sort the list
    Collections.sort(apps, new ApplicationComparator());

    // Return the list
    return apps;
  }

  @GET
  @Timed(value = "startpunkt.api.getapps", description = "Get the list of applications")
  @CacheResult(cacheName = "getApps")
  public Response getApps() {
    // Retrieve the list of applications
    ArrayList<Application> applist = retrieveApps();

    // Create a list of groups
    ArrayList<ApplicationGroup> groups = new ArrayList<>();

    // Group the applications by group
    for (Application a : applist) {
      // Find the group
      ApplicationGroup group = null;
      for (ApplicationGroup g : groups) {
        if (g.getName().equals(a.getGroup())) {
          group = g;
          break;
        }
      }

      // If the group doesn't exist, create it
      if (group == null) {
        group = new ApplicationGroup(a.getGroup());
        groups.add(group);
      }

      // Add the application to the group
      group.addApplication(a);
    }

    // Return the list
    return Response.ok(groups).build();
  }
}