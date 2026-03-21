// db/schema.ts
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const roleEnum = [
  "MEMBER",
  "CORE",
  "LEAD",
  "ALUMNUS",
  "UNVERIFIED",
] as const;
export type Role = (typeof roleEnum)[number];

export const userTypeEnum = ["Core", "Primary", "Secondary"] as const;
export type UserType = (typeof userTypeEnum)[number];

export const sessionTypeEnum = ["General Session", "Part Session"] as const;
export type SessionType = (typeof sessionTypeEnum)[number];

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  firstName: text("firstName"),
  firstNameKo: text("firstNameKo"),
  lastName: text("lastName"),
  lastNameKo: text("lastNameKo"),
  role: text("role", { enum: roleEnum }).notNull().default("UNVERIFIED"),

  githubId: text("githubId"),
  instagramId: text("instagramId"),
  linkedInId: text("linkedinId"),

  isForeigner: integer("isForeigner", { mode: "boolean" })
    .default(false)
    .notNull(),
  major: text("major"),
  studentId: integer("studentId"), // 학번은 숫자로 관리
  telephone: text("telephone"),
  sessionNotiEmail: integer("sessionNotiEmail", { mode: "boolean" })
    .default(true)
    .notNull(),
  registeredAt: integer("registeredAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const generations = sqliteTable("generations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startDate: integer("startDate", { mode: "timestamp" }).notNull(),
  endDate: integer("endDate", { mode: "timestamp" }),
  name: text("name").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const parts = sqliteTable("parts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  generationId: integer("generationId").references(() => generations.id),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  displayOrder: integer("displayOrder").notNull().default(10),
});

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  nameKo: text("nameKo"),
  description: text("description").notNull().default(""),
  descriptionKo: text("descriptionKo"),
  content: text("content").notNull().default(""),
  contentKo: text("contentKo").notNull().default(""),
  mainImage: text("mainImage").notNull().default("/project-default.png"),
  // JSONB 대신 Text 모드 JSON 사용
  images: text("images", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),

  authorId: text("authorId")
    .notNull()
    .references(() => user.id, { onDelete: "no action", onUpdate: "cascade" }),
  generationId: integer("generationId")
    .notNull()
    .references(() => generations.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Domain Sessions (이벤트/세션)
export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  nameKo: text("nameKo").notNull(),
  description: text("description"),
  descriptionKo: text("descriptionKo"),
  mainImage: text("mainImage").notNull().default("/session-default.png"),
  images: text("images", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default([]),

  authorId: text("authorId")
    .notNull()
    .references(() => user.id, { onDelete: "no action", onUpdate: "cascade" }),
  partId: integer("partId").references(() => parts.id),

  internalOpen: integer("internalOpen", { mode: "boolean" }).default(false),
  publicOpen: integer("publicOpen", { mode: "boolean" }).default(false),
  maxCapacity: integer("maxCapacity").default(0),
  location: text("location"),
  locationKo: text("locationKo"),
  type: text("type", { enum: sessionTypeEnum }).default("Part Session"),
  displayOnWebsite: integer("displayOnWebsite", { mode: "boolean" }).default(
    true,
  ),

  startAt: integer("startAt", { mode: "timestamp" }),
  endAt: integer("endAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const externalParticipants = sqliteTable("external_participants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("firstName"),
  firstNameKo: text("firstNameKo"),
  lastName: text("lastName"),
  lastNameKo: text("lastNameKo"),
  studentId: text("studentId"),
  email: text("email"),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  sessionId: text("sessionId")
    .notNull()
    .references(() => sessions.id),
});

/**
 * ------------------------------------------------------------------
 * JOIN TABLES (Relations)
 * ------------------------------------------------------------------
 */

export const usersToParts = sqliteTable(
  "users_to_parts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    partId: integer("part_id")
      .notNull()
      .references(() => parts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userType: text("userType", { enum: userTypeEnum }).default("Primary"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.partId] }),
  }),
);

export const usersToProjects = sqliteTable(
  "users_to_projects",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.projectId] }),
  }),
);

export const projectsToTags = sqliteTable(
  "projects_to_tags",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.tagId] }), // SQLite Join Table PK 처리
  }),
);

export const userToSession = sqliteTable(
  "user_to_session",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    sessionId: text("sessionId")
      .notNull()
      .references(() => sessions.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.sessionId] }),
  }),
);

/**
 * ------------------------------------------------------------------
 * RELATIONS DEFINITIONS
 * ------------------------------------------------------------------
 */

// Users Relations
export const usersRelations = relations(user, ({ many }) => ({
  accounts: many(account), // for NextAuth
  usersToParts: many(usersToParts),
  usersToProjects: many(usersToProjects),
  userToSession: many(userToSession),
  createdProjects: many(projects, { relationName: "author_projects" }),
  createdSessions: many(sessions, { relationName: "author_sessions" }),
}));

// Generations Relations
export const generationsRelations = relations(generations, ({ many }) => ({
  parts: many(parts),
  projects: many(projects),
}));

// Parts Relations
export const partsRelations = relations(parts, ({ one, many }) => ({
  generation: one(generations, {
    fields: [parts.generationId],
    references: [generations.id],
  }),
  usersToParts: many(usersToParts),
  sessions: many(sessions),
}));

// Projects Relations
export const projectsRelations = relations(projects, ({ many, one }) => ({
  usersToProjects: many(usersToProjects),
  projectsToTags: many(projectsToTags),
  generation: one(generations, {
    fields: [projects.generationId],
    references: [generations.id],
  }),
  author: one(user, {
    fields: [projects.authorId],
    references: [user.id],
    relationName: "author_projects",
  }),
}));

// Tags Relations
export const tagsRelations = relations(tags, ({ many }) => ({
  projectsToTags: many(projectsToTags),
}));

// ProjectsToTags Relations
export const projectsToTagsRelations = relations(projectsToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [projectsToTags.tagId],
    references: [tags.id],
  }),
  project: one(projects, {
    fields: [projectsToTags.projectId],
    references: [projects.id],
  }),
}));

// Sessions Relations
export const sessionRelations = relations(sessions, ({ one, many }) => ({
  part: one(parts, {
    fields: [sessions.partId],
    references: [parts.id],
  }),
  externalParticipants: many(externalParticipants),
  userToSession: many(userToSession),
  author: one(user, {
    fields: [sessions.authorId],
    references: [user.id],
    relationName: "author_sessions",
  }),
}));

// External Participants Relations
export const externalParticipantsRelation = relations(
  externalParticipants,
  ({ one }) => ({
    session: one(sessions, {
      fields: [externalParticipants.sessionId],
      references: [sessions.id],
    }),
  }),
);

// userToParts Relations
export const userToPartsRelations = relations(usersToParts, ({ one }) => ({
  part: one(parts, {
    fields: [usersToParts.partId],
    references: [parts.id],
  }),
  user: one(user, {
    fields: [usersToParts.userId],
    references: [user.id],
  }),
}));

// UsersToProjects Relations
export const usersToProjectsRelations = relations(
  usersToProjects,
  ({ one }) => ({
    project: one(projects, {
      fields: [usersToProjects.projectId],
      references: [projects.id],
    }),
    user: one(user, {
      fields: [usersToProjects.userId],
      references: [user.id],
    }),
  }),
);

// UserToSession Relations
export const userToSessionRelations = relations(userToSession, ({ one }) => ({
  session: one(sessions, {
    fields: [userToSession.sessionId],
    references: [sessions.id],
  }),
  user: one(user, {
    fields: [userToSession.userId],
    references: [user.id],
  }),
}));
