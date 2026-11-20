CREATE TABLE `measures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`defect_id` integer NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`assignee` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`due_at` integer,
	FOREIGN KEY (`defect_id`) REFERENCES `defects`(`id`) ON UPDATE no action ON DELETE cascade
);
