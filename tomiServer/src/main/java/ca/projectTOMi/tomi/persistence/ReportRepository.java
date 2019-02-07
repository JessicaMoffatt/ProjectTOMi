package ca.projectTOMi.tomi.persistence;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import ca.projectTOMi.tomi.model.BillableHoursReportLine;
import ca.projectTOMi.tomi.model.BudgetReport;
import ca.projectTOMi.tomi.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public class ReportRepository {
  @Autowired
  private EntityManager entityManager;

  public List<BillableHoursReportLine> generateBillableHoursReport(){
    return entityManager.createQuery(
      "SELECT new ca.projectTOMi.tomi.model.BillableHoursReportLine(t.startDate, t.userAccount, SUM( CASE WHEN (e.task.billable = true ) then e.totalHours else 0 end), SUM( CASE WHEN (e.task.billable = false ) then e.totalHours else 0 end) , p) FROM Timesheet t JOIN Entry e on t = e.timesheet JOIN Project p ON e.project = p group by t, p").getResultList();
  }

  public BudgetReport generateBudgetReport(Project project){
    Query q = entityManager.createQuery("SELECT new ca.projectTOMi.tomi.model.BudgetReport( SUM( t.totalHours), SUM(e.amount), p) FROM Project p JOIN Expense e ON e.project = p JOIN Entry t ON t.project = p where p = :project group by p", BudgetReport.class);
    return (BudgetReport) q.setParameter("project", project).getSingleResult();
  }
}
