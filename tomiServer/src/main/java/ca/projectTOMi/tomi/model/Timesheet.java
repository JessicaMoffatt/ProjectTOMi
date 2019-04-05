package ca.projectTOMi.tomi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import lombok.Data;

/**
 * class representing a single timesheet for a user for a specific week.  Entries (task ,client,
 * hours) on the timesheet are attached by referencing it.
 *
 * @author James Andrade
 * @author Karol Talbot
 * @version 1.1
 */


@Data
@Entity (name = "Timesheet")
public final class Timesheet {
	@Id
	@GeneratedValue (generator = "timesheet_sequence")
	@SequenceGenerator (
		name = "timesheet_sequence",
		sequenceName = "timesheet_sequence",
		allocationSize = 1
	)
	/*
	 * the unique id of the timesheet
	 */
	private Long id;


	/*
	 * The userAccount of the user that the timesheet belongs to
	 */
	@ManyToOne
	@MapKeyColumn (name = "id")
	private UserAccount userAccount;

	/*
	 * the submission status of the timesheet, one of: logging, submitted, approved, rejected
	 */
	@Enumerated
	private Status status;

	/*
	 * the day of the week that the timesheet begins on
	 */
	@JsonIgnore
	private LocalDate startDate;

	/*
	 * the date that the timesheet was submitted.
	 */
	@JsonIgnore
	private LocalDate submitDate;

	/**
	 * if the timesheet is active.
	 */
	@JsonIgnore
	@NotNull
	private boolean active;

	@JsonProperty (value = "startDate")
	public String getStartDate() {
		return this.startDate == null ? "" : this.startDate.toString();
	}

	public void setSubmitDate(final String date) {
		this.submitDate = LocalDate.parse(date);
	}
}
