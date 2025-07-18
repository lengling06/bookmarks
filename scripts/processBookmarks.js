import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取书签HTML文件
const bookmarksPath = path.join(__dirname, '../bookmarks_2025_7_15.html');
const bookmarksHtml = fs.readFileSync(bookmarksPath, 'utf8');

console.log('🚀 开始处理书签文件...');
console.log('📄 文件大小:', (bookmarksHtml.length / 1024).toFixed(1), 'KB');

// 解析HTML并提取书签
const bookmarks = [];
const lines = bookmarksHtml.split('\n');

let currentFolder = '未分类';
let folderStack = []; // 用于处理嵌套文件夹

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 检测文件夹开始
    if (line.includes('<H3') && line.includes('>')) {
        const folderMatch = line.match(/>([^<]+)</);
        if (folderMatch) {
            const folderName = folderMatch[1].trim();
            // 跳过"书签栏"这种顶级文件夹
            if (folderName !== '书签栏') {
                folderStack.push(currentFolder);
                currentFolder = folderName;
            }
        }
    }

    // 检测文件夹结束
    if (line.includes('</DL>') && folderStack.length > 0) {
        currentFolder = folderStack.pop();
    }

    // 检测书签
    if (line.includes('<A HREF=')) {
        const urlMatch = line.match(/HREF="([^"]+)"/);
        const titleMatch = line.match(/>([^<]+)</);
        const iconMatch = line.match(/ICON="([^"]+)"/);
        const dateMatch = line.match(/ADD_DATE="([^"]+)"/);

        if (urlMatch && titleMatch) {
            const url = urlMatch[1];
            const title = titleMatch[1];
            const icon = iconMatch ? iconMatch[1] : null;
            const addDate = dateMatch ? new Date(parseInt(dateMatch[1]) * 1000) : new Date();

            // 智能分类和重要性评估
            const analysis = analyzeBookmark(title, url, currentFolder);

            // 只保留重要的书签
            if (analysis.importance >= 3) {
                bookmarks.push({
                    title: title.substring(0, 120), // 适当增加标题长度
                    url,
                    description: analysis.description,
                    category: analysis.category,
                    folder: currentFolder,
                    icon,
                    addDate: addDate.toISOString(),
                    tags: analysis.tags,
                    importance: analysis.importance,
                    favicon: extractFavicon(url, icon)
                });
            }
        }
    }
}

console.log('✅ 解析完成，共找到', bookmarks.length, '个重要书签');

// 智能分析书签函数 - 包含分类、描述生成、标签提取和重要性评估
function analyzeBookmark(title, url, folder) {
    const titleLower = title.toLowerCase();
    const urlLower = url.toLowerCase();

    let category = 'Others';
    let importance = 1; // 1-5分，3分以上保留
    let tags = [];
    let description = '';

    try {
        const domain = new URL(url).hostname.replace('www.', '');

        // 高价值学习资源 (重要性: 5)
        if (titleLower.includes('教程') || titleLower.includes('tutorial') || titleLower.includes('course') ||
            titleLower.includes('文档') || titleLower.includes('docs') || titleLower.includes('学习') ||
            urlLower.includes('edu') || urlLower.includes('course') || urlLower.includes('tutorial') ||
            domain.includes('runoob') || domain.includes('w3school') || domain.includes('mdn')) {
            category = '学习资源';
            importance = 5;
            tags.push('学习', '教程');
            description = '优质学习教程和技术文档';
        }

        // 开发工具和平台 (重要性: 4-5)
        else if (titleLower.includes('github') || urlLower.includes('github.com')) {
            category = '开发工具';
            importance = 5;
            tags.push('GitHub', '开源');
            description = 'GitHub开源项目和代码仓库';
        }
        else if (titleLower.includes('开发') || titleLower.includes('代码') || titleLower.includes('programming') ||
            titleLower.includes('api') || urlLower.includes('stackoverflow') || urlLower.includes('dev') ||
            domain.includes('jetbrains') || domain.includes('vscode')) {
            category = '开发工具';
            importance = 4;
            tags.push('开发', '工具');
            description = '开发工具和编程资源';
        }

        // AI和新技术 (重要性: 5)
        else if (titleLower.includes('ai') || titleLower.includes('chatgpt') || titleLower.includes('人工智能') ||
            titleLower.includes('机器学习') || urlLower.includes('openai') || urlLower.includes('chat')) {
            category = 'AI工具';
            importance = 5;
            tags.push('AI', '人工智能');
            description = 'AI工具和人工智能应用';
        }

        // 实用工具 (重要性: 3-4)
        else if (titleLower.includes('工具') || titleLower.includes('tool') || titleLower.includes('在线') ||
            titleLower.includes('generator') || titleLower.includes('converter') || titleLower.includes('免费')) {
            category = '实用工具';
            importance = 3;
            tags.push('工具', '在线');
            description = '实用的在线工具和服务';
        }

        // 网络服务 (重要性: 3-4)
        else if (titleLower.includes('网盘') || titleLower.includes('下载') || titleLower.includes('加速') ||
            titleLower.includes('vpn') || titleLower.includes('代理') || titleLower.includes('域名') ||
            domain.includes('cloudflare') || domain.includes('vercel')) {
            category = '网络服务';
            importance = 4;
            tags.push('网络', '服务');
            description = '网络服务和基础设施';
        }

        // 邮箱服务 (重要性: 4)
        else if (titleLower.includes('邮箱') || titleLower.includes('mail') || titleLower.includes('gmail') ||
            urlLower.includes('mail') || urlLower.includes('email')) {
            category = '邮箱服务';
            importance = 4;
            tags.push('邮箱', '通讯');
            description = '邮箱和通讯服务';
        }

        // 娱乐内容 (重要性: 2-3，选择性保留)
        else if (titleLower.includes('bilibili') || titleLower.includes('音乐') || titleLower.includes('视频') ||
            urlLower.includes('bilibili') || urlLower.includes('music') || urlLower.includes('video')) {
            category = '娱乐';
            importance = 2; // 大部分娱乐内容不保留
            tags.push('娱乐', '视频');
            description = '娱乐和多媒体内容';

            // 但是一些高质量的学习视频保留
            if (titleLower.includes('教程') || titleLower.includes('学习') || titleLower.includes('课程')) {
                importance = 4;
                category = '学习资源';
                description = '视频教程和学习内容';
            }
        }

        // 根据原始文件夹进一步分类
        if (folder && folder !== '书签栏' && folder !== '未分类') {
            if (folder === 'Study') {
                category = '学习资源';
                importance = Math.max(importance, 4);
            } else if (folder === 'Resource') {
                category = '实用工具';
                importance = Math.max(importance, 3);
            }
        }

        // 提取更多技术标签
        extractTechnicalTags(titleLower, urlLower, tags);

        // 生成更详细的描述
        if (!description) {
            description = generateDetailedDescription(title, domain);
        }

        return {
            category,
            importance,
            tags: [...new Set(tags)].slice(0, 5), // 去重并限制数量
            description
        };

    } catch (e) {
        return {
            category: 'Others',
            importance: 1,
            tags: [],
            description: '网络资源'
        };
    }
}

