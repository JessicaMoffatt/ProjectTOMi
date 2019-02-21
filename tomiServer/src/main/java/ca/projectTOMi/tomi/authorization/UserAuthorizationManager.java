package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.UserAccount;


public final class UserAuthorizationManager implements AuthorizationManager<UserAuthorizationPolicy>{
  private List<UserAuthorizationPolicy> policies;
  private final UserAccount user;

  public UserAuthorizationManager(final UserAccount user){
    this.user = user;
  }

  @Override
  public boolean requestAuthorization(final String URI, final String request) {
    final UserAuthorizationPolicy requestPolicy = new UserAuthorizationPolicy();
    requestPolicy.setRequestingUser(this.user);
    if ("POST".equals(request)) {
      String uriHead = URI.split("/")[1];
      if("projects".matches(uriHead)){
        requestPolicy.setPermission(UserPermission.CREATE_PROJECT);
      }
    }
    return this.policies.contains(requestPolicy);
  }

  @Override
  public boolean linkAuthorization(final String URI, final String request) {
    return false;
  }

  @Override
  public void loadUserPolicies(final List<UserAuthorizationPolicy> policies) {
    this.policies = policies;
  }
}
