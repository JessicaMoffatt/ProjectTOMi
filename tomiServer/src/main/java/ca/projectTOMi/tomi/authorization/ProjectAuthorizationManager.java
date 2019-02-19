package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;


public final class ProjectAuthorizationManager implements AuthorizationManager<ProjectAuthorizationPolicy>, AuthorizationFilter<Project> {
  private List<ProjectAuthorizationPolicy> policies;
  private final UserAccount user;

  public ProjectAuthorizationManager(final UserAccount user) {
    this.user = user;
  }

  @Override
  public boolean requestAuthorization(final String URI, final String request) {
    final ProjectAuthorizationPolicy requestPolicy = new ProjectAuthorizationPolicy();
    requestPolicy.setRequestingUser(this.user);
    final Project requestProject;
    if (request.equals("POST")) {
      if (URI.split("/")[1].equals("projects")) {
        requestPolicy.setPermission(ProjectPermission.CREATE);

        requestProject = new Project();
        requestProject.setId("CREATE");
        requestPolicy.setProject(requestProject);
      } else {
        requestPolicy.setPermission(ProjectPermission.CREATE_EXPENSE);
        requestProject = new Project();
        requestProject.setId(URI.split("/")[2]);
        requestPolicy.setProject(requestProject);
      }
    } else if (request.equals("PUT") || request.equals("DELETE")) {
      requestPolicy.setPermission(ProjectPermission.WRITE);
      requestProject = new Project();
      requestProject.setId(URI.split("/")[2]);
      requestPolicy.setProject(requestProject);
    } else if (request.equals("GET")) {
      requestPolicy.setPermission(ProjectPermission.READ);
      requestProject = new Project();
      try {
        requestProject.setId(URI.split("/")[2]);
        requestPolicy.setProject(requestProject);
      } catch (final IndexOutOfBoundsException e) {
        return true;
      }
    }
    return this.policies.contains(requestPolicy);
  }

  @Override
  public boolean linkAuthorization(final String URI, final String request) {
    return false;
  }

  @Override
  public void loadUserPolicies(final List<ProjectAuthorizationPolicy> policies) {
    this.policies = policies;
  }


  @Override
  public List<Project> filterList(final List<Project> list) {
    return null;
  }

  @Override
  public Project filterFields(final Project toFilter) {
    return null;
  }
}
