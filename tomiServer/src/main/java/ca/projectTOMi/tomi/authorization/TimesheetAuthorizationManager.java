package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.UserAccount;


public final class TimesheetAuthorizationManager implements AuthorizationManager<TimesheetAuthorizationPolicy>, AuthorizationFilter<Entry>{
  private List<TimesheetAuthorizationPolicy> policies;
  private final UserAccount user;

  public TimesheetAuthorizationManager(UserAccount user){
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
  public void loadUserPolicies(List<TimesheetAuthorizationPolicy> policies) {
    this.policies = policies;
  }

  @Override
  public List<Entry> filterList(List<Entry> list) {
    return null;
  }

  @Override
  public Entry filterFields(Entry toFilter) {
    return null;
  }
}
