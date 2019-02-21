package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.UserAccount;


public final class TimesheetAuthorizationManager implements AuthorizationManager<TimesheetAuthorizationPolicy>, AuthorizationFilter<Entry> {
  private List<TimesheetAuthorizationPolicy> policies;
  private final UserAccount user;

  public TimesheetAuthorizationManager(final UserAccount user){
    this.user = user;
  }

  @Override
  public boolean requestAuthorization(final String URI, final String request) {
    return true;
  }

  @Override
  public boolean linkAuthorization(final String URI, final String request) {
    return false;
  }

  @Override
  public void loadUserPolicies(final List<TimesheetAuthorizationPolicy> policies) {
    this.policies = policies;
  }

  @Override
  public List<Entry> filterList(final List<Entry> list) {
    return null;
  }

  @Override
  public Entry filterFields(final Entry toFilter) {
    return null;
  }
}
