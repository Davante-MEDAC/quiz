import { createClient, type Client, type Row } from "@libsql/client"
import type {
  IDatabase,
  DbUser,
  DbAccount,
  DbSession,
  DbVerificationToken,
} from "./IDatabase.js"

export class LocalDatabase implements IDatabase {
  private client: Client

  constructor(url: string = "file:database.local.sqlite") {
    this.client = createClient({ url })
  }

  private mapUser(row: Row): DbUser {
    return {
      id: row["id"] as string,
      email: row["email"] as string,
      email_verified: row["email_verified"]
        ? new Date(row["email_verified"] as string)
        : null,
      name: (row["name"] as string | null) ?? null,
      image: (row["image"] as string | null) ?? null,
      created_at: new Date(row["created_at"] as string),
      updated_at: new Date(row["updated_at"] as string),
    }
  }

  private mapAccount(row: Row): DbAccount {
    return {
      id: row["id"] as string,
      user_id: row["user_id"] as string,
      type: row["type"] as string,
      provider: row["provider"] as string,
      provider_account_id: row["provider_account_id"] as string,
      refresh_token: (row["refresh_token"] as string | null) ?? null,
      access_token: (row["access_token"] as string | null) ?? null,
      expires_at: (row["expires_at"] as number | null) ?? null,
      token_type: (row["token_type"] as string | null) ?? null,
      scope: (row["scope"] as string | null) ?? null,
      id_token: (row["id_token"] as string | null) ?? null,
      session_state: (row["session_state"] as string | null) ?? null,
      created_at: new Date(row["created_at"] as string),
      updated_at: new Date(row["updated_at"] as string),
    }
  }

  private mapSession(row: Row): DbSession {
    return {
      id: row["id"] as string,
      user_id: row["user_id"] as string,
      session_token: row["session_token"] as string,
      expires: new Date(row["expires"] as string),
      created_at: new Date(row["created_at"] as string),
      updated_at: new Date(row["updated_at"] as string),
    }
  }

  private mapVerificationToken(row: Row): DbVerificationToken {
    return {
      identifier: row["identifier"] as string,
      token: row["token"] as string,
      expires: new Date(row["expires"] as string),
    }
  }

