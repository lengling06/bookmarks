-- 创建分类表
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 创建书签表
CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`category_id` integer NOT NULL,
	`tags` text,
	`is_active` integer DEFAULT true NOT NULL,
	`last_checked` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);

-- 创建管理员表
CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 创建索引
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);
CREATE UNIQUE INDEX `admins_username_unique` ON `admins` (`username`);
CREATE INDEX `bookmarks_category_id_idx` ON `bookmarks` (`category_id`);
CREATE INDEX `bookmarks_status_idx` ON `bookmarks` (`status`);
CREATE INDEX `bookmarks_created_at_idx` ON `bookmarks` (`created_at`);

-- 插入默认管理员账户 (用户名: admin, 密码: admin123)
-- 密码哈希使用bcrypt生成，实际部署时应该修改
INSERT INTO `admins` (`username`, `password_hash`) VALUES 
('admin', '$2b$10$rOzJqQZQXQXQXQXQXQXQXu7VqQZQXQXQXQXQXQXQXQXQXQXQXQXQXQ');

-- 插入示例分类
INSERT INTO `categories` (`name`, `description`, `sort_order`) VALUES 
('开发工具', '编程和开发相关的工具和资源', 1),
('设计资源', 'UI/UX设计工具和素材网站', 2),
('学习资料', '在线课程和教程网站', 3);

-- 插入示例书签
INSERT INTO `bookmarks` (`title`, `url`, `description`, `category_id`, `tags`) VALUES 
('GitHub', 'https://github.com', '全球最大的代码托管平台', 1, '["代码托管", "开源", "协作"]'),
('Stack Overflow', 'https://stackoverflow.com', '程序员问答社区', 1, '["问答", "编程", "社区"]'),
('MDN Web Docs', 'https://developer.mozilla.org', 'Web开发技术文档', 1, '["文档", "Web", "前端"]'),
('Figma', 'https://figma.com', '在线UI设计工具', 2, '["设计", "UI", "协作"]'),
('Dribbble', 'https://dribbble.com', '设计师作品展示平台', 2, '["设计", "灵感", "作品集"]'),
('Coursera', 'https://coursera.org', '在线课程平台', 3, '["课程", "学习", "认证"]');