// 提取技术标签
function extractTechnicalTags(titleLower, urlLower, tags) {
    // 编程语言
    if (titleLower.includes('javascript') || titleLower.includes('js')) tags.push('JavaScript');
    if (titleLower.includes('typescript') || titleLower.includes('ts')) tags.push('TypeScript');
    if (titleLower.includes('python')) tags.push('Python');
    if (titleLower.includes('java') && !titleLower.includes('javascript')) tags.push('Java');
    if (titleLower.includes('react')) tags.push('React');
    if (titleLower.includes('vue')) tags.push('Vue');
    if (titleLower.includes('node')) tags.push('Node.js');
    if (titleLower.includes('css')) tags.push('CSS');
    if (titleLower.includes('html')) tags.push('HTML');
    if (titleLower.includes('docker')) tags.push('Docker');
    if (titleLower.includes('git')) tags.push('Git');
    if (titleLower.includes('linux')) tags.push('Linux');

    // 平台标签
    if (urlLower.includes('github.com')) tags.push('GitHub');
    if (urlLower.includes('bilibili.com')) tags.push('B站');
    if (urlLower.includes('youtube.com')) tags.push('YouTube');
    if (urlLower.includes('zhihu.com')) tags.push('知乎');
    if (urlLower.includes('csdn.net')) tags.push('CSDN');
    if (urlLower.includes('juejin.cn')) tags.push('掘金');

    // 类型标签
    if (titleLower.includes('api')) tags.push('API');
    if (titleLower.includes('免费') || titleLower.includes('free')) tags.push('免费');
    if (titleLower.includes('开源') || titleLower.includes('open source')) tags.push('开源');
}

// 生成详细描述
function generateDetailedDescription(title, domain) {
    // 从标题中提取描述
    if (title.includes(' - ')) {
        const parts = title.split(' - ');
        if (parts.length > 1 && parts[1].length > 10) {
            return parts[1].substring(0, 150);
        }
    }

    if (title.includes(' | ')) {
        const parts = title.split(' | ');
        if (parts.length > 1 && parts[1].length > 10) {
            return parts[1].substring(0, 150);
        }
    }

    // 根据域名生成描述
    const domainDescriptions = {
        'github.com': 'GitHub开源项目和代码仓库',
        'bilibili.com': 'B站视频内容和学习资源',
        'youtube.com': 'YouTube视频教程和内容',
        'zhihu.com': '知乎专业问答和深度文章',
        'csdn.net': 'CSDN技术博客和开发文档',
        'juejin.cn': '掘金前端技术社区',
        'runoob.com': '菜鸟教程编程学习平台',
        'stackoverflow.com': 'Stack Overflow编程问答社区',
        'mdn.mozilla.org': 'MDN Web开发文档',
        'w3school.com.cn': 'W3School在线教程',
        'cloudflare.com': 'Cloudflare云服务平台',
        'vercel.com': 'Vercel前端部署平台'
    };

    for (const [domainKey, desc] of Object.entries(domainDescriptions)) {
        if (domain.includes(domainKey)) {
            return desc;
        }
    }

    return `来自 ${domain} 的优质内容`;
}

