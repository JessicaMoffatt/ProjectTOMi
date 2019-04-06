package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.Project;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
/**
 * A Report that contains information regarding a projects budget.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class BudgetReport {

	/**
	 * The date the report was generated.
	 */
	@JsonIgnore
	private LocalDate date;

	/**
	 * The total dollar amount to be spent on the project.
	 */
	private Long budget;

	/**
	 * The total amount of billable hours spent on the project.
	 */
	private Double billableHours;

	/**
	 * The total amount of non billable hours spent on the project.
	 */
	private Double nonBillableHours;

	/**
	 * The project for this report.
	 */
	private Project project;

	/**
	 * Creates a BudgetReport for a project without any hours allocated.
	 *
	 * @param project
	 * 	The project to generate the report for
	 */
	public BudgetReport(final Project project) {
		this.date = LocalDate.now();
		this.budget = project.getBudget();
		this.billableHours = 0.0;
		this.nonBillableHours = 0.0;
		this.project = project;
	}

	public BudgetReport(final Double billableHours, final Double nonBillableHours, final Project project) {
		this.date = LocalDate.now();
		this.budget = project.getBudget();
		this.billableHours = billableHours;
		this.nonBillableHours = nonBillableHours;
		this.project = project;
	}

	/**
	 * Converts the date of this report into a String.
	 *
	 * @return the date of the report as a string.
	 */
	@JsonProperty ("date")
	public String getDate() {
		return this.date.toString();
	}

	/**
	 * Calculates the total cost of the Project by multiplying the total hours by the billable rate.
	 *
	 * @return The total cost in hours.
	 */
	@JsonProperty ("hourCost")
	public Double getHourCost() {
		return this.getTotalHours() * this.project.getBillableRate();
	}

	/**
	 * Calculates the total hours by combining the billable hours and the nonbillable hours.
	 *
	 * @return Total hours spent on the project
	 */
	@JsonProperty ("totalHours")
	public Double getTotalHours() {
		return this.billableHours + this.nonBillableHours;
	}
}
