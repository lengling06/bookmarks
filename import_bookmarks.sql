-- 书签管理系统数据导入脚本
-- 生成时间: 2025-07-18T08:23:43.299Z
-- 总书签数: 285

-- 清理现有数据（可选，谨慎使用）
-- DELETE FROM bookmarks;
-- DELETE FROM categories;

-- 插入分类数据
INSERT OR IGNORE INTO categories (id, name, description, sort_order, created_at, updated_at) 
VALUES (1, 'Study', '学习资源和教程文档', 0, datetime('now'), datetime('now'));
INSERT OR IGNORE INTO categories (id, name, description, sort_order, created_at, updated_at) 
VALUES (2, 'Development', '开发工具和编程资源', 1, datetime('now'), datetime('now'));
INSERT OR IGNORE INTO categories (id, name, description, sort_order, created_at, updated_at) 
VALUES (3, 'Email', '邮箱和通讯服务', 2, datetime('now'), datetime('now'));
INSERT OR IGNORE INTO categories (id, name, description, sort_order, created_at, updated_at) 
VALUES (4, 'AI', 'AI工具和人工智能应用', 3, datetime('now'), datetime('now'));
INSERT OR IGNORE INTO categories (id, name, description, sort_order, created_at, updated_at) 
VALUES (5, 'Tools', '实用工具和在线服务', 4, datetime('now'), datetime('now'));
INSERT OR IGNORE INTO categories (id, name, description, sort_order, created_at, updated_at) 
VALUES (6, 'Network', '网络服务和基础设施', 5, datetime('now'), datetime('now'));

