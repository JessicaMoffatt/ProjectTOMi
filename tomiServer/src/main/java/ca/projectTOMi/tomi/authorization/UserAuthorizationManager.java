package ca.projectTOMi.tomi.authorization;

import java.util.List;


public final class UserAuthorizationManager implements AuthorizationManager{
  private List<UserAuthorizationPolicy> policies;

  public UserAuthorizationManager(List<UserAuthorizationPolicy> policies){
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
}
