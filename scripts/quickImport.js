import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const API_BASE = 'http://localhost:8787/api'; // 本地开发API地址
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // 请根据实际情况修改

console.log('🚀 开始快速导入书签数据...');

// 读取API导入数据
const apiDataPath = path.join(__dirname, '../api_import_data.json');
const apiData = JSON.parse(fs.readFileSync(apiDataPath, 'utf8'));

console.log('📊 数据统计:');
console.log(`  分类数: ${apiData.categories.length}`);
console.log(`  书签数: ${apiData.bookmarks.length}`);

async function quickImport() {
    try {
        // 1. 管理员登录获取token
        console.log('\n🔐 正在登录管理员账户...');
        const loginResponse = await fetch(`${API_BASE}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`登录失败: ${loginResponse.status} ${loginResponse.statusText}`);
        }

        const loginResult = await loginResponse.json();
        if (!loginResult.success) {
            throw new Error(`登录失败: ${loginResult.error?.message || '未知错误'}`);
        }

        const token = loginResult.data.token;
        console.log('✅ 登录成功');

        // 2. 创建分类
        console.log('\n📁 正在创建分类...');
        const categoryMap = new Map();

        for (const category of apiData.categories) {
            try {
                const categoryResponse = await fetch(`${API_BASE}/admin/categories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: category.name,
                        description: category.description,
                        sortOrder: category.sortOrder
                    })
                });

                const categoryResult = await categoryResponse.json();
                if (categoryResult.success) {
                    categoryMap.set(category.name, categoryResult.data.id);
                    console.log(`  ✅ 创建分类: ${category.name}`);
                } else {
                    // 可能分类已存在，尝试获取现有分类
                    const existingResponse = await fetch(`${API_BASE}/admin/categories`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const existingResult = await existingResponse.json();
                    if (existingResult.success) {
                        const existing = existingResult.data.find((c: any) => c.name === category.name);
                        if (existing) {
                            categoryMap.set(category.name, existing.id);
                            console.log(`  ℹ️  分类已存在: ${category.name}`);
                        }
                    }
                }
            } catch (error) {
                console.error(`  ❌ 创建分类失败 ${category.name}:`, error);
            }
        }

        // 3. 批量导入书签
        console.log('\n📚 正在导入书签...');
        
        // 分批处理，每批50个
        const batchSize = 50;
        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < apiData.bookmarks.length; i += batchSize) {
            const batch = apiData.bookmarks.slice(i, i + batchSize);
            console.log(`  📦 处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(apiData.bookmarks.length / batchSize)} (${batch.length} 个书签)`);

            for (const bookmark of batch) {
                try {
                    const categoryId = categoryMap.get(bookmark.category);
                    if (!categoryId) {
                        console.warn(`  ⚠️  未找到分类 ${bookmark.category}，跳过书签: ${bookmark.title}`);
                        failedCount++;
                        continue;
                    }

                    const bookmarkResponse = await fetch(`${API_BASE}/admin/bookmarks`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            title: bookmark.title,
                            url: bookmark.url,
                            description: bookmark.description,
                            categoryId: categoryId,
                            tags: bookmark.tags || []
                        })
                    });

                    const bookmarkResult = await bookmarkResponse.json();
                    if (bookmarkResult.success) {
                        successCount++;
                    } else {
                        console.warn(`  ⚠️  导入书签失败: ${bookmark.title} - ${bookmarkResult.error?.message}`);
                        failedCount++;
                    }
                } catch (error) {
                    console.error(`  ❌ 导入书签异常: ${bookmark.title}`, error);
                    failedCount++;
                }
            }

            // 批次间稍作延迟，避免过载
            if (i + batchSize < apiData.bookmarks.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log('\n🎉 导入完成！');
        console.log(`✅ 成功导入: ${successCount} 个书签`);
        console.log(`❌ 失败: ${failedCount} 个书签`);
        console.log(`📊 成功率: ${((successCount / (successCount + failedCount)) * 100).toFixed(1)}%`);

    } catch (error) {
        console.error('💥 导入过程中发生错误:', error);
        process.exit(1);
    }
}

// 执行导入
quickImport().then(() => {
    console.log('\n🏁 导入脚本执行完成');
    process.exit(0);
}).catch(error => {
    console.error('💥 脚本执行失败:', error);
    process.exit(1);
});