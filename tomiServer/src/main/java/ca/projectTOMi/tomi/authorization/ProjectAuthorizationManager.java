package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;


public final class ProjectAuthorizationManager implements AuthorizationManager<ProjectAuthorizationPolicy>, AuthorizationFilter<Project>{
  private List<ProjectAuthorizationPolicy> policies;
  private final UserAccount user;

  public ProjectAuthorizationManager(UserAccount user){
    this.user = user;
  };

  @Override
  public boolean requestAuthorization(String URI, String request) {
    ProjectPermission requestPerm = null;
    Project requestProject = null;
    if(request.equals("POST")){
      if(URI.split("/")[1].equals("projects")){
        requestPerm = ProjectPermission.CREATE;
        requestProject = new Project();
        requestProject.setId("CREATE");
      }else{
        requestPerm = ProjectPermission.CREATE_EXPENSE;
        requestProject = new Project();
        requestProject.setId(URI.split("/")[2]);
      }
    }else if(request.equals("PUT") || request.equals("DELETE")){
      requestPerm = ProjectPermission.WRITE;
    }else if(request.equals("GET")){
      requestPerm = ProjectPermission.READ;
    }
    System.out.println(requestPerm);
    System.out.println(requestProject);
    ProjectAuthorizationPolicy requestPolicy = new ProjectAuthorizationPolicy();
    requestPolicy.setPermission(requestPerm);
    requestPolicy.setRequestingUser(user);
    requestPolicy.setProject(requestProject);
    return this.policies.contains(requestPolicy);
  }

  @Override
  public boolean linkAuthorization(String URI, String request) {
    return false;
  }

  @Override
  public void loadUserPolicies(List<ProjectAuthorizationPolicy> policies) {
    this.policies = policies;
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
