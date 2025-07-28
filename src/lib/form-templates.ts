import { FormField, FieldType } from "./types"

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  fields: FormField[]
  color: string
}

export const formTemplates: FormTemplate[] = [
  {
    id: "contact-form",
    name: "Contact Form",
    description: "A simple contact form for collecting inquiries",
    category: "Business",
    icon: "📧",
    color: "#3B82F6",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        order: 0
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email address",
        required: true,
        order: 1
      },
      {
        id: "phone",
        type: "text",
        label: "Phone Number",
        placeholder: "Enter your phone number",
        required: false,
        order: 2
      },
      {
        id: "subject",
        type: "select",
        label: "Subject",
        placeholder: "Select a subject",
        required: true,
        options: ["General Inquiry", "Support", "Sales", "Partnership", "Other"],
        order: 3
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us how we can help you...",
        required: true,
        order: 4
      }
    ]
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Professional job application form",
    category: "Business",
    icon: "💼",
    color: "#10B981",
    fields: [
      {
        id: "full-name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        order: 0
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email address",
        required: true,
        order: 1
      },
      {
        id: "phone",
        type: "text",
        label: "Phone Number",
        placeholder: "Enter your phone number",
        required: true,
        order: 2
      },
      {
        id: "position",
        type: "text",
        label: "Position Applied For",
        placeholder: "Enter the position you're applying for",
        required: true,
        order: 3
      },
      {
        id: "experience",
        type: "select",
        label: "Years of Experience",
        placeholder: "Select your experience level",
        required: true,
        options: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
        order: 4
      },
      {
        id: "skills",
        type: "checkbox",
        label: "Skills",
        placeholder: "Select your skills",
        required: true,
        options: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS", "Docker", "Git"],
        order: 5
      },
      {
        id: "cover-letter",
        type: "textarea",
        label: "Cover Letter",
        placeholder: "Tell us why you're the perfect candidate...",
        required: true,
        order: 6
      },
      {
        id: "available",
        type: "date",
        label: "Available Start Date",
        placeholder: "Select your available start date",
        required: true,
        order: 7
      }
    ]
  },
  {
    id: "customer-survey",
    name: "Customer Survey",
    description: "Gather customer feedback and satisfaction data",
    category: "Research",
    icon: "📊",
    color: "#8B5CF6",
    fields: [
      {
        id: "satisfaction",
        type: "radio",
        label: "How satisfied are you with our service?",
        placeholder: "Select your satisfaction level",
        required: true,
        options: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
        order: 0
      },
      {
        id: "recommend",
        type: "radio",
        label: "Would you recommend us to others?",
        placeholder: "Select your answer",
        required: true,
        options: ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"],
        order: 1
      },
      {
        id: "features",
        type: "checkbox",
        label: "Which features do you use most?",
        placeholder: "Select all that apply",
        required: false,
        options: ["Feature A", "Feature B", "Feature C", "Feature D", "Feature E"],
        order: 2
      },
      {
        id: "improvements",
        type: "textarea",
        label: "What could we improve?",
        placeholder: "Share your suggestions for improvement...",
        required: false,
        order: 3
      },
      {
        id: "age-group",
        type: "select",
        label: "Age Group",
        placeholder: "Select your age group",
        required: false,
        options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        order: 4
      }
    ]
  },
  {
    id: "event-registration",
    name: "Event Registration",
    description: "Register attendees for events and conferences",
    category: "Events",
    icon: "🎫",
    color: "#F59E0B",
    fields: [
      {
        id: "full-name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        order: 0
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email address",
        required: true,
        order: 1
      },
      {
        id: "company",
        type: "text",
        label: "Company/Organization",
        placeholder: "Enter your company name",
        required: false,
        order: 2
      },
      {
        id: "ticket-type",
        type: "radio",
        label: "Ticket Type",
        placeholder: "Select your ticket type",
        required: true,
        options: ["General Admission", "VIP", "Student", "Early Bird"],
        order: 3
      },
      {
        id: "dietary",
        type: "select",
        label: "Dietary Requirements",
        placeholder: "Select your dietary requirements",
        required: false,
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Other"],
        order: 4
      },
      {
        id: "special-needs",
        type: "textarea",
        label: "Special Requirements",
        placeholder: "Any special requirements or accommodations needed?",
        required: false,
        order: 5
      }
    ]
  },
  {
    id: "feedback-form",
    name: "Feedback Form",
    description: "Collect general feedback and suggestions",
    category: "Business",
    icon: "💭",
    color: "#EF4444",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Name (Optional)",
        placeholder: "Enter your name",
        required: false,
        order: 0
      },
      {
        id: "email",
        type: "email",
        label: "Email (Optional)",
        placeholder: "Enter your email for follow-up",
        required: false,
        order: 1
      },
      {
        id: "feedback-type",
        type: "select",
        label: "Type of Feedback",
        placeholder: "Select the type of feedback",
        required: true,
        options: ["Bug Report", "Feature Request", "General Feedback", "Complaint", "Compliment"],
        order: 2
      },
      {
        id: "rating",
        type: "radio",
        label: "Overall Rating",
        placeholder: "Rate your experience",
        required: true,
        options: ["1 - Poor", "2 - Fair", "3 - Good", "4 - Very Good", "5 - Excellent"],
        order: 3
      },
      {
        id: "feedback",
        type: "textarea",
        label: "Your Feedback",
        placeholder: "Please share your detailed feedback...",
        required: true,
        order: 4
      }
    ]
  }
]

export function getTemplateById(id: string): FormTemplate | undefined {
  return formTemplates.find(template => template.id === id)
}

export function getTemplatesByCategory(category: string): FormTemplate[] {
  return formTemplates.filter(template => template.category === category)
}

export function getAllCategories(): string[] {
  return [...new Set(formTemplates.map(template => template.category))]
} 