  async createUser(
    user: Omit<DbUser, "created_at" | "updated_at">
  ): Promise<DbUser> {
    await this.client.execute({
      sql: `INSERT INTO authjs_users (id, email, email_verified, name, image)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        user.id,
        user.email,
        user.email_verified?.toISOString() ?? null,
        user.name ?? null,
        user.image ?? null,
      ],
    })
    return (await this.getUser(user.id))!
  }

  async getUser(id: string): Promise<DbUser | null> {
    const result = await this.client.execute({
      sql: `SELECT * FROM authjs_users WHERE id = ?`,
      args: [id],
    })
    return result.rows[0] ? this.mapUser(result.rows[0]) : null
  }

  async getUserByEmail(email: string): Promise<DbUser | null> {
    const result = await this.client.execute({
      sql: `SELECT * FROM authjs_users WHERE email = ?`,
      args: [email],
    })
    return result.rows[0] ? this.mapUser(result.rows[0]) : null
  }

  async getUserByAccount(
    provider: string,
    providerAccountId: string
  ): Promise<DbUser | null> {
    const result = await this.client.execute({
      sql: `SELECT u.*
            FROM authjs_users u
            JOIN authjs_accounts a ON u.id = a.user_id
            WHERE a.provider = ? AND a.provider_account_id = ?`,
      args: [provider, providerAccountId],
    })
    return result.rows[0] ? this.mapUser(result.rows[0]) : null
  }

  async updateUser(
    user: Partial<DbUser> & Pick<DbUser, "id">
  ): Promise<DbUser> {
    const fields: string[] = []
    const args: (string | number | null)[] = []

    if (user.email !== undefined) {
      fields.push("email = ?")
      args.push(user.email)
    }
    if (user.email_verified !== undefined) {
      fields.push("email_verified = ?")
      args.push(user.email_verified?.toISOString() ?? null)
    }
    if (user.name !== undefined) {
      fields.push("name = ?")
      args.push(user.name)
    }
    if (user.image !== undefined) {
      fields.push("image = ?")
      args.push(user.image)
    }

    fields.push("updated_at = CURRENT_TIMESTAMP")
    args.push(user.id)

    await this.client.execute({
      sql: `UPDATE authjs_users SET ${fields.join(", ")} WHERE id = ?`,
      args,
    })
    return (await this.getUser(user.id))!
  }

  async deleteUser(userId: string): Promise<void> {
    await this.client.execute({
      sql: `DELETE FROM authjs_users WHERE id = ?`,
      args: [userId],
    })
  }

  async linkAccount(
    account: Omit<DbAccount, "created_at" | "updated_at">
  ): Promise<DbAccount> {
    await this.client.execute({
      sql: `INSERT INTO authjs_accounts
              (id, user_id, type, provider, provider_account_id,
               refresh_token, access_token, expires_at,
               token_type, scope, id_token, session_state)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        account.id,
        account.user_id,
        account.type,
        account.provider,
        account.provider_account_id,
        account.refresh_token ?? null,
        account.access_token ?? null,
        account.expires_at ?? null,
        account.token_type ?? null,
        account.scope ?? null,
        account.id_token ?? null,
        account.session_state ?? null,
      ],
    })
    return (await this.getAccount(account.provider_account_id, account.provider))!
  }

  async unlinkAccount(
    provider: string,
    providerAccountId: string
  ): Promise<void> {
    await this.client.execute({
      sql: `DELETE FROM authjs_accounts
            WHERE provider = ? AND provider_account_id = ?`,
      args: [provider, providerAccountId],
    })
  }

  async getAccount(
    providerAccountId: string,
    provider: string
  ): Promise<DbAccount | null> {
    const result = await this.client.execute({
      sql: `SELECT * FROM authjs_accounts
            WHERE provider_account_id = ? AND provider = ?`,
      args: [providerAccountId, provider],
    })
    return result.rows[0] ? this.mapAccount(result.rows[0]) : null
  }

  async createSession(
    session: Omit<DbSession, "created_at" | "updated_at">
  ): Promise<DbSession> {
    await this.client.execute({
      sql: `INSERT INTO authjs_sessions (id, user_id, session_token, expires)
            VALUES (?, ?, ?, ?)`,
      args: [
        session.id,
        session.user_id,
        session.session_token,
        session.expires.toISOString(),
      ],
    })
    const result = await this.client.execute({
      sql: `SELECT * FROM authjs_sessions WHERE session_token = ?`,
      args: [session.session_token],
    })
    return this.mapSession(result.rows[0])
  }

  async getSessionAndUser(
    sessionToken: string
  ): Promise<{ session: DbSession; user: DbUser } | null> {
    const sessionResult = await this.client.execute({
      sql: `SELECT * FROM authjs_sessions WHERE session_token = ?`,
      args: [sessionToken],
    })
    if (!sessionResult.rows[0]) return null
    const session = this.mapSession(sessionResult.rows[0])

    const userResult = await this.client.execute({
      sql: `SELECT * FROM authjs_users WHERE id = ?`,
      args: [session.user_id],
    })
    if (!userResult.rows[0]) return null

    return { session, user: this.mapUser(userResult.rows[0]) }
  }

  async updateSession(
    session: Partial<DbSession> & Pick<DbSession, "session_token">
  ): Promise<DbSession | null> {
    const fields: string[] = []
    const args: (string | null)[] = []

    if (session.expires !== undefined) {
      fields.push("expires = ?")
      args.push(session.expires.toISOString())
    }
    if (session.user_id !== undefined) {
      fields.push("user_id = ?")
      args.push(session.user_id)
    }

    fields.push("updated_at = CURRENT_TIMESTAMP")
    args.push(session.session_token)

    await this.client.execute({
      sql: `UPDATE authjs_sessions SET ${fields.join(", ")} WHERE session_token = ?`,
      args,
    })

    const result = await this.client.execute({
      sql: `SELECT * FROM authjs_sessions WHERE session_token = ?`,
      args: [session.session_token],
    })
    return result.rows[0] ? this.mapSession(result.rows[0]) : null
  }

  async deleteSession(sessionToken: string): Promise<void> {
    await this.client.execute({
      sql: `DELETE FROM authjs_sessions WHERE session_token = ?`,
      args: [sessionToken],
    })
  }

  async createVerificationToken(
    token: DbVerificationToken
  ): Promise<DbVerificationToken> {
    await this.client.execute({
      sql: `INSERT INTO authjs_verification_tokens (identifier, token, expires)
            VALUES (?, ?, ?)`,
      args: [token.identifier, token.token, token.expires.toISOString()],
    })
    const result = await this.client.execute({
      sql: `SELECT * FROM authjs_verification_tokens
            WHERE identifier = ? AND token = ?`,
      args: [token.identifier, token.token],
    })
    return this.mapVerificationToken(result.rows[0])
  }

  async useVerificationToken(
    identifier: string,
    token: string
  ): Promise<DbVerificationToken | null> {
    const result = await this.client.execute({
      sql: `SELECT * FROM authjs_verification_tokens
            WHERE identifier = ? AND token = ?`,
      args: [identifier, token],
    })
    if (!result.rows[0]) return null

    await this.client.execute({
      sql: `DELETE FROM authjs_verification_tokens
            WHERE identifier = ? AND token = ?`,
      args: [identifier, token],
    })
    return this.mapVerificationToken(result.rows[0])
  }
}
