import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取处理后的书签数据
const bookmarksPath = path.join(__dirname, '../processed_bookmarks.json');
const bookmarksData = JSON.parse(fs.readFileSync(bookmarksPath, 'utf8'));

console.log('🚀 开始导入书签到数据库...');
console.log('📊 总计:', bookmarksData.length, '个书签');

// 分类映射
const categoryMap = {
    '学习资源': 'Study',
    '开发工具': 'Development', 
    'AI工具': 'AI',
    '实用工具': 'Tools',
    '网络服务': 'Network',
    '邮箱服务': 'Email',
    '娱乐': 'Entertainment',
    'Others': 'Others'
};

// 统计分类
const categoryStats = {};
bookmarksData.forEach(bookmark => {
    const category = categoryMap[bookmark.category] || bookmark.category;
    categoryStats[category] = (categoryStats[category] || 0) + 1;
});

console.log('\n📈 分类统计:');
Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} 个书签`);
});

// 生成SQL导入脚本
let sql = `-- 书签管理系统数据导入脚本
-- 生成时间: ${new Date().toISOString()}
-- 总书签数: ${bookmarksData.length}

-- 清理现有数据（可选，谨慎使用）
-- DELETE FROM bookmarks;
-- DELETE FROM categories;

-- 插入分类数据
`;

// 插入分类
const categories = [...new Set(bookmarksData.map(b => categoryMap[b.category] || b.category))];
categories.forEach((category, index) => {
    const descriptions = {
        'Study': '学习资源和教程文档',
        'Development': '开发工具和编程资源',
        'AI': 'AI工具和人工智能应用',
        'Tools': '实用工具和在线服务',
        'Network': '网络服务和基础设施',
        'Email': '邮箱和通讯服务',
        'Entertainment': '娱乐和多媒体内容',
        'Others': '其他未分类资源'
    };
    
    sql += `INSERT OR IGNORE INTO categories (id, name, description, sort_order, created_at, updated_at) 
VALUES (${index + 1}, '${category}', '${descriptions[category] || category + '相关资源'}', ${index}, datetime('now'), datetime('now'));\n`;
});

sql += '\n-- 插入书签数据\n';

// 插入书签
bookmarksData.forEach((bookmark, index) => {
    const categoryId = categories.indexOf(categoryMap[bookmark.category] || bookmark.category) + 1;
    const title = bookmark.title.replace(/'/g, "''");
    const url = bookmark.url.replace(/'/g, "''");
    const description = (bookmark.description || '').replace(/'/g, "''");
    const tags = JSON.stringify(bookmark.tags || []).replace(/'/g, "''");
    
    sql += `INSERT OR IGNORE INTO bookmarks (
    title, url, description, category_id, tags, 
    is_active, status, created_at, updated_at
) VALUES (
    '${title}', 
    '${url}', 
    '${description}', 
    ${categoryId}, 
    '${tags}', 
    1, 
    'active', 
    '${bookmark.addDate}', 
    datetime('now')
);\n`;
});

// 保存SQL文件
const sqlPath = path.join(__dirname, '../import_bookmarks.sql');
fs.writeFileSync(sqlPath, sql, 'utf8');

console.log('\n✅ SQL导入脚本已生成:', sqlPath);
console.log('📝 使用方法:');
console.log('  1. 在数据库管理工具中执行此SQL文件');
console.log('  2. 或者使用命令: sqlite3 your_database.db < import_bookmarks.sql');

// 生成API导入格式的JSON
const apiImportData = {
    categories: categories.map((name, index) => ({
        id: index + 1,
        name,
        description: {
            'Study': '学习资源和教程文档',
            'Development': '开发工具和编程资源', 
            'AI': 'AI工具和人工智能应用',
            'Tools': '实用工具和在线服务',
            'Network': '网络服务和基础设施',
            'Email': '邮箱和通讯服务',
            'Entertainment': '娱乐和多媒体内容',
            'Others': '其他未分类资源'
        }[name] || name + '相关资源',
        sortOrder: index
    })),
    bookmarks: bookmarksData.map(bookmark => ({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || '',
        category: categoryMap[bookmark.category] || bookmark.category,
        tags: bookmark.tags || [],
        importance: bookmark.importance || 3,
        addDate: bookmark.addDate
    }))
};

const apiJsonPath = path.join(__dirname, '../api_import_data.json');
fs.writeFileSync(apiJsonPath, JSON.stringify(apiImportData, null, 2), 'utf8');

console.log('📦 API导入数据已生成:', apiJsonPath);
console.log('🎯 可以通过管理后台的导入功能使用此文件');

console.log('\n🎉 导入准备完成！');