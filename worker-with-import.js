// 书签管理系统 Worker API - 包含导入功能

// 跨域配置
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// 处理OPTIONS请求
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders(),
  });
}

// 健康检查API
async function handleHealth() {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Bookmark Manager API is running',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    }
  );
}

// 获取分类API
async function handleGetCategories(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        c.id, c.name, c.description, c.sort_order as sortOrder, 
        c.created_at as createdAt, c.updated_at as updatedAt,
        COUNT(b.id) as bookmarkCount
      FROM categories c
      LEFT JOIN bookmarks b ON c.id = b.category_id AND b.is_active = 1
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `).all();

    return new Response(
      JSON.stringify({
        success: true,
        data: results || [],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Categories fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch categories: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 获取分类下的书签API
async function handleGetCategoryBookmarks(env, categoryId, page = 1, limit = 20) {
  try {
    const offset = (page - 1) * limit;
    
    // 获取书签
    const { results: bookmarks } = await env.DB.prepare(`
      SELECT 
        id, title, url, description, category_id as categoryId,
        tags, is_active as isActive, last_checked as lastChecked,
        status, created_at as createdAt, updated_at as updatedAt
      FROM bookmarks
      WHERE category_id = ? AND is_active = 1 AND status = 'active'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(categoryId, limit, offset).all();

    // 获取总数
    const { count } = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM bookmarks
      WHERE category_id = ? AND is_active = 1 AND status = 'active'
    `).bind(categoryId).first();

    // 处理标签
    const processedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: bookmark.tags ? JSON.parse(bookmark.tags) : []
    }));

    const totalPages = Math.ceil(count / limit);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          bookmarks: processedBookmarks,
          pagination: {
            page,
            limit,
            total: count,
            totalPages
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Bookmarks fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch bookmarks: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 搜索书签API
async function handleSearch(env, query, page = 1, limit = 20) {
  try {
    if (!query.trim()) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            bookmarks: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0
            },
            query: ''
          },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    const offset = (page - 1) * limit;
    const searchTerm = `%${query.trim()}%`;

    // 获取书签
    const { results: bookmarks } = await env.DB.prepare(`
      SELECT 
        b.id, b.title, b.url, b.description, b.category_id as categoryId,
        b.tags, b.is_active as isActive, b.last_checked as lastChecked,
        b.status, b.created_at as createdAt, b.updated_at as updatedAt,
        c.name as categoryName
      FROM bookmarks b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.is_active = 1 AND b.status = 'active'
        AND (
          b.title LIKE ?
          OR b.description LIKE ?
          OR b.url LIKE ?
          OR b.tags LIKE ?
        )
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(searchTerm, searchTerm, searchTerm, searchTerm, limit, offset).all();

    // 获取总数
    const { count } = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM bookmarks b
      WHERE b.is_active = 1 AND b.status = 'active'
        AND (
          b.title LIKE ?
          OR b.description LIKE ?
          OR b.url LIKE ?
          OR b.tags LIKE ?
        )
    `).bind(searchTerm, searchTerm, searchTerm, searchTerm).first();

    // 处理标签和分类
    const processedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: bookmark.tags ? JSON.parse(bookmark.tags) : [],
      category: bookmark.categoryName ? {
        id: bookmark.categoryId,
        name: bookmark.categoryName
      } : undefined
    }));

    const totalPages = Math.ceil(count / limit);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          bookmarks: processedBookmarks,
          pagination: {
            page,
            limit,
            total: count,
            totalPages
          },
          query: query.trim()
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'SEARCH_ERROR',
          message: 'Failed to search bookmarks: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员登录API
async function handleAdminLogin(env, request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Username and password are required',
          },
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    // 简化版登录 - 仅检查用户名和密码是否为admin/admin123
    if (username === 'admin' && password === 'admin123') {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            token: 'dummy-token-for-demo',
            user: {
              id: 1,
              username: 'admin'
            }
          },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password',
        },
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'Login failed: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员统计API
async function handleAdminStats(env) {
  try {
    // 获取总书签数
    const { count: totalBookmarks } = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM bookmarks
    `).first();

    // 获取总分类数
    const { count: totalCategories } = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM categories
    `).first();

    // 获取活跃书签数
    const { count: activeBookmarks } = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM bookmarks
      WHERE is_active = 1 AND status = 'active'
    `).first();

    // 获取非活跃书签数
    const { count: inactiveBookmarks } = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM bookmarks
      WHERE is_active = 0 OR status != 'active'
    `).first();

    // 获取最近添加的书签
    const { results: recentBookmarks } = await env.DB.prepare(`
      SELECT 
        b.id, b.title, b.url, b.category_id as categoryId,
        b.created_at as createdAt,
        c.name as category
      FROM bookmarks b
      LEFT JOIN categories c ON b.category_id = c.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `).all();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          overview: {
            totalBookmarks,
            totalCategories,
            activeBookmarks,
            inactiveBookmarks
          },
          recentBookmarks,
          generatedAt: new Date().toISOString()
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Stats error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: 'Failed to fetch statistics: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 获取所有书签
async function handleAdminBookmarks(env, searchParams) {
  try {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (categoryId && categoryId !== 'all') {
      whereClause += ' AND b.category_id = ?';
      params.push(categoryId);
    }
    
    if (search) {
      whereClause += ' AND (b.title LIKE ? OR b.description LIKE ? OR b.url LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // 获取书签
    const { results: bookmarks } = await env.DB.prepare(`
      SELECT 
        b.id, b.title, b.url, b.description, b.category_id as categoryId,
        b.tags, b.is_active as isActive, b.status, 
        b.created_at as createdAt, b.updated_at as updatedAt,
        c.name as category
      FROM bookmarks b
      LEFT JOIN categories c ON b.category_id = c.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all();

    // 获取总数
    const { count } = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM bookmarks b
      LEFT JOIN categories c ON b.category_id = c.id
      ${whereClause}
    `).bind(...params).first();

    // 处理标签
    const processedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: bookmark.tags ? JSON.parse(bookmark.tags) : []
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          bookmarks: processedBookmarks,
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Admin bookmarks fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch bookmarks: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 添加书签
async function handleAddBookmark(env, request) {
  try {
    const { title, url, description, categoryId, tags } = await request.json();
    
    if (!title || !url || !categoryId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Title, URL and category are required',
          },
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    const { meta } = await env.DB.prepare(`
      INSERT INTO bookmarks (title, url, description, category_id, tags, is_active, status)
      VALUES (?, ?, ?, ?, ?, 1, 'active')
    `).bind(
      title,
      url,
      description || '',
      categoryId,
      JSON.stringify(tags || [])
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { id: meta.last_row_id }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Add bookmark error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'ADD_ERROR',
          message: 'Failed to add bookmark: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 更新书签
async function handleUpdateBookmark(env, request, bookmarkId) {
  try {
    const { title, url, description, categoryId, tags } = await request.json();
    
    await env.DB.prepare(`
      UPDATE bookmarks 
      SET title = ?, url = ?, description = ?, category_id = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      title,
      url,
      description || '',
      categoryId,
      JSON.stringify(tags || []),
      bookmarkId
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { message: 'Bookmark updated successfully' }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Update bookmark error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update bookmark: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 删除书签
async function handleDeleteBookmark(env, bookmarkId) {
  try {
    await env.DB.prepare(`
      DELETE FROM bookmarks WHERE id = ?
    `).bind(bookmarkId).run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { message: 'Bookmark deleted successfully' }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Delete bookmark error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete bookmark: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 获取所有分类
async function handleAdminCategories(env) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        c.id, c.name, c.description, c.sort_order as sortOrder,
        c.created_at as createdAt, c.updated_at as updatedAt,
        COUNT(b.id) as bookmarkCount
      FROM categories c
      LEFT JOIN bookmarks b ON c.id = b.category_id
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `).all();

    return new Response(
      JSON.stringify({
        success: true,
        data: results || [],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Admin categories fetch error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch categories: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 添加分类
async function handleAddCategory(env, request) {
  try {
    const { name, description } = await request.json();
    
    if (!name) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Category name is required',
          },
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    // 获取最大排序号
    const { maxOrder } = await env.DB.prepare(`
      SELECT MAX(sort_order) as maxOrder FROM categories
    `).first();

    const { meta } = await env.DB.prepare(`
      INSERT INTO categories (name, description, sort_order)
      VALUES (?, ?, ?)
    `).bind(
      name,
      description || '',
      (maxOrder || 0) + 1
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { id: meta.last_row_id }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Add category error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'ADD_ERROR',
          message: 'Failed to add category: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 更新分类
async function handleUpdateCategory(env, request, categoryId) {
  try {
    const { name, description, sortOrder } = await request.json();
    
    await env.DB.prepare(`
      UPDATE categories 
      SET name = ?, description = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      name,
      description || '',
      sortOrder,
      categoryId
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { message: 'Category updated successfully' }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Update category error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update category: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 删除分类
async function handleDeleteCategory(env, categoryId) {
  try {
    // 检查分类下是否有书签
    const { count } = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM bookmarks WHERE category_id = ?
    `).bind(categoryId).first();

    if (count > 0) {
      // 删除分类下的所有书签
      await env.DB.prepare(`
        DELETE FROM bookmarks WHERE category_id = ?
      `).bind(categoryId).run();
    }

    // 删除分类
    await env.DB.prepare(`
      DELETE FROM categories WHERE id = ?
    `).bind(categoryId).run();

    return new Response(
      JSON.stringify({
        success: true,
        data: { message: 'Category deleted successfully', deletedBookmarks: count }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Delete category error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: 'Failed to delete category: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 管理员API - 导出书签
async function handleExportBookmarks(env, searchParams) {
  try {
    const format = searchParams.get('format') || 'json';
    const categoryId = searchParams.get('categoryId');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (categoryId && categoryId !== 'all') {
      whereClause += ' AND b.category_id = ?';
      params.push(categoryId);
    }
    
    if (!includeInactive) {
      whereClause += ' AND b.is_active = 1 AND b.status = "active"';
    }
    
    const { results: bookmarks } = await env.DB.prepare(`
      SELECT 
        b.id, b.title, b.url, b.description, b.tags,
        b.created_at as createdAt, c.name as category
      FROM bookmarks b
      LEFT JOIN categories c ON b.category_id = c.id
      ${whereClause}
      ORDER BY c.sort_order, b.created_at DESC
    `).bind(...params).all();

    // 处理标签
    const processedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      tags: bookmark.tags ? JSON.parse(bookmark.tags) : []
    }));

    let content = '';
    let mimeType = '';
    let filename = '';

    switch (format) {
      case 'html':
        content = generateHtmlExport(processedBookmarks);
        mimeType = 'text/html';
        filename = 'bookmarks.html';
        break;
      case 'csv':
        content = generateCsvExport(processedBookmarks);
        mimeType = 'text/csv';
        filename = 'bookmarks.csv';
        break;
      default: // json
        content = JSON.stringify(processedBookmarks, null, 2);
        mimeType = 'application/json';
        filename = 'bookmarks.json';
    }

    return new Response(content, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        ...corsHeaders(),
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'EXPORT_ERROR',
          message: 'Failed to export bookmarks: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 生成HTML格式导出
function generateHtmlExport(bookmarks) {
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category || '未分类';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(bookmark);
    return acc;
  }, {});

  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`;

  Object.entries(groupedBookmarks).forEach(([category, bookmarks]) => {
    html += `
    <DT><H3>${category}</H3>
    <DL><p>`;
    bookmarks.forEach(bookmark => {
      const addDate = Math.floor(new Date(bookmark.createdAt).getTime() / 1000);
      html += `
        <DT><A HREF="${bookmark.url}" ADD_DATE="${addDate}">${bookmark.title}</A>`;
    });
    html += `
    </DL><p>`;
  });

  html += `
</DL><p>`;
  return html;
}

// 生成CSV格式导出
function generateCsvExport(bookmarks) {
  const headers = ['标题', 'URL', '描述', '分类', '标签', '创建时间'];
  const rows = bookmarks.map(bookmark => [
    bookmark.title,
    bookmark.url,
    bookmark.description || '',
    bookmark.category || '未分类',
    bookmark.tags.join(';'),
    bookmark.createdAt
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

// 书签导入API
async function handleImportBookmarks(env, request) {
  try {
    const { bookmarks } = await request.json();
    
    if (!bookmarks || !Array.isArray(bookmarks)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid bookmarks data',
          },
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    // 获取所有现有分类
    const { results: existingCategories } = await env.DB.prepare(`
      SELECT id, name FROM categories
    `).all();

    const categoryMap = {};
    existingCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // 处理每个书签
    for (const bookmark of bookmarks) {
      try {
        let categoryId = null;

        // 查找或创建分类
        if (bookmark.category && bookmark.category !== '未分类') {
          if (categoryMap[bookmark.category]) {
            categoryId = categoryMap[bookmark.category];
          } else {
            // 创建新分类
            const { meta } = await env.DB.prepare(`
              INSERT INTO categories (name, description, sort_order)
              VALUES (?, ?, ?)
            `).bind(
              bookmark.category,
              `从书签导入创建的分类`,
              Object.keys(categoryMap).length + 1
            ).run();
            
            categoryId = meta.last_row_id;
            categoryMap[bookmark.category] = categoryId;
          }
        } else {
          // 使用第一个分类作为默认分类
          categoryId = existingCategories[0]?.id || 1;
        }

        // 检查书签是否已存在
        const { count } = await env.DB.prepare(`
          SELECT COUNT(*) as count FROM bookmarks WHERE url = ?
        `).bind(bookmark.url).first();

        if (count > 0) {
          // 书签已存在，跳过
          continue;
        }

        // 插入书签
        await env.DB.prepare(`
          INSERT INTO bookmarks (title, url, description, category_id, tags, is_active, status)
          VALUES (?, ?, ?, ?, ?, 1, 'active')
        `).bind(
          bookmark.title || '未命名书签',
          bookmark.url,
          bookmark.description || '',
          categoryId,
          JSON.stringify(bookmark.tags || [])
        ).run();

        successCount++;
      } catch (error) {
        failedCount++;
        errors.push(`书签 "${bookmark.title}" 导入失败: ${error.message}`);
        console.error('Import bookmark error:', error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          successCount,
          failedCount,
          totalCount: bookmarks.length,
          errors: errors.slice(0, 10) // 只返回前10个错误
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'IMPORT_ERROR',
          message: 'Failed to import bookmarks: ' + error.message,
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  }
}

// 主处理函数
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // 处理OPTIONS请求（CORS预检）
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    // 健康检查
    if (path === '/health') {
      return handleHealth();
    }

    // 公开API
    if (path === '/api/categories') {
      return handleGetCategories(env);
    }

    // 获取分类下的书签
    const categoryMatch = path.match(/^\/api\/categories\/(\d+)\/bookmarks$/);
    if (categoryMatch) {
      const categoryId = categoryMatch[1];
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      return handleGetCategoryBookmarks(env, categoryId, page, limit);
    }

    // 搜索书签
    if (path === '/api/search') {
      const query = url.searchParams.get('q') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      return handleSearch(env, query, page, limit);
    }

    // 管理员登录
    if (path === '/api/admin/login' && method === 'POST') {
      return handleAdminLogin(env, request);
    }

    // 管理员统计
    if (path === '/api/admin/stats') {
      return handleAdminStats(env);
    }

    // 管理员API - 获取所有书签
    if (path === '/api/admin/bookmarks') {
      return handleAdminBookmarks(env, url.searchParams);
    }

    // 管理员API - 添加书签
    if (path === '/api/admin/bookmarks' && method === 'POST') {
      return handleAddBookmark(env, request);
    }

    // 管理员API - 更新书签
    const bookmarkUpdateMatch = path.match(/^\/api\/admin\/bookmarks\/(\d+)$/);
    if (bookmarkUpdateMatch && method === 'PUT') {
      return handleUpdateBookmark(env, request, bookmarkUpdateMatch[1]);
    }

    // 管理员API - 删除书签
    if (bookmarkUpdateMatch && method === 'DELETE') {
      return handleDeleteBookmark(env, bookmarkUpdateMatch[1]);
    }

    // 管理员API - 获取所有分类
    if (path === '/api/admin/categories') {
      return handleAdminCategories(env);
    }

    // 管理员API - 添加分类
    if (path === '/api/admin/categories' && method === 'POST') {
      return handleAddCategory(env, request);
    }

    // 管理员API - 更新分类
    const categoryUpdateMatch = path.match(/^\/api\/admin\/categories\/(\d+)$/);
    if (categoryUpdateMatch && method === 'PUT') {
      return handleUpdateCategory(env, request, categoryUpdateMatch[1]);
    }

    // 管理员API - 删除分类
    if (categoryUpdateMatch && method === 'DELETE') {
      return handleDeleteCategory(env, categoryUpdateMatch[1]);
    }

    // 管理员API - 导出书签
    if (path === '/api/admin/export') {
      return handleExportBookmarks(env, url.searchParams);
    }

    // 书签导入API
    if (path === '/api/admin/import' && method === 'POST') {
      return handleImportBookmarks(env, request);
    }

    // 404 - 未找到
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'API endpoint not found',
        },
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  },
};