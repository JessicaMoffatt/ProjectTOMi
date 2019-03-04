package ca.projectTOMi.tomi.viewModel;

import ca.projectTOMi.tomi.model.Project;
import lombok.Data;

/**
 * @author Karol Talbot
 */
@Data
public class ProjectViewModel {
	private String id;
	private String projectName;


	public ProjectViewModel() {
	}

	public ProjectViewModel(Project project) {
		this.id = project.getId();
		this.projectName = project.getProjectName();
	}
}
