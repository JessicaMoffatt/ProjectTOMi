package ca.projectTOMi.tomi.viewModel;

import ca.projectTOMi.tomi.model.Project;
import lombok.Data;

/**
 * A single line from a Report to quickly analyse projects based on time spent on billable tasks.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class BillableHoursReportLine {
	/**
	 * The number of hours spent on billable tasks.
	 */
	private double billableHours;

	/**
	 * The number of hours spent on non billable tasks.
	 */
	private double nonbillableHours;

	/**
	 * The project being analysed.
	 */
	private Project project;

	/**
	 * Creates a new BillableHoursReportLine.
	 *
	 * @param billableHours
	 * 	Number of billable hours for the project
	 * @param nonbillableHours
	 * 	Number of non billable hours for the project
	 * @param project
	 * 	The project associated with the line
	 */
	public BillableHoursReportLine(final double billableHours, final double nonbillableHours, final Project project) {
		this.billableHours = billableHours;
		this.nonbillableHours = nonbillableHours;
		this.project = project;
	}
}
