import React from 'react'

function JobForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Job title
        <input type="text" name="title" />
      </label>
      <label>
        Company
        <input type="text" name="company" />
      </label>
      <label>
        Location
        <input type="text" name="location" />
      </label>
      <button type="submit">Create job</button>
    </form>
  )
}

export default JobForm
