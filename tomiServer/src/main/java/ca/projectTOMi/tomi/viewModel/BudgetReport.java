package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.Project;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
/**
 * @author Karol Talbot
 */
@Data
public class BudgetReport {
	@JsonIgnore
	private LocalDate date;
	private Long budget;
	private Double billableHours;
	private Double nonBillableHours;
	private Project project;

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

	@JsonProperty ("date")
	public String getDate() {
		return this.date.toString();
	}

	@JsonProperty ("hourCost")
	public Double getHourCost() {
		return this.getTotalHours() * this.project.getBillableRate();
	}

	@JsonProperty ("totalHours")
	public Double getTotalHours() {
		return this.billableHours + this.nonBillableHours;
	}
}
