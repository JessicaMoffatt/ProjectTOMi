package ca.projectTOMi.tomi.model;

import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToOne;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.hibernate.annotations.Formula;

/**
 * A Project represents a project that either needs to be completed, or has been completed
 * (dependent on it's active status.) Projects are worked on by specific {@link UserAccount} lead by
 * a project manager.
 *
 * @author Karol Talbot
 * @author Iliya Kiritchkov
 * @version 1.2
 */
@Entity
@Data
public final class Project {
	/**
	 * The unique identifier for this Project.
	 */
	@Id
	@Column (nullable = false)
	private String id;

	/**
	 * The Client this Project is for.
	 */
	@ManyToOne
	@MapKeyColumn (name = "id")
	private Client client;

	/**
	 * The UserAccount managing this Project.
	 */
	@OneToOne
	@JsonIgnore
	private UserAccount projectManager;

	/**
	 * The name of this Project
	 */
	@NotBlank
	private String projectName;

	/**
	 * The budget assigned to this Project multiplied by 100 to remove decimals.
	 */
	@Min (0)
	private Long budget;

	/**
	 * The rate at which this Project members' billable hours will be billed to the client at
	 * multiplied by 100 to remove decimals.
	 */
	@Min (0)
	private Long billableRate;

	/**
	 * The total hours available to this Project based on its budget and billable rate.
	 */
	@Formula ("budget / billable_rate")
	private Double budgetedHours;

	/**
	 * The Accounts that are members of this Project.
	 */
	@ManyToMany (fetch = FetchType.EAGER, targetEntity = UserAccount.class)
	@JoinTable (name = "project_members", joinColumns = @JoinColumn (name = "project_id"), inverseJoinColumns = @JoinColumn (name = "user_account_id"))
	@JsonIgnore
	private Set<UserAccount> projectMembers;

	/**
	 * If this Project is active.
	 */
	@JsonIgnore
	@Column (nullable = false)
	private boolean active;

	/**
	 * Converts this Project's project manager into an id to prevent circular references when
	 * converted into JSON.
	 *
	 * @return Long representing the unique identifier for the project manager
	 */
	@JsonProperty ("projectManagerId")
	public Long getProjectMangerId() {
		if (this.projectManager == null) {
			return -1L;
		} else {
			return this.projectManager.getId();
		}
	}

	/**
	 * Sets this Project's project manager using their id when converted from JSON.
	 *
	 * @param id Long representing the id of this Project's project manager
	 */
	@JsonProperty
	public void setProjectManagerId(final Long id) {
		UserAccount projectManager = null;
		if (id != -1) {
			projectManager = new UserAccount();
			projectManager.setId(id);
		}
		this.projectManager = projectManager;
	}

	@Override
	public int hashCode() {
		return this.getId().hashCode();
	}

	@Override
	public boolean equals(final Object obj) {
		if (obj.getClass() != this.getClass()) {
			return false;
		} else {
			return this.getId().equals(((Project) obj).getId());
		}
	}
}
