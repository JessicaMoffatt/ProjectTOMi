package ca.projectTOMi.tomi.model;

import java.util.HashSet;
import java.util.List;
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
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Data;
import org.hibernate.annotations.Formula;

/**
 * A Project represents a project that either needs to be completed, or has been completed
 * (dependent on it's active status.) Projects are worked on by specific {@link UserAccount} lead by
 * a project manager.
 *
 * @author Karol Talbot and Iliya Kiritchkov
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
	@JsonProperty (value = "projectManagerId")
	@JsonIdentityInfo (generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
	@JsonIdentityReference (alwaysAsId = true)
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

	@Formula("budget / billable_rate")
	private Double budgetedHours;
	/**
	 * The Accounts that are members of this Project.
	 */
	@ManyToMany (fetch = FetchType.EAGER, targetEntity = UserAccount.class)
	@JoinTable (name = "project_members", joinColumns = @JoinColumn (name = "project_id"), inverseJoinColumns = @JoinColumn (name = "user_account_id"))
	@JsonIgnore
	private Set<UserAccount> projectMembers;// = new HashSet<>();

	/**
	 * If this Project is active.
	 */
	@JsonIgnore
	@Column (nullable = false)
	private boolean active;

  @JsonProperty
  public void setProjectManagerId(final Long id){
    UserAccount projectManager = null;
    if(id != -1){
      projectManager = new UserAccount();
      projectManager.setId(id);
    }
    this.projectManager = projectManager;
  }

  @Override
  public boolean equals(final Object obj){
    if(obj.getClass() != this.getClass()){
      return false;
    }else{
      return this.getId().equals(((Project)obj).getId());
    }
  }

  @Override
  public int hashCode(){
    return this.getId().hashCode();
  }
}
