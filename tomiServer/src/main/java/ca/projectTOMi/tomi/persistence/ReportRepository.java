package ca.projectTOMi.tomi.persistence;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import ca.projectTOMi.tomi.viewModel.BillableHoursReportLine;
import ca.projectTOMi.tomi.viewModel.BudgetReport;
import ca.projectTOMi.tomi.viewModel.DataDumpReportLine;
import ca.projectTOMi.tomi.viewModel.ProductivityReportLine;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
/**
 * The ReportRepository is responsible for generating report view model objects from the database.
 *
 * @author Karol Talbot
 */
@Repository
public class ReportRepository {
	/**
	 * The EntityManager responsible for persisting objects to the database.
	 */
	private final EntityManager entityManager;

	/**
	 * Creates a new ReportRepository object with the provided EntityManager.
	 *
	 * @param entityManager
	 * 	EntityManager responsible for persisting objects to the database
	 */
	@Autowired
	public ReportRepository(final EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	/**
	 * Generates a billable hours report from the database.
	 *
	 * @return BillableHoursReport generated for all Projects
	 */
	public List<BillableHoursReportLine> generateBillableHoursReport() {
		return this.entityManager.createQuery(
			"SELECT NEW " +
				"ca.projectTOMi.tomi.viewModel.BillableHoursReportLine(" +
				"SUM( CASE WHEN (e.task.billable = true ) THEN e.totalHours ELSE 0 END), " +
				"SUM( CASE WHEN (e.task.billable = false ) THEN e.totalHours ELSE 0 END) , p) " +
				"FROM Timesheet t " +
				"JOIN Entry e ON t = e.timesheet " +
				"JOIN Project p ON e.project = p " +
				"GROUP BY p")
			.getResultList();
	}

	/**
	 * Generates a budget report from the database for the provided Project.
	 *
	 * @param project
	 * 	the Project to generate the report for
	 *
	 * @return BudgetReport for the provided Project
	 */
	public BudgetReport generateBudgetReport(final Project project) {
		final Query q = this.entityManager.createQuery(
			"SELECT NEW ca.projectTOMi.tomi.viewModel.BudgetReport(p as project) " +
				"FROM Project p " +
				"WHERE p = :project " +
				"GROUP BY p", BudgetReport.class);

		return (BudgetReport) q.setParameter("project", project).getSingleResult();
	}

	/**
	 * Generates a productivity report from the database for the provided UserAccount.
	 *
	 * @param userAccount
	 * 	The UserAccount to generate a report for
	 *
	 * @return List containing ProductivityReportLines generated for the provided UserAccount
	 */
	public List<ProductivityReportLine> generateProductivityReport(final UserAccount userAccount) {
		final Query q = this.entityManager.createQuery(
			"SELECT NEW ca.projectTOMi.tomi.viewModel.ProductivityReportLine(t.startDate, t.userAccount, u, " +
				"SUM(CASE WHEN (e.totalHours IS NULL) THEN 0.0 ELSE e.totalHours END), " +
				"SUM(CASE WHEN (e.quantity IS NULL) THEN 0.0 ELSE e.quantity END)) " +
				"FROM Entry e " +
				"JOIN Timesheet t ON e.timesheet = t " +
				"JOIN UnitType u ON e.unitType = u " +
				"WHERE t.userAccount = :userAccount " +
				"GROUP BY t, u ", ProductivityReportLine.class);

		return q.setParameter("userAccount", userAccount).getResultList();
	}

	/**
	 * Generates a data dump report from the database.
	 *
	 * @return List of DataDumpReportLines
	 */
	public List<DataDumpReportLine> generateDataDumpReport() {
		return this.entityManager.createQuery(
			"SELECT NEW ca.projectTOMi.tomi.viewModel.DataDumpReportLine(t.startDate, e.project, e, t.userAccount) " +
				"FROM Timesheet t " +
				"JOIN Entry e ON e.timesheet = t ",
			DataDumpReportLine.class)
			.getResultList();
	}
}
