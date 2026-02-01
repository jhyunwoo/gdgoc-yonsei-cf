CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `external_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`firstName` text,
	`firstNameKo` text,
	`lastName` text,
	`lastNameKo` text,
	`studentId` text,
	`email` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP),
	`sessionId` text NOT NULL,
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `generations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`startDate` integer NOT NULL,
	`endDate` integer,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `parts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`generationId` integer,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP),
	`displayOrder` integer DEFAULT 10 NOT NULL,
	FOREIGN KEY (`generationId`) REFERENCES `generations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`nameKo` text,
	`description` text DEFAULT '' NOT NULL,
	`descriptionKo` text,
	`content` text DEFAULT '' NOT NULL,
	`contentKo` text DEFAULT '' NOT NULL,
	`mainImage` text DEFAULT '/project-default.png' NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`authorId` text NOT NULL,
	`generationId` integer NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE no action,
	FOREIGN KEY (`generationId`) REFERENCES `generations`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects_to_tags` (
	`project_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`project_id`, `tag_id`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`nameKo` text NOT NULL,
	`description` text,
	`descriptionKo` text,
	`mainImage` text DEFAULT '/session-default.png' NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`authorId` text NOT NULL,
	`partId` integer,
	`internalOpen` integer DEFAULT false,
	`publicOpen` integer DEFAULT false,
	`maxCapacity` integer DEFAULT 0,
	`location` text,
	`locationKo` text,
	`type` text DEFAULT 'Part Session',
	`displayOnWebsite` integer DEFAULT true,
	`startAt` integer,
	`endAt` integer,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE no action,
	FOREIGN KEY (`partId`) REFERENCES `parts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`firstName` text,
	`firstNameKo` text,
	`lastName` text,
	`lastNameKo` text,
	`role` text DEFAULT 'UNVERIFIED' NOT NULL,
	`githubId` text,
	`instagramId` text,
	`linkedinId` text,
	`isForeigner` integer DEFAULT false NOT NULL,
	`major` text,
	`studentId` integer,
	`telephone` text,
	`sessionNotiEmail` integer DEFAULT true NOT NULL,
	`registeredAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `userToSession` (
	`user_id` text NOT NULL,
	`sessionId` text NOT NULL,
	PRIMARY KEY(`user_id`, `sessionId`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users_to_parts` (
	`user_id` text NOT NULL,
	`part_id` integer NOT NULL,
	`userType` text DEFAULT 'Primary',
	PRIMARY KEY(`user_id`, `part_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`part_id`) REFERENCES `parts`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users_to_projects` (
	`user_id` text NOT NULL,
	`project_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `project_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
