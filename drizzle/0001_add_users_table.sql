-- Migration: Add users table and link forms to users
-- Created: 2024-01-15

-- Create users table
CREATE TABLE "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password" text NOT NULL,
	"avatar" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Add user_id column to forms table
ALTER TABLE "forms" ADD COLUMN "user_id" integer REFERENCES "users"("id") ON DELETE cascade;

-- Create indexes
CREATE INDEX "User_email_idx" ON "users" USING btree ("email");
CREATE INDEX "Form_userId_idx" ON "forms" USING btree ("user_id"); 