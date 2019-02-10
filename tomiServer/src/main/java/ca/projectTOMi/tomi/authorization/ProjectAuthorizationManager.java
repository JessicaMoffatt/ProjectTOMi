package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.Project;



public final class ProjectAuthorizationManager implements AuthorizationManager, AuthorizationFilter<Project>{
  private List<ProjectAuthorizationPolicy> policies;

  public ProjectAuthorizationManager(List<ProjectAuthorizationPolicy> policies){
    this.policies = policies;
  }

  @Override
  public boolean requestAuthorization(String URI, String request) {
    System.out.println("Security Time!");
    return true;
  }

  @Override
  public boolean linkAuthorization(String URI, String request) {
    return false;
  }


  @Override
  public List<Project> filterList(List<Project> list) {
    return null;
  }

  @Override
  public Project filterFields(Project toFilter) {
    return null;
  }
}
