import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { eq } from "drizzle-orm"
import { users } from "../db/schema"
import bcrypt from "bcryptjs"

export const authRouter = j.router({
  // Sign up new user
  signup: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { name, email, password } = input

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
      
      if (existingUser.length > 0) {
        throw new Error("User with this email already exists")
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const [newUser] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        createdAt: users.createdAt
      })

      if (!newUser) {
        throw new Error("Failed to create user")
      }

      return c.superjson({
        success: true,
        user: newUser
      })
    }),

  // Login user
  login: publicProcedure
    .input(z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { email, password } = input

      // Find user by email
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
      
      if (user.length === 0) {
        throw new Error("Invalid email or password")
      }

      const foundUser = user[0]
      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, foundUser.password)
      
      if (!isPasswordValid) {
        throw new Error("Invalid email or password")
      }

      // Return user data (without password)
      return c.superjson({
        success: true,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          avatar: foundUser.avatar,
          createdAt: foundUser.createdAt
        }
      })
    }),

  // Get user by ID
  getUser: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { id } = input

      const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        createdAt: users.createdAt
      }).from(users).where(eq(users.id, id)).limit(1)

      if (user.length === 0) {
        throw new Error("User not found")
      }

      return c.superjson(user[0])
    }),

  // Update user profile
  updateUser: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1, "Name is required").optional(),
      avatar: z.string().url("Invalid avatar URL").optional(),
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { id, ...updates } = input

      const [updatedUser] = await db.update(users)
        .set({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
          createdAt: users.createdAt
        })

      if (!updatedUser) {
        throw new Error("User not found")
      }

      return c.superjson(updatedUser)
    }),

  // Change password
  changePassword: publicProcedure
    .input(z.object({
      id: z.number(),
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z.string().min(6, "New password must be at least 6 characters"),
    }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx
      const { id, currentPassword, newPassword } = input

      // Get user with password
      const user = await db.select().from(users).where(eq(users.id, id)).limit(1)
      
      if (user.length === 0) {
        throw new Error("User not found")
      }

      const foundUser = user[0]
      if (!foundUser) {
        throw new Error("User not found")
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, foundUser.password)
      
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect")
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await db.update(users)
        .set({
          password: hashedNewPassword,
          updatedAt: new Date().toISOString()
        })
        .where(eq(users.id, id))

      return c.superjson({ success: true })
    }),
}) 