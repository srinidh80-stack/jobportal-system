package com.jobportal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.backend.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

}