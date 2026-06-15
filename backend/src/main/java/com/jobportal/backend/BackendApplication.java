package com.jobportal.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.repository.JobRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDatabase(JobRepository jobRepository) {
		return args -> {
			if (jobRepository.count() == 0) {
				System.out.println("Seeding initial jobs to the database...");

				Job job1 = new Job();
				job1.setTitle("Software Engineer");
				job1.setCompany("Google");
				job1.setSkills("Java, Spring Boot, PostgreSQL, Docker");
				job1.setLocation("Hyderabad, India");
				job1.setDescription("We are looking for a Software Engineer to design, develop, and maintain robust backend APIs using Java and Spring Boot.");
				jobRepository.save(job1);

				Job job2 = new Job();
				job2.setTitle("React Developer");
				job2.setCompany("Meta");
				job2.setSkills("React, JavaScript, HTML5, CSS3, Tailwind CSS");
				job2.setLocation("Bangalore, India");
				job2.setDescription("Join our team to build highly interactive, responsive web applications using React.js and modern frontend technologies.");
				jobRepository.save(job2);

				Job job3 = new Job();
				job3.setTitle("Data Analyst");
				job3.setCompany("Amazon");
				job3.setSkills("SQL, Python, Excel, PowerBI, Tableau");
				job3.setLocation("Hyderabad, India (Remote)");
				job3.setDescription("We are seeking a data-driven analyst to extract insights, create dashboards, and help business teams make informed decisions.");
				jobRepository.save(job3);

				Job job4 = new Job();
				job4.setTitle("Product Manager");
				job4.setCompany("Microsoft");
				job4.setSkills("Agile, Product Roadmap, Communication, Analytics");
				job4.setLocation("Noida, India");
				job4.setDescription("Lead cross-functional teams to define product specifications, design roadmaps, and ship amazing user experiences.");
				jobRepository.save(job4);

				Job job5 = new Job();
				job5.setTitle("DevOps Engineer");
				job5.setCompany("Netflix");
				job5.setSkills("AWS, Kubernetes, CI/CD, Terraform, Jenkins");
				job5.setLocation("Mumbai, India");
				job5.setDescription("Optimize our cloud infrastructure, manage CI/CD pipelines, and ensure maximum uptime and system reliability.");
				jobRepository.save(job5);

				System.out.println("Seeding completed successfully!");
			}
		};
	}
}