// 提取网站图标
function extractFavicon(url, icon) {
    if (icon && icon.startsWith('data:image/')) {
        return icon; // 返回base64图标
    }

    try {
        const domain = new URL(url).origin;
        return `${domain}/favicon.ico`; // 默认favicon路径
    } catch (e) {
        return null;
    }
}

// 生成描述
function generateDescription(title, url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');

        // 如果标题包含描述信息
        if (title.includes(' - ')) {
            const parts = title.split(' - ');
            if (parts.length > 1) {
                return parts[1].substring(0, 200);
            }
        }

        if (title.includes(' | ')) {
            const parts = title.split(' | ');
            if (parts.length > 1) {
                return parts[1].substring(0, 200);
            }
        }

        // 根据域名生成描述
        if (domain.includes('github')) return 'GitHub开源项目或代码仓库';
        if (domain.includes('bilibili')) return 'B站视频内容';
        if (domain.includes('youtube')) return 'YouTube视频内容';
        if (domain.includes('zhihu')) return '知乎问答或文章';
        if (domain.includes('csdn')) return 'CSDN技术博客或文章';
        if (domain.includes('juejin')) return '掘金技术文章';
        if (domain.includes('runoob')) return '菜鸟教程学习资源';

        return `来自 ${domain} 的优质内容`;
    } catch (e) {
        return '实用的网络资源';
    }
}

// 提取标签
function extractTags(title, url) {
    const tags = [];
    const titleLower = title.toLowerCase();
    const urlLower = url.toLowerCase();

    // 技术标签
    if (titleLower.includes('javascript') || titleLower.includes('js')) tags.push('JavaScript');
    if (titleLower.includes('python')) tags.push('Python');
    if (titleLower.includes('java')) tags.push('Java');
    if (titleLower.includes('react')) tags.push('React');
    if (titleLower.includes('vue')) tags.push('Vue');
    if (titleLower.includes('node')) tags.push('Node.js');
    if (titleLower.includes('typescript') || titleLower.includes('ts')) tags.push('TypeScript');
    if (titleLower.includes('css')) tags.push('CSS');
    if (titleLower.includes('html')) tags.push('HTML');
    if (titleLower.includes('docker')) tags.push('Docker');
    if (titleLower.includes('git')) tags.push('Git');

    // 平台标签
    if (urlLower.includes('github.com')) tags.push('GitHub');
    if (urlLower.includes('bilibili.com')) tags.push('B站');
    if (urlLower.includes('youtube.com')) tags.push('YouTube');
    if (urlLower.includes('zhihu.com')) tags.push('知乎');
    if (urlLower.includes('csdn.net')) tags.push('CSDN');

    // 类型标签
    if (titleLower.includes('教程') || titleLower.includes('tutorial')) tags.push('教程');
    if (titleLower.includes('文档') || titleLower.includes('docs')) tags.push('文档');
    if (titleLower.includes('工具') || titleLower.includes('tool')) tags.push('工具');
    if (titleLower.includes('api')) tags.push('API');
    if (titleLower.includes('免费') || titleLower.includes('free')) tags.push('免费');

    return tags.slice(0, 5); // 最多5个标签
}

// 按分类统计
const categoryStats = {};
bookmarks.forEach(bookmark => {
    categoryStats[bookmark.category] = (categoryStats[bookmark.category] || 0) + 1;
});

console.log('\n分类统计:');
Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`${category}: ${count} 个书签`);
});

// 保存处理后的数据
const outputPath = path.join(__dirname, '../processed_bookmarks.json');
fs.writeFileSync(outputPath, JSON.stringify(bookmarks, null, 2), 'utf8');

console.log('\n处理完成！');
console.log('输出文件:', outputPath);
console.log('总计:', bookmarks.length, '个书签');
console.log('分类数:', Object.keys(categoryStats).length);

// 生成导入SQL（可选）
const sqlPath = path.join(__dirname, '../import_bookmarks.sql');
let sql = '-- 书签导入SQL\n\n';

// 先插入分类
const categories = [...new Set(bookmarks.map(b => b.category))];
categories.forEach((category, index) => {
    sql += `INSERT INTO categories (id, name, description, sort_order) VALUES (${index + 1}, '${category}', '${category}分类', ${index}) ON CONFLICT (name) DO NOTHING;\n`;
});

sql += '\n-- 插入书签\n';
bookmarks.forEach((bookmark, index) => {
    const categoryId = categories.indexOf(bookmark.category) + 1;
    const title = bookmark.title.replace(/'/g, "''");
    const description = bookmark.description.replace(/'/g, "''");
    const tags = JSON.stringify(bookmark.tags).replace(/'/g, "''");

    sql += `INSERT INTO bookmarks (title, url, description, category_id, tags, created_at) VALUES ('${title}', '${bookmark.url}', '${description}', ${categoryId}, '${tags}', '${bookmark.addDate}');\n`;
});

fs.writeFileSync(sqlPath, sql, 'utf8');
console.log('SQL文件:', sqlPath);