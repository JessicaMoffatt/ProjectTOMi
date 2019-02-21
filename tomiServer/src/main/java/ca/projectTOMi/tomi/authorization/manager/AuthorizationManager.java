package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;
import ca.projectTOMi.tomi.model.UserAccount;
public interface AuthorizationManager<E>{
  boolean requestAuthorization(String URI, String requestMethod);
  boolean linkAuthorization(String URI, String request);
  void loadUserPolicies(List<E> policies);
}
