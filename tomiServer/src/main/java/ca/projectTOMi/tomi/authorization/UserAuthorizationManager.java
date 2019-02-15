package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.UserAccount;


public final class UserAuthorizationManager implements AuthorizationManager<UserAuthorizationPolicy>{
  private List<UserAuthorizationPolicy> policies;
  private final UserAccount user;

  public UserAuthorizationManager(UserAccount user){
    this.user = user;
  }

  @Override
  public boolean requestAuthorization(String URI, String request) {
    return true;
  }

  @Override
  public boolean linkAuthorization(String URI, String request) {
    return false;
  }

  @Override
  public void loadUserPolicies(List<UserAuthorizationPolicy> policies) {
    this.policies = policies;
  }
}
