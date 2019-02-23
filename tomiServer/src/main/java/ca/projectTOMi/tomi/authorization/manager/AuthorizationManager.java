package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;
import ca.projectTOMi.tomi.model.UserAccount;
public interface AuthorizationManager<E>{
  boolean requestAuthorization(String uri, String requestMethod);
  boolean linkAuthorization(String url, String request);
  void loadUserPolicies(List<E> policies);
}
