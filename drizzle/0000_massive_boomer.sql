CREATE TABLE `defects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`assignee` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`due_at` integer
);
