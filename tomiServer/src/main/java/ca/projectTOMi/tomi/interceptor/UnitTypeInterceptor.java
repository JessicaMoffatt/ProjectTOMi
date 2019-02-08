package ca.projectTOMi.tomi.interceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
@Component
@CrossOrigin (origins = "http://localhost:4200")
public class UnitTypeInterceptor implements HandlerInterceptor {
  @Override
  public boolean preHandle(
    HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    System.out.println("Hello, it's bean time!");
    return true;
  }
  @Override
  public void postHandle(
    HttpServletRequest request, HttpServletResponse response, Object handler,
    ModelAndView modelAndView) throws Exception {
//    response.addCookie(new Cookie("Tracking", "We're watching you"));
    System.out.println("now that's what I call pod racing!");

  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                              Object handler, Exception exception) throws Exception {}
}
