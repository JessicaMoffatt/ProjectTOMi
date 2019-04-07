package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

/**
 * A model class for holding a single line from a data dump report. This report summarizes
 * productivity and is used with visualization tools to analyse productivity.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class DataDumpReportLine {
	/**
	 * The date the report was run.
	 */
	private LocalDate date;

	/**
	 * The name client for this line.
	 */
	private String clientName;

	/**
	 * The name of the project for this line.
	 */
	private String projectName;

	/**
	 * The unique identifier for the project for this line.
	 */
	private String projectCode;

	/**
	 * The task for this line.
	 */
	private String task;

	/**
	 * The total hours for this line.
	 */
	private Double hours;

	/**
	 * If this line is billable.
	 */
	private boolean billable;

	/**
	 * The first name of the user responsible for this line.
	 */
	private String firstName;

	/**
	 * The last name of the user responsible for this line.
	 */
	private String lastName;

	/**
	 * Creates the report from the provided objects.
	 *
	 * @param date
	 * 	date of the line
	 * @param project
	 * 	Project associated with the line
	 * @param entry
	 * 	Entry associated with the line
	 * @param userAccount
	 * 	UserAccount associated with the line
	 */
	public DataDumpReportLine(final LocalDate date, final Project project, final Entry entry, final UserAccount userAccount) {
		this.date = date;
		this.clientName = project.getClient().getName();
		this.projectName = project.getProjectName();
		this.projectCode = project.getId();
		this.task = entry.getTask() == null ? "N/A" : entry.getTask().getName();
		this.hours = entry.getTotalHours();
		this.billable = entry.getTask() != null && entry.getTask().isBillable();
		this.firstName = userAccount == null ? "" : userAccount.getFirstName();
		this.lastName = userAccount == null ? "" : userAccount.getLastName();
	}
}
