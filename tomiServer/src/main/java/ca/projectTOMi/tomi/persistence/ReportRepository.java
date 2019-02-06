package ca.projectTOMi.tomi.persistence;

import java.time.LocalDate;
import java.util.List;
import javax.persistence.EntityManager;
import ca.projectTOMi.tomi.model.BillableHoursReportLine;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import org.springframework.beans.factory.annotation.Autowired;

public class ReportRepository {
  @Autowired
  private EntityManager entityManager;

  public List<BillableHoursReportLine> generateBillableHoursReport(LocalDate date){
    return entityManager.createQuery("SELECT new BillableHoursReportLine(t.startdate) FROM Entry e, Timesheet t, UserAccount u, Project p  WHERE e.timesheet = t and e.project = p and e.userAccount = u", BillableHoursReportLine.class).getResultList();
  }
}
