package ca.projectTOMi.tomi;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Initializes the servlet for handling requests send to the server.
 *
 * @author Karol Talbot
 * @version 1
 */
public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
		return application.sources(TomiApplication.class);
	}

}

