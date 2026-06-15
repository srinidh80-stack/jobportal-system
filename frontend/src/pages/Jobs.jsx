import { useEffect, useState } from "react";
import API from "../services/api";

function Jobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const applyJob = async (jobId) => {
    try {
      await API.post("/applications/apply", {
        userId: 1,
        jobId: jobId,
      });

      alert("Applied Successfully");
    } catch (error) {
      alert("Application Failed");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
      }}
    >
      {/* Main Heading */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          JOB APPLICATION PORTAL
        </h1>

        <h2
          style={{
            fontWeight: "normal",
            color: "#dcdcdc",
          }}
        >
          Available Jobs
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              width: "300px",
              padding: "20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h2>{job.title}</h2>

            <p>{job.description}</p>

            <p>
              <b>Company:</b> {job.company}
            </p>

            <button
              onClick={() => applyJob(job.id)}
              style={{
                width: "100%",
                padding: "10px",
                border: "none",
                borderRadius: "10px",
                background: "#00c6ff",
                color: "white",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;