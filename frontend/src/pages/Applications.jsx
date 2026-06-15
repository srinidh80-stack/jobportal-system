import { useEffect, useState } from "react";
import API from "../services/api";

function Applications() {

  const [applications, setApplications] = useState([]);

  useEffect(() => {

    fetchApplications();

  }, []);

  const fetchApplications = async () => {

    try {

      const response =
        await API.get("/applications/user/1");

      setApplications(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
      }}
    >

      <h1>My Applications</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >

        {applications.map((app) => (

          <div
            key={app.id}
            style={{
              width: "280px",
              padding: "20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >

            <h2>Application #{app.id}</h2>

            <p>
              <b>Job ID:</b> {app.jobId}
            </p>

            <p>
              <b>Status:</b> {app.status}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Applications;.3