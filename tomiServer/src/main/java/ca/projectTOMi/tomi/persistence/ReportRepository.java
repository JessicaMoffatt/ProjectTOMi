package ca.projectTOMi.tomi.persistence;

import java.util.List;
import javax.persistence.EntityManager;
import ca.projectTOMi.tomi.model.BillableHoursReportLine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ReportRepository {
  @Autowired
  private EntityManager entityManager;

  public List<BillableHoursReportLine> generateBillableHoursReport(){
    return entityManager.createQuery(
      "SELECT new ca.projectTOMi.tomi.model.BillableHoursReportLine(t.startDate, t.userAccount, SUM( CASE WHEN (e.task.billable = true ) then e.totalHours else 0 end), SUM( CASE WHEN (e.task.billable = false ) then e.totalHours else 0 end) , p) FROM Timesheet t JOIN Entry e on t = e.timesheet JOIN Project p ON e.project = p group by t, p").getResultList();
  }
}
