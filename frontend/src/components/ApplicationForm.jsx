import React from 'react'

function ApplicationForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Full name
        <input type="text" name="name" />
      </label>
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Resume
        <textarea name="resume" rows="4" />
      </label>
      <button type="submit">Submit application</button>
    </form>
  )
}

export default ApplicationForm