-- 插入书签数据
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'NCRE - 中国教育考试网', 
    'http://ncre.neea.edu.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-13T11:58:15.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub · GitHub', 
    'https://github.com/github', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2021-11-13T11:57:19.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '网易邮箱', 
    'https://mail.163.com/js6/main.jsp?sid=CLhphkRJGfYZERXvaiJJSbSnIncOCvOy&df=mail163_letter#module=welcome.WelcomeModule%7C%7B%7D', 
    '邮箱和通讯服务', 
    3, 
    '["邮箱","通讯"]', 
    1, 
    'active', 
    '2024-06-15T15:16:23.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '收件箱 - lengling061@gmail.com - Gmail', 
    'https://mail.google.com/mail/u/0/#inbox', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2022-12-23T11:59:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '邮件 - leng ling - Outlook', 
    'https://outlook.live.com/mail/0/', 
    '邮箱和通讯服务', 
    3, 
    '["邮箱","通讯"]', 
    1, 
    'active', 
    '2023-05-21T08:54:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'A/I Webmail :: 收件箱', 
    'https://accounts.autistici.org/', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2024-10-10T12:18:49.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '⁡⁤⁤‌⁡‌​‌​⁣​﻿⁣⁡⁢‬‌​‍⁣​⁢⁣⁣⁢​⁣⁢⁤​﻿​⁡​⁡‌﻿​⁢‬﻿‍‍‬⁢​‍⁣⁤Java 学习路线 by 程序员鱼皮 - 飞书云文档', 
    'https://yuyuanweb.feishu.cn/wiki/RxC8w2uFQiHspQk4L3qcyjBunZd', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Java"]', 
    1, 
    'active', 
    '2024-06-09T02:36:20.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '中国大学MOOC(慕课)_国家精品课程在线学习平台', 
    'https://www.icourse163.org/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-13T11:53:35.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Dashboard | Khan Academy', 
    'https://www.khanacademy.org/profile/me/courses', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2022-02-28T12:06:56.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Linux命令大全(手册) – 真正好用的Linux命令在线查询网站', 
    'https://www.linuxcool.com/', 
    '实用的在线工具和服务', 
    1, 
    '["工具","在线","Linux"]', 
    1, 
    'active', 
    '2024-01-10T13:53:41.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Linux命令搜索引擎 命令，Linux Linux命令搜索引擎 命令详解：最专业的Linux命令大全，内容包含Linux命令手册、详解、学习，值得收藏的Linux命令速查手册。 - Linux 命令搜索引擎', 
    'https://wangchujiang.com/linux-command/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2023-07-27T03:27:15.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '学习资料 · 语雀', 
    'https://www.yuque.com/dashboard/collections', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-08-27T14:04:54.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '020,021,022 事件详解 · 语雀', 
    'https://www.yuque.com/yuejiangliu/dotnet/timothy-csharp-020-022#fwg62', 
    '来自 yuque.com 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2022-08-17T10:10:25.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '01-Docker概述', 
    'https://www.yuque.com/tmfl/cloud/rifotq', 
    '来自 yuque.com 的优质内容', 
    1, 
    '["Docker"]', 
    1, 
    'active', 
    '2023-10-22T08:56:52.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '【计算机科学速成课】 笔记 全', 
    'https://shimo.im/docs/PJAUY30F1uYksv0h/read', 
    '来自 shimo.im 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2022-06-24T14:01:22.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '【计算机科学速成课】 笔记', 
    'https://shimo.im/docs/vkCKkj3YxGtygrVg/read', 
    '来自 shimo.im 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2022-06-10T08:30:11.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '前端笔记', 
    'https://docs.mphy.top/#/', 
    '来自 docs.mphy.top 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2023-08-31T10:26:45.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '传智播客初级课笔记 - 随笔分类 - liuslayer - 博客园', 
    'https://www.cnblogs.com/liuslayer/category/682538.html', 
    '来自 cnblogs.com 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2022-02-11T14:54:00.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Markdown 基本语法 | Markdown 官方教程', 
    'https://markdown.com.cn/basic-syntax/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2022-02-22T08:36:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    ' 计算机速成课 | Crash Course 字幕组 (全40集 2018-5-1 精校完成)', 
    'https://github.com/1c7/Crash-Course-Computer-Science-Chinese', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","GitHub"]', 
    1, 
    'active', 
    '2022-06-24T14:00:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 文档 - 入门、教程、参考。 | Microsoft Docs', 
    'https://docs.microsoft.com/zh-cn/dotnet/csharp/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-13T11:57:14.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '高中数学基础与解法全集（涵盖所有）|长期更新|从零开始拯救所有学渣！通俗易懂|竞赛国一保送生主讲|数学有救了|干货满满|包含必修一必修二必修三必修四必修五_哔哩哔哩_bilibili', 
    'https://www.bilibili.com/video/BV147411K7xu?p=2', 
    '娱乐和多媒体内容', 
    1, 
    '["娱乐","视频","B站"]', 
    1, 
    'active', 
    '2021-11-13T13:25:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '📚C#/.NET/.NET Core推荐学习书籍 · Issue #9 · YSGStudyHards/DotNetGuide', 
    'https://github.com/YSGStudyHards/DotNetGuide/issues/9', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","GitHub"]', 
    1, 
    'active', 
    '2023-02-08T11:42:34.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 教程 | 菜鸟教程', 
    'https://www.runoob.com/csharp/csharp-tutorial.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-13T11:58:23.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'AcWing', 
    'https://www.acwing.com/about/', 
    '来自 acwing.com 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2022-09-22T08:57:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '计算机科学速成课（计组部分） | ProcessOn免费在线作图,在线流程图,在线思维导图', 
    'https://www.processon.com/view/link/61ef6e8f0e3e7439ae917672#map', 
    '实用的在线工具和服务', 
    1, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2022-06-24T13:56:26.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '首先【Git的基础】 | 猴子都能懂的GIT入门 | 贝格乐（Backlog）', 
    'https://backlog.com/git-tutorial/cn/intro/intro1_1.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Git"]', 
    1, 
    'active', 
    '2023-04-18T12:22:35.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub 漫游指南', 
    'https://github.phodal.com/#/', 
    'GitHub开源项目和代码仓库', 
    1, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2024-07-18T09:34:45.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Excalidraw--画布', 
    'https://excalidraw.com/', 
    '来自 excalidraw.com 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2023-05-27T05:25:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '欢迎来到sshPlayer', 
    'https://v-music.vercel.app/#/discovery', 
    '网络服务和基础设施', 
    1, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2023-06-02T09:41:40.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'markdown基本语法（比较全面） - 简书', 
    'https://www.jianshu.com/p/36d67d7d6985#fn1', 
    '来自 jianshu.com 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2023-06-29T09:02:48.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '数据结构——学习笔记——入门必看【建议收藏】_数据结构笔记_刘鑫磊up的博客-CSDN博客', 
    'https://blog.csdn.net/liu17234050/article/details/104237990', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","CSDN"]', 
    1, 
    'active', 
    '2023-07-02T13:36:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '茂茂物语 | 前端笔记', 
    'https://notes.fe-mm.com/', 
    '来自 notes.fe-mm.com 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2023-07-10T08:02:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '基础汉英类义词典 - Obsidian Publish', 
    'https://publish.obsidian.md/thesaurus/%E8%8B%B1%E8%AF%AD%E8%AF%8D%E4%B9%89%E5%88%86%E7%B1%BB%E6%95%B0%E6%8D%AE%E5%BA%93%EF%BC%88%E5%A4%A7%E5%AD%A6%E7%89%88%EF%BC%89/00%E6%80%BB%E7%9B%AE%E5%BD%95/000%E6%80%BB%E7%9B%AE%E5%BD%95%E5%85%A8%E8%A7%88', 
    'Obsidian Publish', 
    1, 
    '[]', 
    1, 
    'active', 
    '2023-07-24T06:06:24.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'SQL之母 - SQL自学网站', 
    'http://sqlmother.yupi.icu/#/learn/level5', 
    '来自 sqlmother.yupi.icu 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2023-08-04T12:21:40.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'ES6 入门教程 - ECMAScript 6入门', 
    'https://es6.ruanyifeng.com/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-07-27T09:20:22.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'TS入门学习_ts学习_卖猹的西瓜君的博客-CSDN博客', 
    'https://blog.csdn.net/weixin_36038649/article/details/123864631?spm=1001.2101.3001.6650.6&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-6-123864631-blog-127664002.235%5Ev38%5Epc_relevant_anti_t3_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-6-123864631-blog-127664002.235%5Ev38%5Epc_relevant_anti_t3_base&utm_relevant_index=8', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","TypeScript","CSDN"]', 
    1, 
    'active', 
    '2023-08-31T05:21:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'TS 快速入门_ts快速入门_程序猿_“大神”的博客-CSDN博客', 
    'https://blog.csdn.net/dyx001007/article/details/127664002', 
    'CSDN技术博客和开发文档', 
    1, 
    '["TypeScript","CSDN"]', 
    1, 
    'active', 
    '2023-08-31T05:22:30.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'TypeScript 教程 - 网道', 
    'https://wangdoc.com/typescript/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","TypeScript"]', 
    1, 
    'active', 
    '2023-08-31T05:26:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '网道 - 互联网开发文档', 
    'https://wangdoc.com/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-08-31T05:26:13.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'git - 简明指南', 
    'https://rogerdudler.github.io/git-guide/index.zh.html', 
    '来自 rogerdudler.github.io 的优质内容', 
    1, 
    '["Git"]', 
    1, 
    'active', 
    '2023-10-31T05:24:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Easy-DotNET', 
    'https://easy-dotnet.com/', 
    '来自 easy-dotnet.com 的优质内容', 
    1, 
    '[]', 
    1, 
    'active', 
    '2023-11-10T14:44:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '在线LaTeX公式编辑器-编辑器', 
    'https://www.latexlive.com/home', 
    '实用的在线工具和服务', 
    1, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2023-12-26T05:20:31.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '百度网盘加速', 
    'https://www.94speed.com/', 
    '网络服务和基础设施', 
    1, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2024-01-11T07:35:41.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '英语真题在线 - 官网', 
    'https://zhenti.burningvocabulary.cn/', 
    '实用的在线工具和服务', 
    1, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2024-03-09T10:57:50.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '你好！帮助用户。', 
    'https://chat.zhile.io/?model=text-davinci-002-render-sha', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-05-26T05:21:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'ChatGPT', 
    'https://chat.openai.com/', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-06-12T10:09:02.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '文心一言', 
    'https://yiyan.baidu.com/?from=17', 
    '来自 yiyan.baidu.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2023-12-25T11:08:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '用户脚本', 
    'https://greasyfork.org/zh-CN/scripts', 
    '来自 greasyfork.org 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2021-11-13T11:44:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '极简插件_Chrome扩展插件商店_优质crx应用', 
    'https://chrome.zzzmh.cn/index#index', 
    '来自 chrome.zzzmh.cn 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2021-11-13T11:23:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '果核剥壳 - 互联网的净土', 
    'https://www.ghxi.com/', 
    '来自 ghxi.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2022-02-02T05:08:38.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'dazidazi-在线打字练习网站-提高打字速度-打字测试-标准指法', 
    'https://dazidazi.com/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2022-11-27T09:55:58.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '音乐直链搜索|音乐在线试听 - by 刘志进实验室', 
    'https://music.liuzhijin.cn/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2021-12-11T10:13:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '在线生成透明ICO图标——ICO图标制作', 
    'http://www.ico51.cn/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2021-12-08T11:22:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '花猪のBlog - HuaZhu&#39;s blog', 
    'https://cnhuazhu.top/butterfly/', 
    'HuaZhu&#39;s blog', 
    5, 
    '[]', 
    1, 
    'active', 
    '2022-02-16T08:04:48.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'HiFiNi - 音乐磁场', 
    'https://www.hifini.com/', 
    '娱乐和多媒体内容', 
    5, 
    '["娱乐","视频"]', 
    1, 
    'active', 
    '2022-03-05T03:15:49.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Z-Library – 世界上最大的电子图书馆。自由访问知识和文化。', 
    'https://zh.z-library.rs/', 
    '来自 zh.z-library.rs 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-06-11T09:02:58.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Z library入口最新获取方式 | Z library 最新入口 | Z Library 助手 | Z library', 
    'https://find.looks.wang/', 
    'Z library 最新入口', 
    5, 
    '[]', 
    1, 
    'active', 
    '2022-12-29T02:18:44.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - freefq/tutorials: 教程', 
    'https://github.com/freefq/tutorials', 
    '优质学习教程和技术文档', 
    5, 
    '["学习","教程","Git","GitHub","免费"]', 
    1, 
    'active', 
    '2022-08-15T09:31:19.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '菜鸟工具 - 不止于工具', 
    'https://c.runoob.com/', 
    '优质学习教程和技术文档', 
    5, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2022-06-13T08:17:26.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Visual Studio主题', 
    'https://marketplace.visualstudio.com/vs', 
    '来自 marketplace.visualstudio.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2022-10-07T04:20:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - IceTiki/ruoli-sign-optimization: 今日校园自动签到。基于若离的版本加入若干特性。', 
    'https://github.com/IceTiki/ruoli-sign-optimization', 
    'GitHub开源项目和代码仓库', 
    5, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2022-01-12T07:38:54.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - iptv-org/iptv：来自世界各地的公开IPTV频道的集合', 
    'https://github.com/iptv-org/iptv', 
    'GitHub开源项目和代码仓库', 
    5, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2022-02-02T07:14:52.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub中文社区', 
    'https://www.githubs.cn/', 
    'GitHub开源项目和代码仓库', 
    5, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2021-11-13T11:57:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Ghost&#39;s Blog', 
    'https://ghostcui.github.io/', 
    '来自 ghostcui.github.io 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2022-02-15T10:20:44.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Logotypes icons by Pixel Bazaar', 
    'https://www.iconfinder.com/iconsets/logotypes', 
    '来自 iconfinder.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2022-12-10T10:44:36.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - forthespada/CS-Books: 🔥🔥超过1000本的计算机经典书籍、个人笔记资料以及本人在各平台发表文章中所涉及的资源等。书籍资源包括C/C++、Java、Python、Go语言、数据结构与算法、操作系统、', 
    'https://github.com/forthespada/CS-Books#05%E3%80%81%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95', 
    'GitHub开源项目和代码仓库', 
    5, 
    '["GitHub","开源","Python","Java","Git"]', 
    1, 
    'active', 
    '2022-02-15T03:09:59.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '知云文献翻译官网-官方指定最新知云文献翻译及Xtranslator-win+mac版下载页面', 
    'http://www.zhiyunwenxian.cn/', 
    '网络服务和基础设施', 
    5, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2023-01-02T07:09:11.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'JetBrains全家桶激活', 
    'https://3.jetbra.in/', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-01-13T11:23:45.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Jetbrains激活', 
    'https://jbls.ide-soft.com/', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2024-06-06T04:11:52.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Avrinbai &#39; Blog – 白林客', 
    'https://avrinbai.cn/', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-02-14T10:38:56.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '百度网盘在线解析-MCHZB', 
    'https://pan.mchzb.com/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2023-03-05T10:44:05.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '一元机场', 
    'https://xn--4gq62f52gdss.com/#/plan', 
    '来自 xn--4gq62f52gdss.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2023-03-19T04:38:48.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '两元店', 
    'https://liangyuandian.net/#/plan', 
    '来自 liangyuandian.net 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2023-07-30T07:47:26.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '仪表盘 - 宝可梦星云', 
    'https://abc.52pokemon.cc/#/stage/dashboard', 
    '来自 abc.52pokemon.cc 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-09-09T12:21:52.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '魔法上网集合', 
    'https://9.234456.xyz/abc.html?t=638162432294041861', 
    '来自 9.234456.xyz 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2023-08-21T09:24:39.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Docs', 
    'https://btsogiwudc.feishu.cn/docx/CgoJdHyWKopl3UxV12GcG3psnjf', 
    '优质学习教程和技术文档', 
    5, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-03-21T06:52:39.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '.de 域名', 
    'https://www.customercontrolpanel.de/run/domains.php', 
    '网络服务和基础设施', 
    5, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2025-04-26T09:39:24.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '免费域名', 
    'https://nic.eu.org/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2023-04-05T01:58:00.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '免费二级域名 US.KG', 
    'https://register.us.kg/panel/main', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2024-05-29T05:18:02.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'he.net - DNS解析', 
    'https://dns.he.net/', 
    '来自 dns.he.net 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-06-11T04:43:03.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Cloudflare, what&#39;s your goal? | Lengling061@gmail.com&#39;s Account | Cloudflare', 
    'https://dash.cloudflare.com/d7be730f8bf09001fab24b271fe9e2a8', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-06-18T08:30:33.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '我的域名 - DNSPod-免费智能DNS解析服务商-电信_网通_教育网,智能DNS', 
    'https://console.dnspod.cn/dns/list', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2023-08-13T06:54:23.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Com.MP 二级域名 ', 
    'https://www.registry.com.mp/dashboard/domains?page=1&page_size=10', 
    '网络服务和基础设施', 
    5, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2024-06-11T04:44:50.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Vercel-静态网站托管平台', 
    'https://vercel.com/dashboard', 
    '网络服务和基础设施', 
    5, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2023-08-11T08:12:06.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Studio Styles - Visual Studio color schemes', 
    'https://studiostyl.es/', 
    'Visual Studio color schemes', 
    5, 
    '[]', 
    1, 
    'active', 
    '2023-04-14T06:44:15.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'porkbun.com | An oddly satisfying experience.', 
    'https://porkbun.com/', 
    'An oddly satisfying experience.', 
    5, 
    '[]', 
    1, 
    'active', 
    '2023-04-22T01:21:15.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '故梦API - 免费开放的API接口', 
    'https://api.gmit.vip/', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具","API","免费"]', 
    1, 
    'active', 
    '2023-06-11T12:00:51.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '一言开发者中心 | 用代码表达言语的魅力，用代码书写山河的壮丽。', 
    'https://developer.hitokoto.cn/', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2023-06-12T07:20:16.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '影视网站合集', 
    'https://www.kuhehe.top/2023/076a0d7752.html', 
    '来自 kuhehe.top 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2023-07-25T13:46:54.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '如何用CDN加速你的网站 – Cloudflare免费版详细使用教程 - 简书', 
    'https://www.jianshu.com/p/1e73c2d66ac8', 
    '优质学习教程和技术文档', 
    5, 
    '["学习","教程","免费"]', 
    1, 
    'active', 
    '2023-06-18T08:29:10.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '网站添加樱花效果API接口 - 笒鬼鬼api', 
    'https://api.cenguigui.cn/api/yinghua.html', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2023-07-25T13:50:29.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'BootCDN - Bootstrap 中文网开源项目免费 CDN 加速服务', 
    'https://www.bootcdn.cn/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","TypeScript","免费","开源"]', 
    1, 
    'active', 
    '2023-07-26T10:30:11.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Postman API Platform | Sign Up for Free', 
    'https://www.postman.com/', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具","API","免费"]', 
    1, 
    'active', 
    '2023-07-31T06:22:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Linux各发行版本存档', 
    'https://archive.kernel.org/', 
    '来自 archive.kernel.org 的优质内容', 
    5, 
    '["Linux"]', 
    1, 
    'active', 
    '2023-08-15T08:57:54.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Artplayer.js', 
    'https://artplayer.org/document/', 
    '来自 artplayer.org 的优质内容', 
    5, 
    '["JavaScript"]', 
    1, 
    'active', 
    '2023-08-20T12:55:46.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '免费API - 提供免费接口调用平台', 
    'https://api.aa1.cn/', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具","API","免费"]', 
    1, 
    'active', 
    '2023-01-21T15:35:52.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'FLiNG Trainer - PC Game Cheats and Mods', 
    'https://flingtrainer.com/', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能","TypeScript"]', 
    1, 
    'active', 
    '2023-12-26T12:38:54.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Doget - Github release文件下载加速', 
    'https://doget.nocsdn.com/#/', 
    'GitHub开源项目和代码仓库', 
    5, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2024-01-06T03:36:36.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '昆虫与植物识别', 
    'https://quarryman.cn/', 
    '来自 quarryman.cn 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-04-03T12:08:18.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'PPT生成-Gamma', 
    'https://gamma.app/#templates', 
    '来自 gamma.app 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-05-14T03:09:37.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '阅读、漫画源', 
    'https://www.yckceo.com/', 
    '来自 yckceo.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-06-04T01:58:33.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'NotionNext-快速免费建站 | NotionNext帮助手册', 
    'https://docs.tangly1024.com/about', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2024-06-17T08:37:46.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Temp Mail - 临时邮件 - 安全、即时、快速 - Mail.tm', 
    'https://mail.tm/zh/', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2024-06-09T10:39:39.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'ITDOG - 在线ping_在线tcping_网站测速_HTTP测速_API测速_路由追踪_在线MTR_DNS查询_ITDOG-云邦畅想', 
    'https://www.itdog.cn/', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2024-06-20T02:35:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'SQLPub - 免费的MySQL数据库', 
    'https://sqlpub.com/#/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2024-06-20T02:55:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '临时邮箱-手机号', 
    'https://www.emailnator.com/', 
    '邮箱和通讯服务', 
    5, 
    '["邮箱","通讯"]', 
    1, 
    'active', 
    '2024-06-21T03:42:29.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '首页 | ZLMediaKit', 
    'https://docs.zlmediakit.com/zh/', 
    '来自 docs.zlmediakit.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-07-09T05:05:35.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '飞兔云-购买订阅', 
    'https://xn--h5qy75o.com/shop.html', 
    '来自 xn--h5qy75o.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-07-31T05:46:21.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'My Account', 
    'https://rightchoice.cvtc.edu/Apply/', 
    '优质学习教程和技术文档', 
    5, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2024-08-01T03:57:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'DrissionPage- 网页自动化工具', 
    'https://drissionpage.cn/#%EF%B8%8F-%E6%A6%82%E8%BF%B0', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2024-08-11T05:27:40.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GSAP - 动画库', 
    'https://gsap.com/', 
    '来自 gsap.com 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-08-16T13:29:46.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Python爬虫案例 | Scrape Center', 
    'https://scrape.center/', 
    'Scrape Center', 
    5, 
    '["Python"]', 
    1, 
    'active', 
    '2024-09-11T04:05:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'serv00搭建【JAVA版】jetbrains激活码生成网站 - 资源荟萃 - LINUX DO', 
    'https://linux.do/t/topic/60887/41', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能","Java","Linux"]', 
    1, 
    'active', 
    '2024-09-12T02:01:50.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'giffgaff 中国玩家指南 - 飞书云文档', 
    'https://bx7h0mz5l4n.feishu.cn/wiki/EUrzwYL6liPT35kfiSOcubAmnDh', 
    '优质学习教程和技术文档', 
    5, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2024-09-13T05:37:44.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '考试酷(examcoo)-永久免费的电子作业与在线考试系统云平台', 
    'https://www.examcoo.com/index/ku', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2024-09-13T07:11:56.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'javascript - 如何实现一个楼中楼的评论系统 - 蚊子的前端博客 - SegmentFault 思否', 
    'https://segmentfault.com/a/1190000010958883?utm_source=sf-similar-article', 
    '如何实现一个楼中楼的评论系统', 
    5, 
    '["JavaScript"]', 
    1, 
    'active', 
    '2024-10-02T14:55:33.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'KBFZ MAIL', 
    'https://mail.cpu0.de/user', 
    'AI工具和人工智能应用', 
    5, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2024-10-05T15:02:58.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'VoAPI', 
    'https://demo.voapi.top/', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2024-10-08T07:13:20.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Free dynamic DNS service | DNSExit.com', 
    'https://dnsexit.com/Direct.sv?cmd=userDNSList', 
    'DNSExit.com', 
    5, 
    '["免费"]', 
    1, 
    'active', 
    '2024-10-08T15:59:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '订阅分享 - 首页', 
    'https://fssp.byws.online/page/1', 
    '来自 fssp.byws.online 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-10-10T06:38:53.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '今日诗词 - 一言API - 诗词实时智能推荐 - 今日诗词开放接口 - 今日诗词 API - 个人文章分享', 
    'https://www.jinrishici.com/', 
    '开发工具和编程资源', 
    5, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2024-10-26T15:04:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'FOFA 查询系统', 
    'https://fofa.guagua.info/', 
    '来自 fofa.guagua.info 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2024-10-30T15:13:29.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '首页 ❧ 时事', 
    'https://www.currentaffairs.org/?gad_source=1&gbraid=0AAAAA9wOBX02K8zWnL6kyEEXR7BsxUTX7&gclid=Cj0KCQjwt8zABhDKARIsAHXuD7aqf9LLztGPwN6cVX3qXB1Y5J4uQYf4VY_jFvQ6T2eMczXOgnItDO4aAuIFEALw_wcB', 
    '来自 currentaffairs.org 的优质内容', 
    5, 
    '[]', 
    1, 
    'active', 
    '2025-05-02T02:10:04.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '发现优质编程学习资源 - 编程导航', 
    'https://www.code-nav.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2022-01-17T07:16:20.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'HTML 取色器/拾色器 | 菜鸟教程', 
    'https://www.runoob.com/tags/html-colorpicker.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","HTML"]', 
    1, 
    'active', 
    '2022-02-22T08:59:02.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '(9条消息) C#验证码生成_小钟要学习！！！的博客-CSDN博客_c# 生成验证码', 
    'https://blog.csdn.net/baidu_39378193/article/details/117867710', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","CSDN"]', 
    1, 
    'active', 
    '2022-06-06T15:20:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'music.163.com/api/song/media?id=1441758494', 
    'http://music.163.com/api/song/media?id=1441758494', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2022-06-06T10:36:51.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 文档 - 入门、教程、参考。 | Microsoft Docs', 
    'https://docs.microsoft.com/zh-cn/dotnet/csharp/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-13T11:57:14.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Markdown 基本语法 | Markdown 官方教程', 
    'https://markdown.com.cn/basic-syntax/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2022-02-22T08:36:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Hexo博客美化', 
    'https://github.com/blinkfox/hexo-theme-matery/blob/develop/README_CN.md', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源"]', 
    1, 
    'active', 
    '2022-02-15T10:19:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Swiper中文网-轮播图幻灯片js插件,H5页面前端开发', 
    'https://www.swiper.com.cn/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","JavaScript"]', 
    1, 
    'active', 
    '2022-12-15T08:31:24.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'video.js调用 - 腾讯云开发者社区-腾讯云', 
    'https://cloud.tencent.com/developer/article/1649057?from=15425', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","JavaScript"]', 
    1, 
    'active', 
    '2022-12-19T13:03:22.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Git使用详细教程_youzhouliu的博客-CSDN博客_git使用', 
    'https://blog.csdn.net/youzhouliu/article/details/78952453', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Git","CSDN"]', 
    1, 
    'active', 
    '2022-12-20T06:46:57.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Latex：入门教程_-柚子皮-的博客-CSDN博客_latex', 
    'https://blog.csdn.net/pipisorry/article/details/54571521', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","CSDN"]', 
    1, 
    'active', 
    '2023-01-24T10:58:24.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'SMS-Activate是在线接受短信的虚拟号码服务', 
    'https://sms-activate.org/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2023-02-11T10:52:06.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'ChatGPT: Optimizing Language Models for Dialogue', 
    'https://openai.com/blog/chatgpt/', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-02-11T11:00:39.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 如何使用SunnyUI并且在工具箱中添加SunnyUI控件(VS 2019)_音尘啊的博客-CSDN博客', 
    'https://blog.csdn.net/asd497907957/article/details/120284182', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","CSDN"]', 
    1, 
    'active', 
    '2023-04-19T02:38:25.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'SqlSugar ORM 5.X 官网 、文档、教程 - SqlSugar 5x - .NET果糖网', 
    'https://www.donet5.com/Home/Doc', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-04-25T11:51:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '异步编程中的最佳做法(Async/Await)_重做放牛娃的博客-CSDN博客', 
    'https://blog.csdn.net/nacl025/article/details/9163495/', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能","CSDN"]', 
    1, 
    'active', 
    '2023-04-25T13:18:55.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '入门指南 — AutoMapper 文档', 
    'https://docs.automapper.org/en/latest/Getting-started.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-04-30T13:56:09.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'nvm使用教程_俊哥哥来也的博客-CSDN博客', 
    'https://blog.csdn.net/jj2320711457/article/details/117431854', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","CSDN"]', 
    1, 
    'active', 
    '2023-05-01T02:17:19.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Axios 中文文档 | Axios 中文网 | Axios 是一个基于 promise 的网络请求库，可以用于浏览器和 node.js', 
    'https://www.axios-http.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","JavaScript","Node.js"]', 
    1, 
    'active', 
    '2023-05-23T10:40:31.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Vue 2.0文档', 
    'https://v2.cn.vuejs.org/v2/guide/installation.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Vue"]', 
    1, 
    'active', 
    '2023-05-23T10:24:05.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Vue.js 教程 | 菜鸟教程', 
    'https://www.runoob.com/vue2/vue-tutorial.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","JavaScript","Vue"]', 
    1, 
    'active', 
    '2023-05-24T06:07:56.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Element - 网站快速成型工具', 
    'https://element.eleme.cn/#/zh-CN', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2023-05-23T10:35:18.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Tailwind CSS - 只需书写 HTML 代码，无需书写 CSS，即可快速构建美观的网站。 | TailwindCSS中文文档 | TailwindCSS中文网', 
    'https://www.tailwindcss.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","CSS","HTML"]', 
    1, 
    'active', 
    '2023-07-10T08:00:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Sass基础教程 Sass快速入门 Sass中文手册 | Sass中文网', 
    'https://www.sass.hk/guide/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-07-24T10:57:25.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '网易云音乐 NodeJS 版 API', 
    'https://binaryify.github.io/NeteaseCloudMusicApi/#/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","JavaScript","Node.js","API"]', 
    1, 
    'active', 
    '2023-06-02T08:52:34.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Redis Desktop Manager 0.9.3 版本下载（官方最新版需要订阅，好像要给钱才行）_cqwshzj的博客-CSDN博客', 
    'https://blog.csdn.net/u012688704/article/details/82251338', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务","CSDN"]', 
    1, 
    'active', 
    '2023-08-11T13:02:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'PPT模板_PPT模版免费下载_免费PPT模板下载 -【第一PPT】', 
    'http://www.1ppt.com/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2021-11-21T04:41:25.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '党建PPT模板_党建工作PPT模板背景图片下载_2 - 优品PPT', 
    'https://www.ypppt.com/moban/dangjian/list-2.html', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2021-11-13T11:58:34.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub中文社区', 
    'https://www.githubs.cn/', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2021-11-13T11:57:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '中国大学MOOC(慕课)_国家精品课程在线学习平台', 
    'https://www.icourse163.org/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-13T11:53:35.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - iptv-org/iptv：来自世界各地的公开IPTV频道的集合', 
    'https://github.com/iptv-org/iptv', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2022-02-02T07:14:52.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - forthespada/CS-Books: 🔥🔥超过1000本的计算机经典书籍、个人笔记资料以及本人在各平台发表文章中所涉及的资源等。书籍资源包括C/C++、Java、Python、Go语言、数据结构与算法、操作系统、', 
    'https://github.com/forthespada/CS-Books#05%E3%80%81%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Python","Java","Git"]', 
    1, 
    'active', 
    '2022-02-15T03:09:59.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Hexo博客美化', 
    'https://github.com/blinkfox/hexo-theme-matery/blob/develop/README_CN.md', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源"]', 
    1, 
    'active', 
    '2022-02-15T10:19:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Dashboard | Khan Academy', 
    'https://www.khanacademy.org/profile/me/courses', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2022-02-28T12:06:56.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '计算机等级考试软件下载', 
    'http://www.wyk8.com/main/appdownload.aspx', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2022-03-10T13:47:17.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Python基本语法,让我们轻松入门学习Python!_QZP51ZX的博客-CSDN博客', 
    'https://blog.csdn.net/QZP51ZX/article/details/108689001', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Python","CSDN"]', 
    1, 
    'active', 
    '2022-03-15T05:46:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '001 课程简介，C# 语言简介，开发环境准备 · 语雀', 
    'https://www.yuque.com/yuejiangliu/dotnet/timothy-csharp-001', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2022-03-31T09:40:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'if __name__ == &#39;__main__&#39;：的作用和原理【转】 - 楚千羽 - 博客园', 
    'https://www.cnblogs.com/chuqianyu/p/14227392.html', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2022-04-07T06:16:20.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '「学习笔记」HTML基础', 
    'https://mp.weixin.qq.com/s/lNkLbVL8qWsay8c3krVL8A', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","HTML"]', 
    1, 
    'active', 
    '2022-04-07T09:27:13.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'c# .net,中文手册,在线手册 - 脚本之家', 
    'http://shouce.jb51.net/net/index.html', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2022-04-09T13:12:17.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '爬虫学习笔记（五）——VMGIRLS唯美小姐姐的图片不让爬了，怎么办？_咚宝学编程的博客-CSDN博客', 
    'https://blog.csdn.net/knight0113/article/details/113692350', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","CSDN"]', 
    1, 
    'active', 
    '2022-04-13T16:31:09.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '在线正则表达式测试', 
    'https://www.w3cschool.cn/tools/index?name=reg', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2022-04-17T08:52:18.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - labuladong/fucking-algorithm: 刷算法全靠套路，认准 labuladong 就够了！English version supported! Crack LeetCode, not only how', 
    'https://github.com/labuladong/fucking-algorithm', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2022-04-20T06:34:41.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Releases · icsharpcode/ILSpy · GitHub', 
    'https://github.com/icsharpcode/ILSpy/releases', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2022-04-21T08:44:51.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '智慧职教MOOC学院', 
    'https://mooc.icve.com.cn/study/myCourse/myCourse.html?courseOpenId=4hxsavmuuofik5wn8vfmuw', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2022-05-05T13:32:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - hsjzhcq/hcqHome: 简单好用的刷课脚本[支持平台:职教云,智慧职教]', 
    'https://github.com/hsjzhcq/hcqHome', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2022-05-05T14:08:49.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub - jackfrued/Python-100-Days: Python - 100天从新手到大师', 
    'https://github.com/jackfrued/Python-100-Days', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Python","Git"]', 
    1, 
    'active', 
    '2022-05-09T11:31:41.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'ToDesk远程控制软件-免费安全流畅的远程连接电脑手机', 
    'https://www.todesk.com/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2022-05-15T11:47:59.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '博客园 - 开发者的网上家园', 
    'https://www.cnblogs.com/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2022-05-21T08:48:30.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '中国大学MOOC(慕课)_国家精品课程在线学习平台', 
    'https://www.icourse163.org/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-10-01T06:26:04.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '多邻国 - 学习外语的最佳途径', 
    'https://www.duolingo.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-09-29T04:33:22.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 文档 - 入门、教程、参考。 | Microsoft Docs', 
    'https://docs.microsoft.com/zh-cn/dotnet/csharp/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-09-28T14:16:05.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub · GitHub', 
    'https://github.com/github', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2021-09-24T13:01:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub中文社区', 
    'https://www.githubs.cn/', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2021-09-24T13:01:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '(1封未读) 网易邮箱6.0版', 
    'https://mail.163.com/js6/main.jsp?sid=vAsZXJrLcpfoWHGHhNLLbchBLRewVWAY&df=unknow#module=welcome.WelcomeModule%7C%7B%7D', 
    '邮箱和通讯服务', 
    3, 
    '["邮箱","通讯"]', 
    1, 
    'active', 
    '2021-09-24T13:00:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Office 卸载/安装/激活 教程 - ✌啵啵のBlog✌', 
    'https://xiaobo.icu/archives/office%E5%8D%B8%E8%BD%BD%E5%AE%89%E8%A3%85%E6%BF%80%E6%B4%BB%E6%95%99%E7%A8%8B', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '1970-01-01T00:00:00.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '解决git@github.com: Permission denied (publickey). Could not read from remote repository_ywl470812087的博客-CSDN博客', 
    'https://blog.csdn.net/ywl470812087/article/details/104459288', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git","CSDN"]', 
    1, 
    'active', 
    '2021-09-25T13:13:38.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'NCRE - 中国教育考试网', 
    'http://ncre.neea.edu.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-10-04T04:03:54.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 教程 | 菜鸟教程', 
    'https://www.runoob.com/csharp/csharp-tutorial.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-10-12T11:30:31.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '驱动下载 - 机械师MACHENIKE官网-机械师笔记本,机械师游戏本,机械师台式机,游戏本,笔记本电脑,M7鼠标,K7键盘', 
    'https://www.machenike.com/offline/driverUnit', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2021-10-19T12:46:37.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '党建PPT模板_党建工作PPT模板背景图片下载_2 - 优品PPT', 
    'https://www.ypppt.com/moban/dangjian/list-2.html', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2021-10-23T06:47:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '大学计算机——计算思维之路_北京交通大学_中国大学MOOC(慕课)', 
    'https://www.icourse163.org/course/NJTU-196001', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-09T14:02:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '中国大学MOOC(慕课)_国家精品课程在线学习平台', 
    'https://www.icourse163.org/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-10-01T06:26:04.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '多邻国 - 学习外语的最佳途径', 
    'https://www.duolingo.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-09-29T04:33:22.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 文档 - 入门、教程、参考。 | Microsoft Docs', 
    'https://docs.microsoft.com/zh-cn/dotnet/csharp/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-09-28T14:16:05.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub · GitHub', 
    'https://github.com/github', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2021-09-24T13:01:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'GitHub中文社区', 
    'https://www.githubs.cn/', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git"]', 
    1, 
    'active', 
    '2021-09-24T13:01:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '(1封未读) 网易邮箱6.0版', 
    'https://mail.163.com/js6/main.jsp?sid=vAsZXJrLcpfoWHGHhNLLbchBLRewVWAY&df=unknow#module=welcome.WelcomeModule%7C%7B%7D', 
    '邮箱和通讯服务', 
    3, 
    '["邮箱","通讯"]', 
    1, 
    'active', 
    '2021-09-24T13:00:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Office 卸载/安装/激活 教程 - ✌啵啵のBlog✌', 
    'https://xiaobo.icu/archives/office%E5%8D%B8%E8%BD%BD%E5%AE%89%E8%A3%85%E6%BF%80%E6%B4%BB%E6%95%99%E7%A8%8B', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '1970-01-01T00:00:00.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '解决git@github.com: Permission denied (publickey). Could not read from remote repository_ywl470812087的博客-CSDN博客', 
    'https://blog.csdn.net/ywl470812087/article/details/104459288', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","Git","CSDN"]', 
    1, 
    'active', 
    '2021-09-25T13:13:38.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'NCRE - 中国教育考试网', 
    'http://ncre.neea.edu.cn/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-10-04T04:03:54.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'C# 教程 | 菜鸟教程', 
    'https://www.runoob.com/csharp/csharp-tutorial.html', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-10-12T11:30:31.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '驱动下载 - 机械师MACHENIKE官网-机械师笔记本,机械师游戏本,机械师台式机,游戏本,笔记本电脑,M7鼠标,K7键盘', 
    'https://www.machenike.com/offline/driverUnit', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2021-10-19T12:46:37.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '党建PPT模板_党建工作PPT模板背景图片下载_2 - 优品PPT', 
    'https://www.ypppt.com/moban/dangjian/list-2.html', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2021-10-23T06:47:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '大学计算机——计算思维之路_北京交通大学_中国大学MOOC(慕课)', 
    'https://www.icourse163.org/course/NJTU-196001', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2021-11-09T14:02:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '高清电影网|高清电影下载|720P|1080P|蓝光原盘|磁力链迅雷下载的电影天堂', 
    'https://www.gaoqingw.com/', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2022-10-21T11:37:04.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '奈飞工厂-（原鸭奈飞影视YaNetflix.com）一个致力于免费提供Netflix影剧动漫的流媒体播放平台–奈飞工厂 NetflixGC | NetflixGC.com', 
    'https://www.netflixgc.com/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2024-04-23T03:35:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'B站下载工具', 
    'http://zhouql.vip/bilibili/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2023-09-04T11:03:10.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '在线 PDF 编辑 - 100% 免费', 
    'https://onlinepdfedit.com/zh-cn/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2024-11-07T09:39:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '夸克网盘分享', 
    'https://pan.quark.cn/s/1098bac9b56e#/list/share', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2024-11-26T16:03:37.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'OAIPro API', 
    'https://api.oaipro.com/playground', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2024-11-27T11:00:16.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '零成本搭建自己的在线GPT-Sovits语音合成平台 - 资源荟萃 / 资源荟萃, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/265451', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","TypeScript","Linux"]', 
    1, 
    'active', 
    '2024-11-28T02:15:49.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Fuclaude 食用指南 - 文档共建 - LINUX DO', 
    'https://linux.do/t/topic/136358/73', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2024-11-28T02:40:13.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '2024-12月最新免费共享小火箭账号/已购shadowrocket共享Apple ID，小火箭账号购买，美区小火箭', 
    'https://ccbaohe.com/appleID/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2025-01-20T05:44:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'React Bits - 动画', 
    'https://www.reactbits.dev/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","TypeScript","React"]', 
    1, 
    'active', 
    '2025-02-12T05:14:55.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '云萌 Windows 10+ 激活工具 - 首页', 
    'https://cmwtat.cloudmoe.com/cn.html', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2025-02-21T03:43:40.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Mailu-Admin | LINUX DO Mail', 
    'https://webmail.linux.do/admin/user/settings', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能","Linux"]', 
    1, 
    'active', 
    '2025-02-24T05:52:48.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'iOS微信双开教程（自签） - Taosky 的博客', 
    'https://taosky.org/story/ios-dual-wechat/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-03-11T05:27:38.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'ETEST 通行证 - 主页', 
    'https://passport.neea.edu.cn/Manage/Index?see=1', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-03-14T12:03:47.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '北京科技大学信息化建设与管理办公室', 
    'https://info.ustb.edu.cn/ITxy/cylj/b77b2476c54345e698c934655ef836ca.htm', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-03-15T16:28:08.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '欢迎使用CET考试报名系统', 
    'https://cet-bm.neea.edu.cn/Student/Index', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-03-14T12:10:25.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '新年安全体检计划', 
    'https://developer.aliyun.com/topic/security/examination?spm=5176.29872334.0.0.950b154affeJhQ#J_4097294620', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2025-03-19T11:31:41.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Cursor 版本历史下载', 
    'https://cursor-versions.xswl.us/?lang=zh-CN', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2025-03-20T11:01:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'AAA临时域名', 
    'https://mail.lkkk.eu.org/', 
    '网络服务和基础设施', 
    6, 
    '["网络","服务"]', 
    1, 
    'active', 
    '2025-04-02T03:24:05.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Settings | Cursor - The AI Code Editor', 
    'https://www.cursor.com/ja/settings', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-04-02T03:24:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Grok 2 Image 图像生成 MCP Server - 开发调优 - LINUX DO', 
    'https://linux.do/t/topic/532003/4', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux"]', 
    1, 
    'active', 
    '2025-04-03T16:33:21.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'bestK/tv', 
    'https://github.com/bestK/tv', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源"]', 
    1, 
    'active', 
    '2025-04-06T15:27:14.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'justlovemaki/CloudFlare-AI-Image: 基于Cloudflare Worker的AI图片生成脚本', 
    'https://github.com/justlovemaki/CloudFlare-AI-Image', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源"]', 
    1, 
    'active', 
    '2025-04-10T16:39:23.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '一文彻底搞懂 MCP：AI 大模型的标准化工具箱 - 文档共建 - LINUX DO', 
    'https://linux.do/t/topic/543257', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2025-04-10T16:39:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'CSDN文章解锁工具', 
    'https://csdn.zeroai.chat/', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-04-16T05:27:58.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '国家普通话水平测试在线报名系统', 
    'https://bm.cltt.org/#/personal-center', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2025-04-17T07:04:22.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'JIEKE66633/One-click-cleaning-of-C-drive: 只需轻松一点，即可安全高效的清理C盘残留和垃圾，并且对电脑毫无危险', 
    'https://github.com/JIEKE66633/One-click-cleaning-of-C-drive', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源"]', 
    1, 
    'active', 
    '2025-04-19T16:23:58.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Sora', 
    'https://sora.chatgpt.com/explore', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-04-19T17:03:24.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'FreeAI Playground - Chat for Free with Advanced AI Models', 
    'https://freeaichatplayground.com/chat', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能","免费"]', 
    1, 
    'active', 
    '2025-04-19T17:07:19.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'API Proxy Service', 
    'https://api-proxy.me/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2025-04-19T17:23:07.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Unlimited AI Chat - AI Without Limits | No Login Required | Free Forever', 
    'https://app.unlimitedai.chat/chat/d8c7d190-1daa-4dd4-b777-7c2d857007c5', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能","TypeScript","免费"]', 
    1, 
    'active', 
    '2025-04-25T16:30:14.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'MoeMail - 萌萌哒临时邮箱服务', 
    'https://mail.blny.de/moe', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-05-02T04:32:10.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '引言 - Mix Space 文档', 
    'https://mx-space.js.org/docs/core', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-05-03T08:50:15.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Grok', 
    'https://grok.be-a.dev/admin', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2025-05-07T05:26:39.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '用户仪表盘 - 二级域名分发', 
    'https://regdm.edu.deal/dashboard', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-05-13T11:15:34.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '中国教师资格网—服务台', 
    'https://sso1.jszg.edu.cn/sso/desktop/index.html?t=1747925118000', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-05-22T14:47:58.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'v0 by Vercel', 
    'https://v0.dev/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2025-05-27T14:10:10.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Linux.do CDK分发平台 - 首页', 
    'https://linux.edu.com.lv/?filter=available', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2025-05-28T15:50:29.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '谷歌新号拉低风控到极致，保姆级养号全流程教程 - 开发调优 / 开发调优, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/501669', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2025-05-28T16:01:31.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '谷歌新号拉低风控到极致，保姆级养号全流程教程 - 开发调优 / 开发调优, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/684018/20', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2025-05-28T16:01:35.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Semipage - Code. Create. Share.', 
    'https://semipage.deno.dev/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2025-05-28T17:06:31.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Linux.do CDK分发平台 - 首页', 
    'https://linux.edu.com.lv/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2025-06-03T08:22:24.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Cloudflare 临时邮件', 
    'https://stu.hua.edu.kg/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-06-06T10:48:17.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '无限制免费调用API-无审🚫更新非思考模型-6/6依旧窜稀响应/. - 资源荟萃 - LINUX DO', 
    'https://linux.do/t/topic/648179', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux","API","免费"]', 
    1, 
    'active', 
    '2025-06-07T11:13:03.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'University of Iverness', 
    'https://tmail.ui.edu.kg/user', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-06-08T10:56:56.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '【AI平权-授人以渔 14】一天两更，全模型，支持多模态 （claude-opus-4，gpt-4.5-preview， o3-mini-high， ...） - 开发调优 / 开发调优, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/710276', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux"]', 
    1, 
    'active', 
    '2025-06-08T15:36:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '2Api! 苍白 Vol. 04 | ChatBetter Deno - 开发调优 / 开发调优, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/710367', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux","API"]', 
    1, 
    'active', 
    '2025-06-08T15:39:58.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'iFixit：免费修理手册', 
    'https://zh.ifixit.com/', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","免费"]', 
    1, 
    'active', 
    '2025-06-08T17:07:28.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'tbphp/gpt-load: 一个高性能的OpenAI格式API多密钥轮询代理服务器，支持负载均衡，使用 Go 语言开发。A high-performance OpenAI-compatible API proxy server with', 
    'https://github.com/tbphp/gpt-load?tab=readme-ov-file', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","API"]', 
    1, 
    'active', 
    '2025-06-09T09:29:07.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'CloudFlare自建长久自用节点（自用） - 开发调优 / 开发调优, Lv2 - LINUX DO', 
    'https://linux.do/t/topic/656503', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux"]', 
    1, 
    'active', 
    '2025-06-09T09:45:01.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'MoeMail - 萌萌哒临时邮箱服务', 
    'https://mail.eleme.uk/profile', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-06-13T09:39:12.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'FAST PRO api', 
    'https://linjinpeng-veloera.hf.space/token', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2025-06-15T06:22:27.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '(3) 收件箱 | cikey01@proton.me | Proton Mail', 
    'https://mail.proton.me/u/0/inbox', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-06-18T14:04:56.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '收件箱 - Yoko', 
    'https://email-web-app.j3.workers.dev/', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2025-06-20T11:08:09.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '🪐L站福利及项目信息汇总【第一篇】（不定时更新） - 文档共建 / 文档共建, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/487682', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2025-06-20T11:10:05.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '[第二弹]再来一波不太被检测的临时邮箱 - 资源荟萃 / 资源荟萃, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/704073', 
    '邮箱和通讯服务', 
    3, 
    '["邮箱","通讯","Linux"]', 
    1, 
    'active', 
    '2025-06-20T11:11:13.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '【AI平权-授人以渔 22】yupp2api 全模型，全自动领取赠金 （什么情况，怎么越用越多啊牢弟？根本用不完...） - 开发调优 / 开发调优, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/735958/19', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux","API"]', 
    1, 
    'active', 
    '2025-06-20T11:35:16.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '【AI平权-授人以渔 22】yupp2api 全模型，全自动领取赠金 （什么情况，怎么越用越多啊牢弟？根本用不完...） - 开发调优 / 开发调优, Lv1 - LINUX DO', 
    'https://linux.do/t/topic/735958', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux","API"]', 
    1, 
    'active', 
    '2025-06-20T16:47:32.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'VoAPI', 
    'https://voapi.srczlrzh.xyz/token', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2025-06-21T13:37:23.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '基于Cloudflare的在线文本/大文件分享平台，支持多种语法 Markdown 渲染、阅后即焚、R2~B2等S3聚合存储、密码保护等功能，可作为WebDav挂载，支持Docker部署。 - 开发调优 - LINUX DO', 
    'https://linux.do/t/topic/528527', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Docker","Linux"]', 
    1, 
    'active', 
    '2025-06-22T17:14:49.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '网易云会员卡链接生成检测脚本 - 开发调优 / 开发调优, Lv2 - LINUX DO', 
    'https://linux.do/t/topic/743355/9', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux"]', 
    1, 
    'active', 
    '2025-06-22T17:17:50.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '给小白的恢复perplexity 教程 保姆级 保证你没有问题，醍醐灌顶! - 福利羊毛 / 福利羊毛, Lv2 - LINUX DO', 
    'https://linux.do/t/topic/743712', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","Linux"]', 
    1, 
    'active', 
    '2025-06-22T18:54:34.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Mermaid 中文网', 
    'https://mermaid.nodejs.cn/', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-06-24T16:00:57.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'senshinya/MoonTV', 
    'https://github.com/senshinya/MoonTV', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源"]', 
    1, 
    'active', 
    '2025-06-24T17:57:25.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'education email', 
    'https://education.edu.kg/', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-06-27T08:50:19.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '4. 优秀简历参考 - 程序员鱼皮写简历指南(保姆级) - 编程导航教程', 
    'https://www.codefather.cn/course/1802644557818343425/section/1802644847023992834#heading-2', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-07-01T11:54:39.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '基于信誉域名的优选IP工具 - 资源荟萃 - LINUX DO', 
    'https://linux.do/t/topic/776711', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","Linux"]', 
    1, 
    'active', 
    '2025-07-09T15:55:09.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Notion AI', 
    'https://www.notion.so/chat?t=22da39eba05f8026a92300a948991048', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2025-07-11T17:13:09.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '从零开始，搭建一个属于你自己的微信消息推送服务 - 开发调优 - LINUX DO', 
    'https://linux.do/t/topic/770848', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","Linux"]', 
    1, 
    'active', 
    '2025-07-12T05:33:57.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Dashboard', 
    'https://mail.mmc.edu.kg/dashboard', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2025-07-12T17:53:41.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Nyxar API', 
    'https://api.nyxar.org/console/token', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2025-07-13T05:21:41.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'OJ System Development Tips', 
    'https://chat.openai.com/c/ba3795c6-937a-461d-8095-9bad368e7333', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-11-19T15:11:13.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Yu-Judge-Core 用户文档 - 飞书云文档', 
    'https://yuzhanglong.feishu.cn/wiki/wikcnb46K9AS8P42aEFxxTKVmac', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-11-19T15:11:11.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'MySQL安装教程（详细）_花北城的博客-CSDN博客', 
    'https://blog.csdn.net/youcheng_ge/article/details/126037520', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程","CSDN"]', 
    1, 
    'active', 
    '2023-11-20T06:00:59.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'ChatGPT', 
    'https://chat.openai.com/c/a55b05ef-95a2-4a03-88fb-fdceff3f1db5', 
    'AI工具和人工智能应用', 
    4, 
    '["AI","人工智能"]', 
    1, 
    'active', 
    '2023-11-20T16:42:44.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'judge0-ce.p.rapidapi.com/submissions/8b53d738-bce3-4657-b403-e4a1d08c6dfa', 
    'https://judge0-ce.p.rapidapi.com/submissions/8b53d738-bce3-4657-b403-e4a1d08c6dfa', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2023-11-13T17:30:55.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Judge0 CE API Documentation (judge0-official) | RapidAPI', 
    'https://rapidapi.com/judge0-official/api/judge0-ce', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具","API"]', 
    1, 
    'active', 
    '2023-11-13T17:30:52.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '我的开发测试', 
    'https://oj.lpoj.cn/problemdetail?problemID=5815', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2023-11-09T12:50:21.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '引言 | LPOJ 文档', 
    'https://docs.lpoj.cn/faq/#%E4%BB%80%E4%B9%88%E6%98%AFlpoj%EF%BC%9F', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-11-09T12:50:24.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '在线评测系统中判题机的设计与实现', 
    'https://d.wanfangdata.com.cn/periodical/wxhlkj202206035', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线"]', 
    1, 
    'active', 
    '2023-11-15T14:57:10.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '怎样做一个 Online Judge（在线评测系统）？ - 知乎', 
    'https://www.zhihu.com/question/20343652/answer/1595729982?utm_id=0', 
    '实用的在线工具和服务', 
    5, 
    '["工具","在线","知乎"]', 
    1, 
    'active', 
    '2023-11-15T14:57:34.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'CodeSky 代码在线评测系统', 
    'https://www.nextstepcode.club/main', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2023-11-15T14:57:37.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'lengling06/OpenJudger: A lightweight⚡high performance💪universal🍭program judger, support multiple languages, special ju', 
    'https://github.com/lengling06/OpenJudger', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源"]', 
    1, 
    'active', 
    '2023-11-16T07:20:47.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'yuzhanglong/YuJudge: 💡 An online judge system based on React &amp; TypeScript, with complete secondary development docu', 
    'https://github.com/yuzhanglong/YuJudge', 
    'GitHub开源项目和代码仓库', 
    2, 
    '["GitHub","开源","TypeScript","React"]', 
    1, 
    'active', 
    '2023-11-16T07:20:51.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '针对服务端的二次开发 | YuJudge', 
    'https://yu-judge.vercel.app/judgeServerDevelop', 
    '开发工具和编程资源', 
    2, 
    '["开发","工具"]', 
    1, 
    'active', 
    '2023-11-18T11:41:42.000Z', 
    datetime('now')
);
INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    'Yu-Judge-Core 用户文档 - 飞书云文档', 
    'https://yuzhanglong.feishu.cn/wiki/wikcnb46K9AS8P42aEFxxTKVmac', 
    '优质学习教程和技术文档', 
    1, 
    '["学习","教程"]', 
    1, 
    'active', 
    '2023-11-18T11:41:47.000Z', 
    datetime('now')
);
