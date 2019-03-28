package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

/**
 * @author Karol Talbot
 */
@Data
public class BillableHoursReportLine {
	private double billableHours;
	private double nonbillableHours;
	private Project project;

	public BillableHoursReportLine(final double billableHours, final double nonbillableHours, final Project project) {
		this.billableHours = billableHours;
		this.nonbillableHours = nonbillableHours;
		this.project = project;
	}
}
