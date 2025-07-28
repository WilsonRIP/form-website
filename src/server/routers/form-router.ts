import { forms, formFields, formSubmissions } from "@/server/db/schema"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { sendDiscordWebhook } from "../../lib/discord-webhook"

export const formRouter = j.router({
  // Get all forms
  getAll: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx
    const allForms = await db.select().from(forms).orderBy(desc(forms.createdAt))
    return c.superjson(allForms)
  }),

  // Get form by ID with fields
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { id } = input

      const form = await db.select().from(forms).where(eq(forms.id, id)).limit(1)
      if (form.length === 0) {
        throw new Error("Form not found")
      }

      const fields = await db.select().from(formFields).where(eq(formFields.formId, id)).orderBy(formFields.order)

      return c.superjson({ ...form[0], fields })
    }),

  // Create new form
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      webhookUrl: z.string().optional(),
      webhookEnabled: z.boolean().default(false),
      fields: z.array(z.object({
        type: z.enum(["text", "textarea", "email", "number", "select", "checkbox", "radio", "date"]),
        label: z.string().min(1, "Label is required"),
        placeholder: z.string().optional(),
        required: z.boolean().default(false),
        options: z.array(z.string()).optional(),
        order: z.number()
      }))
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { title, description, webhookUrl, webhookEnabled, fields } = input

      // Create form
      const [newForm] = await db.insert(forms).values({
        title,
        description: description || null,
        webhookUrl: webhookUrl || null,
        webhookEnabled: webhookEnabled || false
      }).returning()

      if (!newForm) {
        throw new Error("Failed to create form")
      }

      // Create form fields
      if (fields.length > 0) {
        const fieldValues = fields.map((field, index) => ({
          formId: newForm.id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || null,
          required: field.required,
          options: field.options ? JSON.stringify(field.options) : null,
          order: index
        }))

        await db.insert(formFields).values(fieldValues)
      }

      return c.superjson(newForm)
    }),

  // Update form
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      webhookUrl: z.string().optional(),
      webhookEnabled: z.boolean().default(false),
      fields: z.array(z.object({
        type: z.enum(["text", "textarea", "email", "number", "select", "checkbox", "radio", "date"]),
        label: z.string().min(1, "Label is required"),
        placeholder: z.string().optional(),
        required: z.boolean().default(false),
        options: z.array(z.string()).optional(),
        order: z.number()
      }))
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { id, title, description, webhookUrl, webhookEnabled, fields } = input

      // Update form
      const [updatedForm] = await db.update(forms)
        .set({
          title,
          description: description || null,
          webhookUrl: webhookUrl || null,
          webhookEnabled: webhookEnabled || false,
          updatedAt: new Date().toISOString()
        })
        .where(eq(forms.id, id))
        .returning()

      if (!updatedForm) {
        throw new Error("Form not found")
      }

      // Delete existing fields and recreate them
      await db.delete(formFields).where(eq(formFields.formId, id))

      // Create new form fields
      if (fields.length > 0) {
        const fieldValues = fields.map((field, index) => ({
          formId: id,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder || null,
          required: field.required,
          options: field.options ? JSON.stringify(field.options) : null,
          order: index
        }))

        await db.insert(formFields).values(fieldValues)
      }

      return c.superjson(updatedForm)
    }),

  // Submit form
  submit: publicProcedure
    .input(z.object({
      formId: z.number(),
      data: z.record(z.any())
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { formId, data } = input

      // Verify form exists and get fields
      const form = await db.select().from(forms).where(eq(forms.id, formId)).limit(1)
      if (form.length === 0) {
        throw new Error("Form not found")
      }

      const fields = await db.select().from(formFields).where(eq(formFields.formId, formId)).orderBy(formFields.order)

      // Create submission
      const [submission] = await db.insert(formSubmissions).values({
        formId,
        data: JSON.stringify(data)
      }).returning()

      if (!submission) {
        throw new Error("Failed to create submission")
      }

      // Send webhook if enabled
      if (form[0].webhookEnabled && form[0].webhookUrl) {
        try {
          await sendDiscordWebhook(
            form[0].webhookUrl,
            form[0].title,
            data,
            fields,
            submission.id
          )
        } catch (error) {
          console.error('Failed to send webhook:', error)
          // Don't fail the submission if webhook fails
        }
      }

      return c.superjson(submission)
    }),

  // Get form submissions
  getSubmissions: publicProcedure
    .input(z.object({ formId: z.number() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { formId } = input

      const submissions = await db.select().from(formSubmissions).where(eq(formSubmissions.formId, formId)).orderBy(desc(formSubmissions.submittedAt))

      return c.superjson(submissions)
    }),

  // Approve submission
  approveSubmission: publicProcedure
    .input(z.object({
      submissionId: z.number(),
      notes: z.string().optional()
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { submissionId, notes } = input

      const [submission] = await db.update(formSubmissions)
        .set({
          status: "approved",
          reviewedAt: new Date().toISOString(),
          reviewNotes: notes || null
        })
        .where(eq(formSubmissions.id, submissionId))
        .returning()

      if (!submission) {
        throw new Error("Submission not found")
      }

      return c.superjson(submission)
    }),

  // Deny submission
  denySubmission: publicProcedure
    .input(z.object({
      submissionId: z.number(),
      notes: z.string().optional()
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { submissionId, notes } = input

      const [submission] = await db.update(formSubmissions)
        .set({
          status: "denied",
          reviewedAt: new Date().toISOString(),
          reviewNotes: notes || null
        })
        .where(eq(formSubmissions.id, submissionId))
        .returning()

      if (!submission) {
        throw new Error("Submission not found")
      }

      return c.superjson(submission)
    }),

  // Delete submission
  deleteSubmission: publicProcedure
    .input(z.object({
      submissionId: z.number()
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { submissionId } = input

      const [deletedSubmission] = await db.delete(formSubmissions)
        .where(eq(formSubmissions.id, submissionId))
        .returning()

      if (!deletedSubmission) {
        throw new Error("Submission not found")
      }

      return c.superjson({ success: true, deletedSubmission })
    }),

  // Test webhook
  testWebhook: publicProcedure
    .input(z.object({
      webhookUrl: z.string()
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { webhookUrl } = input

      try {
        const success = await sendDiscordWebhook(
          webhookUrl,
          "Test Form",
          { "Test Field": "This is a test submission" },
          [{ label: "Test Field", type: "text" }],
          999
        )

        return c.superjson({ success })
      } catch (error) {
        console.error('Test webhook failed:', error)
        return c.superjson({ success: false, error: 'Failed to send test webhook' })
      }
    }),
}) 