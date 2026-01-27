// LAX 设备管理系统 - 前端 JavaScript

// ==================== 配置 ====================
// Airtable 配置 (Token 通过 GitHub Actions 注入)
const AIRTABLE_CONFIG = {
    baseId: 'appzHFkDDnjJb8zKd',
    apiToken: '__AIRTABLE_API_TOKEN__', // 由 GitHub Actions 替换
    tables: {
        equipment: 'tblyFmoEDTgxh3YIj',
        maintenance: 'tblvPfzEXuCLDR6Vb',
        purchase: 'tblL3AUm128GAOdMQ'
    }
};

// 检查是否已配置 Token (占位符以双下划线开头)
const USE_MOCK_DATA = AIRTABLE_CONFIG.apiToken.startsWith('__');

// ==================== 全局数据存储 ====================
let equipmentData = [];
let maintenanceData = [];
let purchaseData = [];
let currentFilter = 'all';

// ==================== Airtable API 请求 ====================
async function airtableRequest(tableId, method = 'GET', body = null) {
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}`;

    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${AIRTABLE_CONFIG.apiToken}`,
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    return response.json();
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function () {
    // 设置今天的日期
    document.getElementById('m-date').valueAsDate = new Date();

    // 加载所有数据
    loadAllData();
});

// ==================== 数据加载 ====================
async function loadAllData() {
    await Promise.all([
        loadEquipment(),
        loadMaintenance(),
        loadPurchase()
    ]);
}

async function loadEquipment() {
    try {
        if (USE_MOCK_DATA) {
            equipmentData = getMockEquipment();
        } else {
            const data = await airtableRequest(`${AIRTABLE_CONFIG.tables.equipment}?view=Grid%20view`);
            equipmentData = data.records || [];
        }
        renderEquipmentTable();
        updateStatistics();
        populateEquipmentSelect();
    } catch (error) {
        console.error('加载设备数据失败:', error);
        showToast('错误', '加载设备数据失败', 'error');
    }
}

async function loadMaintenance() {
    try {
        if (USE_MOCK_DATA) {
            maintenanceData = getMockMaintenance();
        } else {
            const data = await airtableRequest(`${AIRTABLE_CONFIG.tables.maintenance}?view=Grid%20view`);
            maintenanceData = data.records || [];
        }
        renderMaintenanceTable();
    } catch (error) {
        console.error('加载维护工单失败:', error);
        showToast('错误', '加载维护工单失败', 'error');
    }
}

async function loadPurchase() {
    try {
        if (USE_MOCK_DATA) {
            purchaseData = getMockPurchase();
        } else {
            const data = await airtableRequest(`${AIRTABLE_CONFIG.tables.purchase}?view=Grid%20view`);
            purchaseData = data.records || [];
        }
        renderPurchaseTable();
    } catch (error) {
        console.error('加载采购申请失败:', error);
        showToast('错误', '加载采购申请失败', 'error');
    }
}

