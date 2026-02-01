ALTER TABLE `userToSession` RENAME TO `user_to_session`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_to_session` (
	`user_id` text NOT NULL,
	`sessionId` text NOT NULL,
	PRIMARY KEY(`user_id`, `sessionId`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_to_session`("user_id", "sessionId") SELECT "user_id", "sessionId" FROM `user_to_session`;--> statement-breakpoint
DROP TABLE `user_to_session`;--> statement-breakpoint
ALTER TABLE `__new_user_to_session` RENAME TO `user_to_session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;