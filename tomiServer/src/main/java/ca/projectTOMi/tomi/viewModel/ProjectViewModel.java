package ca.projectTOMi.tomi.viewModel;

import ca.projectTOMi.tomi.model.Project;
import lombok.Data;

/**
 * Provides a means to reference a {@link Project} without most of the information required for a
 * project.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class ProjectViewModel {
	/**
	 * The unique identifier for the project.
	 */
	private String id;

	/**
	 * The name of the project.
	 */
	private String projectName;

	/**
	 * Creates a ProjectViewModel from an existing project.
	 *
	 * @param project
	 * 	the project to be modeled by this ProjectViewModel
	 */
	public ProjectViewModel(Project project) {
		this.id = project.getId();
		this.projectName = project.getProjectName();
	}
}
