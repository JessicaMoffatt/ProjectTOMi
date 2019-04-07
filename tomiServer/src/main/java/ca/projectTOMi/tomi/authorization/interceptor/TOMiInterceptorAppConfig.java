package ca.projectTOMi.tomi.authorization.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Sets up the authorization interceptor and registers it with the application to allow it to
 * intercept incoming HTTP requests to the server.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public class TOMiInterceptorAppConfig implements WebMvcConfigurer {
	/**
	 * Checks the requesting user's permission to perform the request.
	 */
	private final AuthorizationInterceptor authorizationInterceptor;

	/**
	 * Creates a new TOMiInterceptorAppConfig with the provided parameters.
	 *
	 * @param authorizationInterceptor
	 * 	Checks user permissions before performing a request
	 */
	@Autowired
	public TOMiInterceptorAppConfig(final AuthorizationInterceptor authorizationInterceptor) {
		this.authorizationInterceptor = authorizationInterceptor;
	}

	/**
	 * Adds the authorizationInterceptor to the interceptor registry to allow it to intercept incoming
	 * requests to this server.
	 *
	 * @param registry
	 * 	Registry of interceptors for the application
	 */
	@Override
	public void addInterceptors(final InterceptorRegistry registry) {
		registry.addInterceptor(this.authorizationInterceptor);
	}
}