package ca.projectTOMi.tomi.authorization.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author Karol Talbot
 */
@Component
public class TOMiInterceptorAppConfig implements WebMvcConfigurer {
	private final AuthorizationInterceptor authorizationInterceptor;

	@Autowired
	public TOMiInterceptorAppConfig(final AuthorizationInterceptor authorizationInterceptor) {
		this.authorizationInterceptor = authorizationInterceptor;
	}

	@Override
	public void addInterceptors(final InterceptorRegistry registry) {
		registry.addInterceptor(this.authorizationInterceptor);
	}
}