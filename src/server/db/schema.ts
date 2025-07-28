import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    createdAt: text("createdAt").notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updatedAt").notNull().$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("Post_name_idx").on(table.name)
  ]
)

export const forms = sqliteTable(
  "forms",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    webhookUrl: text("webhookUrl"), // Discord webhook URL
    webhookEnabled: integer("webhookEnabled", { mode: "boolean" }).default(false), // Whether webhooks are enabled
    createdAt: text("createdAt").notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updatedAt").notNull().$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("Form_title_idx").on(table.title)
  ]
)

export const formFields = sqliteTable(
  "form_fields",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    formId: integer("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // text, textarea, email, number, select, checkbox, radio, date
    label: text("label").notNull(),
    placeholder: text("placeholder"),
    required: integer("required", { mode: "boolean" }).default(false),
    options: text("options"), // For select, radio, checkbox options (JSON string)
    order: integer("order").notNull(),
    createdAt: text("createdAt").notNull().$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    index("FormField_formId_idx").on(table.formId),
    index("FormField_order_idx").on(table.order)
  ]
)

export const formSubmissions = sqliteTable(
  "form_submissions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    formId: integer("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
    data: text("data").notNull(), // Store form submission data (JSON string)
    status: text("status").notNull().default("pending"), // pending, approved, denied
    submittedAt: text("submittedAt").notNull().$defaultFn(() => new Date().toISOString()),
    reviewedAt: text("reviewedAt"), // When the submission was reviewed
    reviewNotes: text("reviewNotes"), // Notes from the reviewer
  },
  (table) => [
    index("FormSubmission_formId_idx").on(table.formId),
    index("FormSubmission_submittedAt_idx").on(table.submittedAt),
    index("FormSubmission_status_idx").on(table.status)
  ]
)

// Relations
export const formsRelations = relations(forms, ({ many }) => ({
  fields: many(formFields),
  submissions: many(formSubmissions),
}))

export const formFieldsRelations = relations(formFields, ({ one }) => ({
  form: one(forms, {
    fields: [formFields.formId],
    references: [forms.id],
  }),
}))

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  form: one(forms, {
    fields: [formSubmissions.formId],
    references: [forms.id],
  }),
}))
