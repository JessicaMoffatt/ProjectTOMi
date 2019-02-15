package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.UserAccount;
public interface AuthorizationManager<E>{
  public boolean requestAuthorization(String URI, String requestMethod);
  public boolean linkAuthorization(String URI, String request);
  public void loadUserPolicies(List<E> policies);
}
