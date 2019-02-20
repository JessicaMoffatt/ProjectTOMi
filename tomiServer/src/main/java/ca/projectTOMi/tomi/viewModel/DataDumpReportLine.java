package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

@Data
public class DataDumpReportLine {
	private LocalDate date;
	private String clientName;
	private String projectName;
	private String projectCode;
	private String task;
	private Double hours;
	private boolean billable;
	private String firstName;
	private String lastName;

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
