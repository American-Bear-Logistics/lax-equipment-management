// Cloudflare Worker - Airtable API Proxy
// 保护 Airtable API Token 不暴露在前端

const AIRTABLE_BASE_ID = 'appzHFkDDnjJb8zKd';

// 表格 ID 映射
const TABLES = {
  equipment: 'tblyFmoEDTgxh3YIj',
  maintenance: 'tblvPfzEXuCLDR6Vb',
  purchase: 'tblL3AUm128GAOdMQ'
};

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 处理 OPTIONS 预检请求
function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}

// Airtable API 请求
async function airtableRequest(endpoint, method = 'GET', body = null, env) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}${endpoint}`;

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${env.AIRTABLE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  return response.json();
}

// 主处理函数
export default {
  async fetch(request, env) {
    // 处理 CORS 预检
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 路由处理
      // GET /api/equipment - 获取设备列表
      if (path === '/api/equipment' && request.method === 'GET') {
        const data = await airtableRequest(`/${TABLES.equipment}?view=Grid%20view`, 'GET', null, env);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET /api/maintenance - 获取维护工单列表
      if (path === '/api/maintenance' && request.method === 'GET') {
        const data = await airtableRequest(`/${TABLES.maintenance}?view=Grid%20view`, 'GET', null, env);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // GET /api/purchase - 获取采购申请列表
      if (path === '/api/purchase' && request.method === 'GET') {
        const data = await airtableRequest(`/${TABLES.purchase}?view=Grid%20view`, 'GET', null, env);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // POST /api/maintenance - 创建维护工单
      if (path === '/api/maintenance' && request.method === 'POST') {
        const body = await request.json();
        const data = await airtableRequest(`/${TABLES.maintenance}`, 'POST', {
          records: [{ fields: body }]
        }, env);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // POST /api/purchase - 创建采购申请
      if (path === '/api/purchase' && request.method === 'POST') {
        const body = await request.json();
        const data = await airtableRequest(`/${TABLES.purchase}`, 'POST', {
          records: [{ fields: body }]
        }, env);
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 404 - 未找到路由
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
