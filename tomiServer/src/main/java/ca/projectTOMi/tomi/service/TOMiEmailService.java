package ca.projectTOMi.tomi.service;

import java.util.Objects;
import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

@Service
public class TOMiEmailService {
	@Value ("${spring.mail.username}")
	private String emailAddress;
	@Value ("${spring.mail.password}")
	private String emailPass;
	private JavaMailSender emailSender = this.getJavaMailSender();

	public void sendSimpleMessage(
		final String to, final String subject, final String text) {
		if (!Objects.equals(((JavaMailSenderImpl) this.emailSender).getUsername(), this.emailAddress)) {
			this.emailSender = this.getJavaMailSender();
		}
		final SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject(subject);
		message.setText(text);
		this.emailSender.send(message);
	}

	String getEmailAddress() {
		return this.emailAddress;
	}

	@Bean
	public JavaMailSender getJavaMailSender() {
		final JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost("smtp.gmail.com");
		mailSender.setPort(587);

		mailSender.setUsername(this.emailAddress);
		mailSender.setPassword(this.emailPass);

		final Properties props = mailSender.getJavaMailProperties();
		props.put("mail.transport.protocol", "smtp");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.debug", "false");

		return mailSender;
	}
}
