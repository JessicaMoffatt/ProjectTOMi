package ca.projectTOMi.tomi.authorization;

import java.util.List;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.Timesheet;


public final class TimesheetAuthorizationManager implements AuthorizationManager, AuthorizationFilter<Entry>{
  private List<TimesheetAuthorizationPolicy> policies;

  public TimesheetAuthorizationManager(List<TimesheetAuthorizationPolicy> policies){
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
  public List<Entry> filterList(List<Entry> list) {
    return null;
  }

  @Override
  public Entry filterFields(Entry toFilter) {
    return null;
  }
}
