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
 * Class representing a single timesheet for a user for a specific week.  Entries (task ,client,
 * hours) on the timesheet are attached by referencing it.
 *
 * @author James Andrade
 * @author Karol Talbot
 * @version 1.1
 */
@Data
@Entity (name = "Timesheet")
public final class Timesheet {

	/*
	 * The unique id of this timesheet
	 */
	@Id
	@GeneratedValue (generator = "timesheet_sequence")
	@SequenceGenerator (
		name = "timesheet_sequence",
		sequenceName = "timesheet_sequence",
		allocationSize = 1
	)
	private Long id;


	/*
	 * The userAccount of the user that this timesheet belongs to
	 */
	@ManyToOne
	@MapKeyColumn (name = "id")
	private UserAccount userAccount;

	/*
	 * The submission status of this timesheet, one of: logging, submitted, approved, rejected
	 */
	@Enumerated
	private Status status;

	/*
	 * The day of the week that this timesheet begins on
	 */
	@JsonIgnore
	private LocalDate startDate;

	/*
	 * The date that this timesheet was submitted.
	 */
	@JsonIgnore
	private LocalDate submitDate;

	/**
	 * If this timesheet is active.
	 */
	@JsonIgnore
	@NotNull
	private boolean active;

	/**
	 * Converts this Timesheet's start date to a string when converting this Timesheet to JSON.
	 *
	 * @return String representing this Timesheet's start date.
	 */
	@JsonProperty (value = "startDate")
	public String getStartDate() {
		return this.startDate == null ? "" : this.startDate.toString();
	}

	/**
	 * Sets this Timesheet's submit date using a String.
	 *
	 * @param date
	 * 	the date to set this Timesheet's submit date to
	 */
	public void setSubmitDate(final String date) {
		this.submitDate = LocalDate.parse(date);
	}
}
