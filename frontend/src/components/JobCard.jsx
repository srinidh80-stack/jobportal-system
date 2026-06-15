import React from 'react'

function JobCard({ title, company, location, onView }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{company}</p>
      <p>{location}</p>
      <button type="button" onClick={onView}>
        View details
      </button>
    </article>
  )
}

export default JobCard
