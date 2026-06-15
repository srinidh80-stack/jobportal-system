package com.jobportal.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.repository.ApplicationRepository;

@RestController
@RequestMapping("/applications")
@CrossOrigin("*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    // Apply for a job

    @PostMapping("/apply")
    public Application applyJob(
            @RequestBody Application application) {

        application.setStatus("Applied");

        return applicationRepository.save(application);
    }

    // View applications by user

    @GetMapping("/user/{userId}")
    public List<Application> getUserApplications(
            @PathVariable Long userId) {

        return applicationRepository.findByUserId(userId);
    }

    // Update application status

    @PutMapping("/status/{id}")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Application application =
                applicationRepository.findById(id).orElseThrow();

        application.setStatus(status);

        return applicationRepository.save(application);
    }
}