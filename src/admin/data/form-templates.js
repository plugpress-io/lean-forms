/**
 * Form Templates Data
 * Pre-built Contact Form 7 templates
 */

import { __ } from "@wordpress/i18n";

export const TEMPLATE_CATEGORIES = ["Popular", "Contact", "Booking", "Surveys"];

export const FORM_TEMPLATES = [
  // Popular Templates
  {
    id: "simple-contact",
    name: __("Simple Contact Form", "lean-forms"),
    category: "Popular",
    description: __(
      "A clean and simple contact form with name, email, subject, and message fields.",
      "lean-forms",
    ),
    preview:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMjQwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzMzMzIiByeD0iNCIvPgo8dGV4dCB4PSI3MCIgeT0iMjYzIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2VuZDwvdGV4dD4KPC9zdmc+",
    features: ["Name Field", "Email Field", "Subject Field", "Message Field"],
    shortcode: `[lfcf7-row]
[lfcf7-col col:6]
[text* your-name placeholder "Your Name"]
[/lfcf7-col]
[lfcf7-col col:6]
[email* your-email placeholder "Your Email"]
[/lfcf7-col]
[/lfcf7-row]

[text your-subject placeholder "Subject"]

[textarea your-message placeholder "Your Message"]

[submit "Send Message"]`,
    mail: {
      subject: "New Contact Form Submission",
      body: `Name: [your-name]
Email: [your-email]
Subject: [your-subject]

Message:
[your-message]`,
    },
  },

  {
    id: "business-contact",
    name: __("Business Contact Form", "lean-forms"),
    category: "Popular",
    description: __(
      "Professional contact form with company details and phone number.",
      "lean-forms",
    ),
    preview:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDQwMCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzUwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjEwIiB5PSIyMCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMTcwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMTAiIHk9IjYwIiB3aWR0aD0iMTcwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMjQwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMjkwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzMzMzMzIiByeD0iNCIvPgo8dGV4dCB4PSI3MCIgeT0iMzEzIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2VuZDwvdGV4dD4KPC9zdmc+",
    features: [
      "Name & Email",
      "Company & Phone",
      "Subject & Message",
      "Professional Layout",
    ],
    shortcode: `[lfcf7-row]
[lfcf7-col col:6]
[text* your-name placeholder "Full Name"]
[/lfcf7-col]
[lfcf7-col col:6]
[email* your-email placeholder "Email Address"]
[/lfcf7-col]
[/lfcf7-row]

[lfcf7-row]
[lfcf7-col col:6]
[text your-company placeholder "Company Name"]
[/lfcf7-col]
[lfcf7-col col:6]
[tel your-phone placeholder "Phone Number"]
[/lfcf7-col]
[/lfcf7-row]

[text your-subject placeholder "Subject"]

[textarea your-message placeholder "How can we help you?"]

[select* inquiry-type "General Inquiry" "Sales" "Support" "Partnership"]

[submit "Send Message"]`,
    mail: {
      subject: "Business Inquiry: [your-subject]",
      body: `New business inquiry received:

Name: [your-name]
Email: [your-email]
Company: [your-company]
Phone: [your-phone]
Inquiry Type: [inquiry-type]

Subject: [your-subject]

Message:
[your-message]`,
    },
  },

  // Contact Templates
  {
    id: "support-contact",
    name: __("Support Request Form", "lean-forms"),
    category: "Contact",
    description: __(
      "Customer support form with priority levels and issue categories.",
      "lean-forms",
    ),
    preview:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMTcwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMTAiIHk9IjEwMCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjE0MCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjE4MCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiIHJ4PSI0Ii8+CjxyZWN0IHg9IjIwIiB5PSIzMDAiIHdpZHRoPSIzNjAiIGhlaWdodD0iMzAiIGZpbGw9IiNGM0Y0RjYiIHJ4PSI0Ii8+CjxyZWN0IHg9IjIwIiB5PSIzNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IiNEQzI2MjYiIHJ4PSI0Ii8+Cjx0ZXh0IHg9IjcwIiB5PSIzNzMiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdWJtaXQ8L3RleHQ+Cjwvc3ZnPg==",
    features: [
      "Priority Selection",
      "Issue Category",
      "File Upload",
      "Detailed Description",
    ],
    shortcode: `[text* your-name placeholder "Your Name"]

[email* your-email placeholder "Your Email"]

[lfcf7-row]
[lfcf7-col col:6]
[select* priority "Priority Level" "Low" "Medium" "High" "Urgent"]
[/lfcf7-col]
[lfcf7-col col:6]
[select* category "Issue Category" "Technical" "Billing" "Account" "Bug Report" "Feature Request"]
[/lfcf7-col]
[/lfcf7-row]

[text your-subject placeholder "Subject"]

[textarea* issue-description placeholder "Please describe your issue in detail..."]

[file file-attachment limit:5mb filetypes:jpg|png|pdf|doc|docx]

[submit "Submit Support Request"]`,
    mail: {
      subject: "[priority] Support Request: [your-subject]",
      body: `New support request received:

Name: [your-name]
Email: [your-email]
Priority: [priority]
Category: [category]

Subject: [your-subject]

Issue Description:
[issue-description]

Attachment: [file-attachment]`,
    },
  },

  // Booking Templates
  {
    id: "appointment-booking",
    name: __("Appointment Booking", "lean-forms"),
    category: "Booking",
    description: __(
      "Book appointments with date, time selection and service options.",
      "lean-forms",
    ),
    preview:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDQwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjEwIiB5PSIyMCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMTcwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMTAiIHk9IjYwIiB3aWR0aD0iMTcwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMTcwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRTBGMkZFIiByeD0iNCIvPgo8cmVjdCB4PSIyMTAiIHk9IjE0MCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0UwRjJGRSIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjE4MCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSI4MCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjMyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjM3MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzEwQjk4MSIgcng9IjQiLz4KPHR0ZXh0IHg9IjgwIiB5PSIzOTMiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Cb29rIE5vdzwvdGV4dD4KPC9zdmc+",
    features: [
      "Date & Time Selection",
      "Service Options",
      "Contact Details",
      "Special Requests",
    ],
    shortcode: `[lfcf7-row]
[lfcf7-col col:6]
[text* client-name placeholder "Your Name"]
[/lfcf7-col]
[lfcf7-col col:6]
[email* client-email placeholder "Your Email"]
[/lfcf7-col]
[/lfcf7-row]

[tel client-phone placeholder "Phone Number"]

[lfcf7-row]
[lfcf7-col col:6]
[date* appointment-date placeholder "Preferred Date"]
[/lfcf7-col]
[lfcf7-col col:6]
[select* appointment-time "Preferred Time" "9:00 AM" "10:00 AM" "11:00 AM" "1:00 PM" "2:00 PM" "3:00 PM" "4:00 PM"]
[/lfcf7-col]
[/lfcf7-row]

[select* service "Service Required" "Consultation" "Standard Service" "Premium Service" "Custom Service"]

[textarea special-requests placeholder "Any special requests or additional information?"]

[acceptance agreement] I agree to the terms and conditions

[submit "Book Appointment"]`,
    mail: {
      subject: "New Appointment Booking - [appointment-date]",
      body: `New appointment booking received:

Client Details:
Name: [client-name]
Email: [client-email]
Phone: [client-phone]

Appointment Details:
Date: [appointment-date]
Time: [appointment-time]
Service: [service]

Special Requests:
[special-requests]

Terms Accepted: [agreement]`,
    },
  },

  // Survey Templates
  {
    id: "feedback-survey",
    name: __("Customer Feedback Survey", "lean-forms"),
    category: "Surveys",
    description: __(
      "Collect customer feedback with rating scales and multiple choice questions.",
      "lean-forms",
    ),
    preview:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0YzRjRGNiIgcng9IjQiLz4KPHJlY3QgeD0iMjAiIHk9IjYwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMTAwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8IS0tIFJhdGluZyBTdGFycyAtLT4KPGNpcmNsZSBjeD0iNDAiIGN5PSIxNTUiIHI9IjEwIiBmaWxsPSIjRkZENzAwIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iMTU1IiByPSIxMCIgZmlsbD0iI0ZGRDcwMCIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjE1NSIgcj0iMTAiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iMTE1IiBjeT0iMTU1IiByPSIxMCIgZmlsbD0iI0U1RTdFQiIvPgo8Y2lyY2xlIGN4PSIxNDAiIGN5PSIxNTUiIHI9IjEwIiBmaWxsPSIjRTVFN0VCIi8+CjwhLS0gQ2hlY2tib3hlcyAtLT4KPHJlY3QgeD0iMjAiIHk9IjE4MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjMTA5OEY2IiByeD0iMiIvPgo8cmVjdCB4PSIyMCIgeT0iMjA1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Q1RDlERCIgc3Ryb2tlLXdpZHRoPSIyIiByeD0iMiIvPgo8cmVjdCB4PSIyMCIgeT0iMjMwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Q1RDlERCIgc3Ryb2tlLXdpZHRoPSIyIiByeD0iMiIvPgo8cmVjdCB4PSIyMCIgeT0iMjcwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iMzcwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2IiByeD0iNCIvPgo8cmVjdCB4PSIyMCIgeT0iNDIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMTA5OEY2IiByeD0iNCIvPgo8dGV4dCB4PSI4MCIgeT0iNDQzIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3VibWl0PC90ZXh0Pgo8L3N2Zz4=",
    features: [
      "Rating Scale",
      "Multiple Choice",
      "Checkboxes",
      "Open Feedback",
    ],
    shortcode: `[text your-name placeholder "Your Name (Optional)"]

[email your-email placeholder "Your Email (Optional)"]

[select* overall-satisfaction "Overall Satisfaction" "Very Satisfied" "Satisfied" "Neutral" "Dissatisfied" "Very Dissatisfied"]

<p>How likely are you to recommend us to others? (1-10)</p>
[radio recommendation-score "1" "2" "3" "4" "5" "6" "7" "8" "9" "10"]

<p>Which aspects did you find most valuable? (Select all that apply)</p>
[checkbox valuable-aspects "Product Quality" "Customer Service" "Pricing" "Delivery Speed" "User Experience" "Support Documentation"]

[textarea additional-feedback placeholder "Any additional feedback or suggestions?"]

[select* contact-permission "May we contact you for follow-up?" "Yes" "No"]

[submit "Submit Feedback"]`,
    mail: {
      subject: "Customer Feedback Survey Response",
      body: `New feedback survey response:

Customer Information:
Name: [your-name]
Email: [your-email]

Feedback Details:
Overall Satisfaction: [overall-satisfaction]
Recommendation Score: [recommendation-score]
Most Valuable Aspects: [valuable-aspects]
Contact Permission: [contact-permission]

Additional Feedback:
[additional-feedback]`,
    },
  },
];
