import React, { useState } from "react";
import "./ContactPage.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      {formSubmitted && <p className="form-submitted">Form Submitted!</p>}
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="name" className="contact-label">
          Name:
          <input
            className="form-input"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email" className="contact-label">
          Email:
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="phone" className="contact-label">
          Phone Number:
          <input
            className="form-input"
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="subject" className="contact-label">
          Subject:
          <input
            className="form-input"
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="message" className="contact-label">
          Message:
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}
