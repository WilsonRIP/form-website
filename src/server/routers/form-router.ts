import { forms, formFields, formSubmissions } from "@/server/db/schema"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { j, publicProcedure } from "../jstack"

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
      const { title, description, fields } = input

      // Create form
      const [newForm] = await db.insert(forms).values({
        title,
        description: description || null
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
          options: field.options || null,
          order: index
        }))

        await db.insert(formFields).values(fieldValues)
      }

      return c.superjson(newForm)
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

      // Verify form exists
      const form = await db.select().from(forms).where(eq(forms.id, formId)).limit(1)
      if (form.length === 0) {
        throw new Error("Form not found")
      }

      // Create submission
      const [submission] = await db.insert(formSubmissions).values({
        formId,
        data
      }).returning()

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
}) 