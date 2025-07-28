import { jstack } from "jstack"
import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"

interface Env {
  Bindings: {}
}

export const j = jstack.init<Env>()

/**
 * Type-safely injects database into all procedures
 * @see https://jstack.app/docs/backend/middleware
 */
const databaseMiddleware = j.middleware(async ({ c, next }) => {
  const sqlite = new Database("./local.db")
  const db = drizzle(sqlite)

  return await next({ db })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware)