// ==================== 渲染表格 ====================
function renderEquipmentTable() {
    const tbody = document.getElementById('equipment-table');
    let filteredData = equipmentData;

    // 应用过滤器
    if (currentFilter !== 'all') {
        filteredData = equipmentData.filter(item =>
            item.fields['设备类型'] === currentFilter
        );
    }

    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>暂无设备数据</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredData.map(item => {
        const f = item.fields;
        return `
            <tr>
                <td><code>${f['设备编号'] || '-'}</code></td>
                <td><strong>${f['设备名称'] || '-'}</strong></td>
                <td>${getTypeBadge(f['设备类型'])}</td>
                <td>${f['品牌型号'] || '-'}</td>
                <td>${formatDate(f['采购日期'])}</td>
                <td class="price">${formatCurrency(f['采购价格'])}</td>
                <td>${f['使用期限(年)'] ? f['使用期限(年)'] + ' 年' : '-'}</td>
                <td>${getMaintenanceDateDisplay(f['下次维护日期'])}</td>
                <td>${getStatusBadge(f['当前状态'])}</td>
                <td>
                    <button class="btn btn-warning btn-action" onclick="openQuickMaintenance('${item.id}', '${f['设备名称']}', '${f['设备编号'] || ''}')">
                        <i class="bi bi-tools"></i> 报修
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderMaintenanceTable() {
    const tbody = document.getElementById('maintenance-table');

    if (maintenanceData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>暂无维护工单</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = maintenanceData.map(item => {
        const f = item.fields;
        return `
            <tr>
                <td><code>${f['工单编号'] || '-'}</code></td>
                <td>${f['设备名称'] || '-'}</td>
                <td>${f['工单类型'] || '-'}</td>
                <td>${truncateText(f['问题描述'], 30)}</td>
                <td>${getUrgencyBadge(f['紧急程度'])}</td>
                <td>${f['提交人'] || '-'}</td>
                <td>${formatDate(f['提交日期'])}</td>
                <td>${getProcessStatusBadge(f['处理状态'])}</td>
            </tr>
        `;
    }).join('');
}

function renderPurchaseTable() {
    const tbody = document.getElementById('purchase-table');

    if (purchaseData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>暂无采购申请</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = purchaseData.map(item => {
        const f = item.fields;
        return `
            <tr>
                <td><code>${f['申请编号'] || '-'}</code></td>
                <td>${f['设备名称'] || '-'}</td>
                <td>${getTypeBadge(f['设备类型'])}</td>
                <td>${f['数量'] || '-'}</td>
                <td class="price">${formatCurrency(f['总价预估'])}</td>
                <td>${f['申请人'] || '-'}</td>
                <td>${formatDate(f['申请日期'])}</td>
                <td>${getApprovalStatusBadge(f['审批状态'])}</td>
            </tr>
        `;
    }).join('');
}

// ==================== 统计更新 ====================
function updateStatistics() {
    const total = equipmentData.length;
    const normal = equipmentData.filter(e => e.fields['当前状态'] === '正常使用').length;
    const maintenance = equipmentData.filter(e => e.fields['当前状态'] === '维护中').length;
    const repair = equipmentData.filter(e => e.fields['当前状态'] === '待维修').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-normal').textContent = normal;
    document.getElementById('stat-maintenance').textContent = maintenance;
    document.getElementById('stat-repair').textContent = repair;
}

// ==================== 设备选择器填充 ====================
function populateEquipmentSelect() {
    const select = document.getElementById('m-equipment');
    select.innerHTML = '<option value="">请选择设备</option>';

    equipmentData.forEach(item => {
        const f = item.fields;
        const option = document.createElement('option');
        option.value = JSON.stringify({ id: f['设备编号'], name: f['设备名称'] });
        option.textContent = `${f['设备名称']} (${f['设备编号'] || '无编号'})`;
        select.appendChild(option);
    });

    // 设备选择变化时更新编号
    select.addEventListener('change', function () {
        if (this.value) {
            const data = JSON.parse(this.value);
            document.getElementById('m-equipment-id').value = data.id || '';
        } else {
            document.getElementById('m-equipment-id').value = '';
        }
    });
}

// ==================== 页面切换 ====================
function showSection(section) {
    // 隐藏所有区域
    document.querySelectorAll('.section-content').forEach(el => {
        el.classList.add('d-none');
    });

    // 显示目标区域
    document.getElementById(`${section}-section`).classList.remove('d-none');

    // 更新导航高亮
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ==================== 设备过滤 ====================
function filterEquipment(type) {
    currentFilter = type;
    renderEquipmentTable();

    // 更新按钮状态
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// ==================== 提交维护工单 ====================
async function submitMaintenance() {
    const form = document.getElementById('maintenance-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const equipmentValue = document.getElementById('m-equipment').value;
    const equipmentInfo = JSON.parse(equipmentValue);

    const ticketData = {
        '工单编号': generateTicketId('MT'),
        '设备名称': equipmentInfo.name,
        '设备编号': equipmentInfo.id,
        '工单类型': document.getElementById('m-type').value,
        '紧急程度': document.getElementById('m-urgency').value,
        '问题描述': document.getElementById('m-description').value,
        '提交人': document.getElementById('m-submitter').value,
        '提交日期': document.getElementById('m-date').value,
        '处理状态': '待处理 Pending'
    };

    try {
        if (!USE_MOCK_DATA) {
            await airtableRequest(AIRTABLE_CONFIG.tables.maintenance, 'POST', {
                records: [{ fields: ticketData }]
            });
        }

        // 添加到本地数据
        maintenanceData.unshift({ id: 'new', fields: ticketData });
        renderMaintenanceTable();

        // 关闭模态框并重置表单
        bootstrap.Modal.getInstance(document.getElementById('maintenanceModal')).hide();
        form.reset();
        document.getElementById('m-date').valueAsDate = new Date();

        showToast('成功', '维护工单已提交', 'success');
    } catch (error) {
        console.error('提交维护工单失败:', error);
        showToast('错误', '提交失败，请重试', 'error');
    }
}

// ==================== 快速维护工单 ====================
function openQuickMaintenance(id, name, equipmentId) {
    document.getElementById('qm-equipment-name').value = name;
    document.getElementById('qm-equipment-id').value = equipmentId;
    new bootstrap.Modal(document.getElementById('quickMaintenanceModal')).show();
}

async function submitQuickMaintenance() {
    const form = document.getElementById('quick-maintenance-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const ticketData = {
        '工单编号': generateTicketId('MT'),
        '设备名称': document.getElementById('qm-equipment-name').value,
        '设备编号': document.getElementById('qm-equipment-id').value,
        '工单类型': document.getElementById('qm-type').value,
        '紧急程度': document.getElementById('qm-urgency').value,
        '问题描述': document.getElementById('qm-description').value,
        '提交人': document.getElementById('qm-submitter').value,
        '提交日期': new Date().toISOString().split('T')[0],
        '处理状态': '待处理 Pending'
    };

    try {
        if (!USE_MOCK_DATA) {
            await airtableRequest(AIRTABLE_CONFIG.tables.maintenance, 'POST', {
                records: [{ fields: ticketData }]
            });
        }

        maintenanceData.unshift({ id: 'new', fields: ticketData });
        renderMaintenanceTable();

        bootstrap.Modal.getInstance(document.getElementById('quickMaintenanceModal')).hide();
        form.reset();

        showToast('成功', '维护工单已提交', 'success');
    } catch (error) {
        console.error('提交维护工单失败:', error);
        showToast('错误', '提交失败，请重试', 'error');
    }
}

// ==================== 提交采购申请 ====================
async function submitPurchase() {
    const form = document.getElementById('purchase-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const purchaseDataNew = {
        '申请编号': generateTicketId('PR'),
        '设备名称': document.getElementById('p-name').value,
        '设备类型': document.getElementById('p-type').value,
        '品牌型号': document.getElementById('p-model').value,
        '数量': parseInt(document.getElementById('p-quantity').value),
        '单价预估': parseFloat(document.getElementById('p-unit-price').value),
        '总价预估': parseFloat(document.getElementById('p-total-price').value),
        '采购原因': document.getElementById('p-reason').value,
        '详细说明': document.getElementById('p-description').value,
        '申请人': document.getElementById('p-submitter').value,
        '申请部门': document.getElementById('p-department').value,
        '申请日期': new Date().toISOString().split('T')[0],
        '期望到货日期': document.getElementById('p-expected-date').value || null,
        '审批状态': '待审批 Pending'
    };

    try {
        if (!USE_MOCK_DATA) {
            await airtableRequest(AIRTABLE_CONFIG.tables.purchase, 'POST', {
                records: [{ fields: purchaseDataNew }]
            });
        }

        purchaseData.unshift({ id: 'new', fields: purchaseDataNew });
        renderPurchaseTable();

        bootstrap.Modal.getInstance(document.getElementById('purchaseModal')).hide();
        form.reset();

        showToast('成功', '采购申请已提交', 'success');
    } catch (error) {
        console.error('提交采购申请失败:', error);
        showToast('错误', '提交失败，请重试', 'error');
    }
}

// ==================== 工具函数 ====================
function calculateTotal() {
    const quantity = parseFloat(document.getElementById('p-quantity').value) || 0;
    const unitPrice = parseFloat(document.getElementById('p-unit-price').value) || 0;
    document.getElementById('p-total-price').value = (quantity * unitPrice).toFixed(2);
}

function generateTicketId(prefix) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${dateStr}-${random}`;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
}

function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return '$' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function truncateText(text, maxLength) {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getMaintenanceDateDisplay(dateStr) {
    if (!dateStr) return '<span class="text-muted">无需维护</span>';

    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `<span class="date-overdue">${formatDate(dateStr)} (已逾期)</span>`;
    } else if (diffDays <= 7) {
        return `<span class="date-soon">${formatDate(dateStr)} (${diffDays}天后)</span>`;
    } else {
        return `<span class="date-ok">${formatDate(dateStr)}</span>`;
    }
}

// ==================== 状态标签 ====================
function getTypeBadge(type) {
    if (!type) return '-';
    const types = {
        '电子设备 Electronics': 'type-electronics',
        '仓库设备 Warehouse': 'type-warehouse',
        '办公设备 Office': 'type-office'
    };
    const className = types[type] || 'bg-secondary';
    const displayText = type.split(' ')[0];
    return `<span class="badge ${className}">${displayText}</span>`;
}

function getStatusBadge(status) {
    if (!status) return '-';
    const statuses = {
        '正常使用': 'status-normal',
        '维护中': 'status-maintenance',
        '待维修': 'status-repair',
        '已报废': 'status-retired'
    };
    const className = statuses[status] || 'bg-secondary';
    return `<span class="badge ${className}">${status}</span>`;
}

function getUrgencyBadge(urgency) {
    if (!urgency) return '-';
    const urgencies = {
        '低 Low': 'urgency-low',
        '中 Medium': 'urgency-medium',
        '高 High': 'urgency-high',
        '紧急 Urgent': 'urgency-urgent'
    };
    const className = urgencies[urgency] || 'bg-secondary';
    const displayText = urgency.split(' ')[0];
    return `<span class="badge ${className}">${displayText}</span>`;
}

function getProcessStatusBadge(status) {
    if (!status) return '-';
    const statuses = {
        '待处理 Pending': 'process-pending',
        '处理中 In Progress': 'process-progress',
        '等待配件 Waiting Parts': 'process-waiting',
        '已完成 Completed': 'process-completed',
        '已取消 Cancelled': 'process-cancelled'
    };
    const className = statuses[status] || 'bg-secondary';
    const displayText = status.split(' ')[0];
    return `<span class="badge ${className}">${displayText}</span>`;
}

function getApprovalStatusBadge(status) {
    if (!status) return '-';
    const statuses = {
        '待审批 Pending': 'approval-pending',
        '已批准 Approved': 'approval-approved',
        '已拒绝 Rejected': 'approval-rejected',
        '采购中 Purchasing': 'approval-purchasing',
        '已完成 Completed': 'approval-completed'
    };
    const className = statuses[status] || 'bg-secondary';
    const displayText = status.split(' ')[0];
    return `<span class="badge ${className}">${displayText}</span>`;
}

// ==================== Toast 通知 ====================
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const titleEl = document.getElementById('toast-title');
    const messageEl = document.getElementById('toast-message');

    titleEl.textContent = title;
    messageEl.textContent = message;

    icon.className = type === 'success'
        ? 'bi bi-check-circle-fill text-success me-2'
        : 'bi bi-exclamation-circle-fill text-danger me-2';

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// ==================== 模拟数据 ====================
function getMockEquipment() {
    return [
        {
            id: '1',
            fields: {
                '设备名称': 'Dell OptiPlex 7090',
                '设备编号': 'PC-2024-001',
                '设备类型': '电子设备 Electronics',
                '品牌型号': 'Dell OptiPlex 7090',
                '采购日期': '2024-01-15',
                '采购价格': 1200,
                '使用期限(年)': 5,
                '下次维护日期': '2025-02-01',
                '当前状态': '正常使用',
                '使用人': 'John Smith',
                '部门': '办公室 Office'
            }
        },
        {
            id: '2',
            fields: {
                '设备名称': 'HP LaserJet Pro',
                '设备编号': 'PR-2024-001',
                '设备类型': '电子设备 Electronics',
                '品牌型号': 'HP LaserJet Pro M404dn',
                '采购日期': '2024-02-20',
                '采购价格': 450,
                '使用期限(年)': 5,
                '下次维护日期': '2025-01-25',
                '当前状态': '正常使用',
                '使用人': 'Front Desk',
                '部门': '办公室 Office'
            }
        },
        {
            id: '3',
            fields: {
                '设备名称': 'Toyota Forklift',
                '设备编号': 'FL-2023-001',
                '设备类型': '仓库设备 Warehouse',
                '品牌型号': 'Toyota 8FGCU25',
                '采购日期': '2023-06-01',
                '采购价格': 25000,
                '使用期限(年)': 10,
                '下次维护日期': '2025-01-20',
                '当前状态': '待维修',
                '使用人': 'Warehouse Team',
                '部门': '仓库 Warehouse'
            }
        },
        {
            id: '4',
            fields: {
                '设备名称': 'Standing Desk',
                '设备编号': 'OF-2024-001',
                '设备类型': '办公设备 Office',
                '品牌型号': 'Uplift V2',
                '采购日期': '2024-03-10',
                '采购价格': 600,
                '使用期限(年)': 10,
                '下次维护日期': null,
                '当前状态': '正常使用',
                '使用人': 'Manager Office',
                '部门': '办公室 Office'
            }
        },
        {
            id: '5',
            fields: {
                '设备名称': 'Pallet Jack',
                '设备编号': 'PJ-2024-001',
                '设备类型': '仓库设备 Warehouse',
                '品牌型号': 'Crown PTH50',
                '采购日期': '2024-01-05',
                '采购价格': 3500,
                '使用期限(年)': 8,
                '下次维护日期': '2025-03-01',
                '当前状态': '维护中',
                '使用人': 'Warehouse Team',
                '部门': '仓库 Warehouse'
            }
        }
    ];
}

function getMockMaintenance() {
    return [
        {
            id: '1',
            fields: {
                '工单编号': 'MT-20250120-001',
                '设备名称': 'Toyota Forklift',
                '设备编号': 'FL-2023-001',
                '工单类型': '故障维修',
                '问题描述': '液压系统漏油，升降功能异常',
                '紧急程度': '高 High',
                '提交人': 'Mike Chen',
                '提交日期': '2025-01-20',
                '处理状态': '处理中 In Progress'
            }
        },
        {
            id: '2',
            fields: {
                '工单编号': 'MT-20250118-001',
                '设备名称': 'Pallet Jack',
                '设备编号': 'PJ-2024-001',
                '工单类型': '定期维护',
                '问题描述': '年度维护保养',
                '紧急程度': '低 Low',
                '提交人': 'System',
                '提交日期': '2025-01-18',
                '处理状态': '已完成 Completed'
            }
        }
    ];
}

function getMockPurchase() {
    return [
        {
            id: '1',
            fields: {
                '申请编号': 'PR-20250115-001',
                '设备名称': 'MacBook Pro 14"',
                '设备类型': '电子设备 Electronics',
                '数量': 2,
                '总价预估': 4800,
                '申请人': 'Sarah Wang',
                '申请日期': '2025-01-15',
                '审批状态': '已批准 Approved'
            }
        },
        {
            id: '2',
            fields: {
                '申请编号': 'PR-20250122-001',
                '设备名称': 'Office Chair',
                '设备类型': '办公设备 Office',
                '数量': 5,
                '总价预估': 1500,
                '申请人': 'Tom Lee',
                '申请日期': '2025-01-22',
                '审批状态': '待审批 Pending'
            }
        }
    ];
}
