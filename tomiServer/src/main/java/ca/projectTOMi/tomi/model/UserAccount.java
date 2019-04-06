package ca.projectTOMi.tomi.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * A model class that contains information about accounts in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Entity
@Data
public final class UserAccount {

	/**
	 * The unique identifier for this UserAccount. Used to distinguish between Accounts.
	 */
	@Id
	@GeneratedValue (generator = "user_account_sequence")
	@SequenceGenerator (
		name = "user_account_sequence",
		sequenceName = "user_account_sequence",
		allocationSize = 1
	)
	private Long id;

	/**
	 * The team this UserAccount is a member of.
	 */
	@ManyToOne
	@OnDelete (action = OnDeleteAction.NO_ACTION)
	@JsonIgnore
	private Team team;

	/**
	 * This UserAccount holder's first name.
	 */
	@NotBlank
	private String firstName;

	/**
	 * This UserAccount holder's last name.
	 */
	@NotBlank
	private String lastName;

	/**
	 * The email address for this UserAccount.
	 */
	@NotBlank
	@Column (unique = true)
	private String email;

	/**
	 * The projects this UserAccount is assigned to.
	 */
	@ManyToMany (mappedBy = "projectMembers", targetEntity = Project.class)
	@JsonIgnore
	private Set<Project> projects = new HashSet<>();

	/**
	 * If this UserAccount is active.
	 */
	@JsonIgnore
	@NotNull
	private boolean active;

	/**
	 * If this UserAccount is a program director.
	 */
	@ColumnDefault ("false")
	private boolean programDirector;

	/**
	 * If this UserAccount is an admin.
	 */
	@ColumnDefault ("false")
	private boolean admin;

	/**
	 * The google id associated with this UserAccount.
	 */
	@JsonIgnore
	private String googleId;

	/**
	 * Sets this UserAccount's team to the team with the provided id.
	 *
	 * @param id
	 * 	Long representing the unique identifier for the team to add this UserAccount to
	 */
	@JsonProperty ("teamId")
	public void setTeamId(final Long id) {
		Team team = null;
		if (id != -1) {
			team = new Team();
			team.setId(id);
		}
		this.setTeam(team);
	}

	/**
	 * Gets the unique identifier for the team this UserAccount belongs to.
	 *
	 * @return Long representing the Team this UserAccount belongs to
	 */
	@JsonProperty ("teamId")
	public Long getTeamId() {
		if (this.team == null) {
			return -1L;
		}
		return this.team.getId();
	}

	@Override
	public int hashCode() {
		return this.id.intValue();
	}

	@Override
	public boolean equals(final Object obj) {
		if (obj.getClass() != this.getClass()) {
			return false;
		} else {
			return this.getId().equals(((UserAccount) obj).getId());
		}
	}

	@Override
	public String toString() {
		return this.firstName + " " + this.lastName;
	}
}
