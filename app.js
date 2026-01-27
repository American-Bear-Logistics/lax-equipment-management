// LAX 设备管理系统 - 前端 JavaScript

// ==================== 配置 ====================
const AIRTABLE_CONFIG = {
    baseId: 'appzHFkDDnjJb8zKd',
    apiToken: '__AIRTABLE_API_TOKEN__',
    tables: {
        equipment: 'tblyFmoEDTgxh3YIj',
        maintenance: 'tblvPfzEXuCLDR6Vb',
        purchase: 'tblL3AUm128GAOdMQ'
    }
};

const IT_PASSWORD = '1470205';
const USE_MOCK_DATA = AIRTABLE_CONFIG.apiToken.startsWith('__');

// ==================== 全局状态 ====================
let equipmentData = [];
let maintenanceData = [];
let purchaseData = [];
let currentFilter = 'all';
let currentLang = 'zh';
let isITUser = false;

// ==================== 国际化 ====================
const i18n = {
    zh: {
        appTitle: 'LAX 设备管理系统',
        appSubtitle: 'Equipment Management System',
        appTitleShort: 'LAX 设备管理',
        selectRole: '选择登录方式',
        userLogin: '普通用户登录',
        itLogin: 'IT 管理员登录',
        enterPassword: '请输入 IT 管理员密码',
        wrongPassword: '密码错误',
        login: '登录',
        logout: '退出',
        equipmentList: '设备清单',
        maintenanceTickets: '维护工单',
        purchaseRequests: '采购申请',
        all: '全部',
        electronics: '电子设备',
        warehouse: '仓库设备',
        office: '办公设备',
        totalEquipment: '设备总数',
        inUse: '正常使用',
        underMaintenance: '维护中',
        needsRepair: '待维修',
        equipmentId: '设备编号',
        equipmentName: '设备名称',
        type: '类型',
        brandModel: '品牌型号',
        purchaseDate: '采购日期',
        purchasePrice: '采购价格',
        usageLife: '使用期限',
        nextMaintenance: '下次维护',
        status: '状态',
        action: '操作',
        repair: '报修',
        viewDetails: '详情',
        ticketId: '工单编号',
        ticketType: '工单类型',
        description: '问题描述',
        urgency: '紧急程度',
        submitter: '提交人',
        submitDate: '提交日期',
        requestId: '申请编号',
        quantity: '数量',
        estimatedTotal: '预估总价',
        applicant: '申请人',
        applicationDate: '申请日期',
        submitTicket: '提交维护工单',
        submitRequest: '提交采购申请',
        selectEquipment: '请选择设备',
        pleaseSelect: '请选择',
        scheduledMaintenance: '定期维护',
        inspection: '检查保养',
        cancel: '取消',
        submit: '提交',
        close: '关闭',
        quickRepair: '快速报修',
        equipment: '设备',
        yourName: '您的姓名',
        equipmentDetails: '设备详情',
        basicInfo: '基本信息',
        user: '使用人',
        department: '部门',
        location: '存放位置',
        purchaseAndMaintenance: '采购与维护',
        supplier: '供应商',
        expectedRetirement: '预计报废',
        maintenanceCycle: '维护周期',
        lastMaintenance: '上次维护',
        maintenanceHistory: '维修记录',
        noMaintenanceRecords: '暂无维修记录',
        noData: '暂无数据',
        purchaseReason: '采购原因',
        newRequirement: '新增需求',
        replacement: '更换旧设备',
        backup: '备用储备',
        expansion: '业务扩展',
        unitPrice: '单价预估',
        totalPrice: '总价预估',
        details: '详细说明',
        expectedDate: '期望到货日期',
        success: '成功',
        error: '错误',
        ticketSubmitted: '维护工单已提交',
        requestSubmitted: '采购申请已提交',
        submitFailed: '提交失败，请重试',
        userRole: '普通用户',
        itRole: 'IT 管理员',
        years: '年',
        months: '月',
        noMaintenanceNeeded: '无需维护',
        overdue: '已逾期',
        daysLater: '天后'
    },
    en: {
        appTitle: 'LAX Equipment Management',
        appSubtitle: 'Equipment Management System',
        appTitleShort: 'LAX Equipment',
        selectRole: 'Select Login Type',
        userLogin: 'User Login',
        itLogin: 'IT Admin Login',
        enterPassword: 'Enter IT Admin Password',
        wrongPassword: 'Wrong Password',
        login: 'Login',
        logout: 'Logout',
        equipmentList: 'Equipment List',
        maintenanceTickets: 'Maintenance Tickets',
        purchaseRequests: 'Purchase Requests',
        all: 'All',
        electronics: 'Electronics',
        warehouse: 'Warehouse',
        office: 'Office',
        totalEquipment: 'Total Equipment',
        inUse: 'In Use',
        underMaintenance: 'Under Maintenance',
        needsRepair: 'Needs Repair',
        equipmentId: 'Equipment ID',
        equipmentName: 'Equipment Name',
        type: 'Type',
        brandModel: 'Brand/Model',
        purchaseDate: 'Purchase Date',
        purchasePrice: 'Purchase Price',
        usageLife: 'Usage Life',
        nextMaintenance: 'Next Maintenance',
        status: 'Status',
        action: 'Action',
        repair: 'Repair',
        viewDetails: 'Details',
        ticketId: 'Ticket ID',
        ticketType: 'Ticket Type',
        description: 'Description',
        urgency: 'Urgency',
        submitter: 'Submitter',
        submitDate: 'Submit Date',
        requestId: 'Request ID',
        quantity: 'Quantity',
        estimatedTotal: 'Est. Total',
        applicant: 'Applicant',
        applicationDate: 'Application Date',
        submitTicket: 'Submit Maintenance Ticket',
        submitRequest: 'Submit Purchase Request',
        selectEquipment: 'Select Equipment',
        pleaseSelect: 'Please Select',
        scheduledMaintenance: 'Scheduled Maintenance',
        inspection: 'Inspection',
        cancel: 'Cancel',
        submit: 'Submit',
        close: 'Close',
        quickRepair: 'Quick Repair',
        equipment: 'Equipment',
        yourName: 'Your Name',
        equipmentDetails: 'Equipment Details',
        basicInfo: 'Basic Information',
        user: 'User',
        department: 'Department',
        location: 'Location',
        purchaseAndMaintenance: 'Purchase & Maintenance',
        supplier: 'Supplier',
        expectedRetirement: 'Expected Retirement',
        maintenanceCycle: 'Maintenance Cycle',
        lastMaintenance: 'Last Maintenance',
        maintenanceHistory: 'Maintenance History',
        noMaintenanceRecords: 'No maintenance records',
        noData: 'No data',
        purchaseReason: 'Purchase Reason',
        newRequirement: 'New Requirement',
        replacement: 'Replacement',
        backup: 'Backup',
        expansion: 'Expansion',
        unitPrice: 'Unit Price',
        totalPrice: 'Total Price',
        details: 'Details',
        expectedDate: 'Expected Date',
        success: 'Success',
        error: 'Error',
        ticketSubmitted: 'Maintenance ticket submitted',
        requestSubmitted: 'Purchase request submitted',
        submitFailed: 'Submit failed, please try again',
        userRole: 'User',
        itRole: 'IT Admin',
        years: 'years',
        months: 'months',
        noMaintenanceNeeded: 'No maintenance needed',
        overdue: 'Overdue',
        daysLater: 'days'
    }
};

function t(key) {
    return i18n[currentLang][key] || key;
}

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            el.textContent = i18n[currentLang][key];
        }
    });

    // Update language toggle buttons
    const langToggle = document.getElementById('lang-toggle-text');
    const navLang = document.getElementById('nav-lang-text');
    if (langToggle) langToggle.textContent = currentLang === 'zh' ? 'English' : '中文';
    if (navLang) navLang.textContent = currentLang === 'zh' ? 'EN' : '中文';

    // Update role display
    const roleText = document.getElementById('role-text');
    if (roleText) {
        roleText.textContent = isITUser ? t('itRole') : t('userRole');
    }

    // Re-render tables with new language
    if (equipmentData.length > 0) renderEquipmentTable();
    if (maintenanceData.length > 0) renderMaintenanceTable();
    if (purchaseData.length > 0) renderPurchaseTable();
}

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
}

// ==================== 登录系统 ====================
function showITLogin() {
    document.getElementById('it-password-section').classList.remove('d-none');
    document.getElementById('it-password').focus();
}

function loginAsUser() {
    isITUser = false;
    enterMainApp();
}

function loginAsIT() {
    const password = document.getElementById('it-password').value;
    if (password === IT_PASSWORD) {
        isITUser = true;
        enterMainApp();
    } else {
        document.getElementById('password-error').classList.remove('d-none');
        document.getElementById('it-password').classList.add('is-invalid');
    }
}

function enterMainApp() {
    document.getElementById('login-screen').classList.add('d-none');
    document.getElementById('main-app').classList.remove('d-none');
    document.getElementById('role-text').textContent = isITUser ? t('itRole') : t('userRole');

    // Set date
    const dateInput = document.getElementById('m-date');
    if (dateInput) dateInput.valueAsDate = new Date();

    loadAllData();
}

function logout() {
    isITUser = false;
    document.getElementById('main-app').classList.add('d-none');
    document.getElementById('login-screen').classList.remove('d-none');
    document.getElementById('it-password-section').classList.add('d-none');
    document.getElementById('it-password').value = '';
    document.getElementById('password-error').classList.add('d-none');
    document.getElementById('it-password').classList.remove('is-invalid');
}

// ==================== Airtable API ====================
async function airtableRequest(endpoint, method = 'GET', body = null) {
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${endpoint}`;
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${AIRTABLE_CONFIG.apiToken}`,
            'Content-Type': 'application/json'
        }
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    return response.json();
}

async function updateEquipmentStatus(recordId, newStatus) {
    if (USE_MOCK_DATA) return;
    await airtableRequest(`${AIRTABLE_CONFIG.tables.equipment}/${recordId}`, 'PATCH', {
        fields: { '当前状态': newStatus }
    });
}

// ==================== 数据加载 ====================
async function loadAllData() {
    await Promise.all([loadEquipment(), loadMaintenance(), loadPurchase()]);
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
        console.error('Failed to load equipment:', error);
        showToast(t('error'), t('submitFailed'), 'error');
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
        console.error('Failed to load maintenance:', error);
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
        console.error('Failed to load purchase:', error);
    }
}

// ==================== 渲染表格 ====================
function renderEquipmentTable() {
    const tbody = document.getElementById('equipment-table');
    let filteredData = equipmentData;

    if (currentFilter !== 'all') {
        filteredData = equipmentData.filter(item => item.fields['设备类型'] === currentFilter);
    }

    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4">${t('noData')}</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredData.map(item => {
        const f = item.fields;
        const detailBtn = isITUser
            ? `<button class="btn btn-info btn-sm me-1" onclick="showEquipmentDetail('${item.id}')"><i class="bi bi-eye"></i></button>`
            : '';
        return `
            <tr>
                <td><code>${f['设备编号'] || '-'}</code></td>
                <td><strong>${f['设备名称'] || '-'}</strong></td>
                <td>${getTypeBadge(f['设备类型'])}</td>
                <td>${f['品牌型号'] || '-'}</td>
                <td>${formatDate(f['采购日期'])}</td>
                <td class="price">${formatCurrency(f['采购价格'])}</td>
                <td>${f['使用期限(年)'] ? f['使用期限(年)'] + ' ' + t('years') : '-'}</td>
                <td>${getMaintenanceDateDisplay(f['下次维护日期'])}</td>
                <td>${getStatusBadge(f['当前状态'])}</td>
                <td>
                    ${detailBtn}
                    <button class="btn btn-warning btn-sm" onclick="openQuickMaintenance('${item.id}', '${escapeHtml(f['设备名称'])}', '${f['设备编号'] || ''}')">
                        <i class="bi bi-tools"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderMaintenanceTable() {
    const tbody = document.getElementById('maintenance-table');

    if (maintenanceData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">${t('noData')}</td></tr>`;
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
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">${t('noData')}</td></tr>`;
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
    document.getElementById('stat-total').textContent = equipmentData.length;
    document.getElementById('stat-normal').textContent = equipmentData.filter(e => e.fields['当前状态'] === '正常使用').length;
    document.getElementById('stat-maintenance').textContent = equipmentData.filter(e => e.fields['当前状态'] === '维护中').length;
    document.getElementById('stat-repair').textContent = equipmentData.filter(e => e.fields['当前状态'] === '待维修').length;
}

// ==================== 设备选择器 ====================
function populateEquipmentSelect() {
    const select = document.getElementById('m-equipment');
    select.innerHTML = `<option value="">${t('selectEquipment')}</option>`;

    equipmentData.forEach(item => {
        const f = item.fields;
        const option = document.createElement('option');
        option.value = JSON.stringify({ recordId: item.id, id: f['设备编号'], name: f['设备名称'] });
        option.textContent = `${f['设备名称']} (${f['设备编号'] || '-'})`;
        select.appendChild(option);
    });

    select.onchange = function() {
        if (this.value) {
            const data = JSON.parse(this.value);
            document.getElementById('m-equipment-id').value = data.id || '';
            document.getElementById('m-equipment-record-id').value = data.recordId;
        } else {
            document.getElementById('m-equipment-id').value = '';
            document.getElementById('m-equipment-record-id').value = '';
        }
    };
}

// ==================== 页面切换 ====================
function showSection(section, event) {
    document.querySelectorAll('.section-content').forEach(el => el.classList.add('d-none'));
    document.getElementById(`${section}-section`).classList.remove('d-none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    if (event && event.target) event.target.closest('.nav-link').classList.add('active');
}

function filterEquipment(type, event) {
    currentFilter = type;
    renderEquipmentTable();
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

// ==================== 提交维护工单 ====================
async function submitMaintenance() {
    const form = document.getElementById('maintenance-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const equipmentValue = document.getElementById('m-equipment').value;
    const equipmentInfo = JSON.parse(equipmentValue);
    const recordId = document.getElementById('m-equipment-record-id').value;

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
            await airtableRequest(AIRTABLE_CONFIG.tables.maintenance, 'POST', { records: [{ fields: ticketData }] });
            await updateEquipmentStatus(recordId, '待维修');
        }

        maintenanceData.unshift({ id: 'new', fields: ticketData });

        // Update local equipment status
        const equipment = equipmentData.find(e => e.id === recordId);
        if (equipment) equipment.fields['当前状态'] = '待维修';

        renderMaintenanceTable();
        renderEquipmentTable();
        updateStatistics();

        bootstrap.Modal.getInstance(document.getElementById('maintenanceModal')).hide();
        form.reset();
        document.getElementById('m-date').valueAsDate = new Date();

        showToast(t('success'), t('ticketSubmitted'), 'success');
    } catch (error) {
        console.error('Submit failed:', error);
        showToast(t('error'), t('submitFailed'), 'error');
    }
}

// ==================== 快速维护工单 ====================
function openQuickMaintenance(recordId, name, equipmentId) {
    document.getElementById('qm-equipment-name').value = name;
    document.getElementById('qm-equipment-id').value = equipmentId;
    document.getElementById('qm-equipment-record-id').value = recordId;
    new bootstrap.Modal(document.getElementById('quickMaintenanceModal')).show();
}

async function submitQuickMaintenance() {
    const form = document.getElementById('quick-maintenance-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const recordId = document.getElementById('qm-equipment-record-id').value;

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
            await airtableRequest(AIRTABLE_CONFIG.tables.maintenance, 'POST', { records: [{ fields: ticketData }] });
            await updateEquipmentStatus(recordId, '待维修');
        }

        maintenanceData.unshift({ id: 'new', fields: ticketData });

        // Update local equipment status
        const equipment = equipmentData.find(e => e.id === recordId);
        if (equipment) equipment.fields['当前状态'] = '待维修';

        renderMaintenanceTable();
        renderEquipmentTable();
        updateStatistics();

        bootstrap.Modal.getInstance(document.getElementById('quickMaintenanceModal')).hide();
        form.reset();

        showToast(t('success'), t('ticketSubmitted'), 'success');
    } catch (error) {
        console.error('Submit failed:', error);
        showToast(t('error'), t('submitFailed'), 'error');
    }
}

// ==================== 提交采购申请 ====================
async function submitPurchase() {
    const form = document.getElementById('purchase-form');
    if (!form.checkValidity()) { form.reportValidity(); return; }

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
            await airtableRequest(AIRTABLE_CONFIG.tables.purchase, 'POST', { records: [{ fields: purchaseDataNew }] });
        }

        purchaseData.unshift({ id: 'new', fields: purchaseDataNew });
        renderPurchaseTable();

        bootstrap.Modal.getInstance(document.getElementById('purchaseModal')).hide();
        form.reset();

        showToast(t('success'), t('requestSubmitted'), 'success');
    } catch (error) {
        console.error('Submit failed:', error);
        showToast(t('error'), t('submitFailed'), 'error');
    }
}

// ==================== 设备详情 (IT Only) ====================
function showEquipmentDetail(recordId) {
    const equipment = equipmentData.find(e => e.id === recordId);
    if (!equipment) return;

    const f = equipment.fields;

    document.getElementById('detail-name').textContent = f['设备名称'] || '-';
    document.getElementById('detail-id').textContent = f['设备编号'] || '-';
    document.getElementById('detail-type').innerHTML = getTypeBadge(f['设备类型']);
    document.getElementById('detail-model').textContent = f['品牌型号'] || '-';
    document.getElementById('detail-status').innerHTML = getStatusBadge(f['当前状态']);
    document.getElementById('detail-user').textContent = f['使用人'] || '-';
    document.getElementById('detail-department').textContent = f['部门'] || '-';
    document.getElementById('detail-location').textContent = f['存放位置'] || '-';

    document.getElementById('detail-purchase-date').textContent = formatDate(f['采购日期']);
    document.getElementById('detail-price').textContent = formatCurrency(f['采购价格']);
    document.getElementById('detail-supplier').textContent = f['供应商'] || '-';
    document.getElementById('detail-life').textContent = f['使用期限(年)'] ? f['使用期限(年)'] + ' ' + t('years') : '-';
    document.getElementById('detail-retirement').textContent = formatDate(f['预计报废日期']);
    document.getElementById('detail-cycle').textContent = f['维护周期(月)'] ? f['维护周期(月)'] + ' ' + t('months') : '-';
    document.getElementById('detail-last-maintenance').textContent = formatDate(f['上次维护日期']);
    document.getElementById('detail-next-maintenance').textContent = formatDate(f['下次维护日期']);

    // Load maintenance history for this equipment
    const equipmentId = f['设备编号'];
    const history = maintenanceData.filter(m => m.fields['设备编号'] === equipmentId);
    const historyTbody = document.getElementById('detail-maintenance-history');

    if (history.length === 0) {
        historyTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">${t('noMaintenanceRecords')}</td></tr>`;
    } else {
        historyTbody.innerHTML = history.map(m => {
            const mf = m.fields;
            return `
                <tr>
                    <td><code>${mf['工单编号'] || '-'}</code></td>
                    <td>${mf['工单类型'] || '-'}</td>
                    <td>${truncateText(mf['问题描述'], 40)}</td>
                    <td>${formatDate(mf['提交日期'])}</td>
                    <td>${getProcessStatusBadge(mf['处理状态'])}</td>
                </tr>
            `;
        }).join('');
    }

    new bootstrap.Modal(document.getElementById('equipmentDetailModal')).show();
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
    return new Date(dateStr).toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : 'en-US');
}

function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return '$' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function truncateText(text, maxLength) {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function getMaintenanceDateDisplay(dateStr) {
    if (!dateStr) return `<span class="text-muted">${t('noMaintenanceNeeded')}</span>`;
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `<span class="date-overdue">${formatDate(dateStr)} (${t('overdue')})</span>`;
    } else if (diffDays <= 7) {
        return `<span class="date-soon">${formatDate(dateStr)} (${diffDays} ${t('daysLater')})</span>`;
    } else {
        return `<span class="date-ok">${formatDate(dateStr)}</span>`;
    }
}

// ==================== 状态标签 ====================
function getTypeBadge(type) {
    if (!type) return '-';
    const types = { '电子设备 Electronics': 'type-electronics', '仓库设备 Warehouse': 'type-warehouse', '办公设备 Office': 'type-office' };
    const displayText = currentLang === 'zh' ? type.split(' ')[0] : type.split(' ')[1] || type.split(' ')[0];
    return `<span class="badge ${types[type] || 'bg-secondary'}">${displayText}</span>`;
}

function getStatusBadge(status) {
    if (!status) return '-';
    const statuses = { '正常使用': 'status-normal', '维护中': 'status-maintenance', '待维修': 'status-repair', '已报废': 'status-retired' };
    const labels = { '正常使用': { zh: '正常使用', en: 'In Use' }, '维护中': { zh: '维护中', en: 'Maintenance' }, '待维修': { zh: '待维修', en: 'Needs Repair' }, '已报废': { zh: '已报废', en: 'Retired' } };
    return `<span class="badge ${statuses[status] || 'bg-secondary'}">${labels[status]?.[currentLang] || status}</span>`;
}

function getUrgencyBadge(urgency) {
    if (!urgency) return '-';
    const urgencies = { '低 Low': 'urgency-low', '中 Medium': 'urgency-medium', '高 High': 'urgency-high', '紧急 Urgent': 'urgency-urgent' };
    const displayText = currentLang === 'zh' ? urgency.split(' ')[0] : urgency.split(' ')[1] || urgency.split(' ')[0];
    return `<span class="badge ${urgencies[urgency] || 'bg-secondary'}">${displayText}</span>`;
}

function getProcessStatusBadge(status) {
    if (!status) return '-';
    const statuses = { '待处理 Pending': 'process-pending', '处理中 In Progress': 'process-progress', '等待配件 Waiting Parts': 'process-waiting', '已完成 Completed': 'process-completed', '已取消 Cancelled': 'process-cancelled' };
    const displayText = currentLang === 'zh' ? status.split(' ')[0] : status.split(' ').slice(1).join(' ') || status.split(' ')[0];
    return `<span class="badge ${statuses[status] || 'bg-secondary'}">${displayText}</span>`;
}

function getApprovalStatusBadge(status) {
    if (!status) return '-';
    const statuses = { '待审批 Pending': 'approval-pending', '已批准 Approved': 'approval-approved', '已拒绝 Rejected': 'approval-rejected', '采购中 Purchasing': 'approval-purchasing', '已完成 Completed': 'approval-completed' };
    const displayText = currentLang === 'zh' ? status.split(' ')[0] : status.split(' ').slice(1).join(' ') || status.split(' ')[0];
    return `<span class="badge ${statuses[status] || 'bg-secondary'}">${displayText}</span>`;
}

// ==================== Toast ====================
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-message').textContent = message;
    document.getElementById('toast-icon').className = type === 'success' ? 'bi bi-check-circle-fill text-success me-2' : 'bi bi-exclamation-circle-fill text-danger me-2';
    new bootstrap.Toast(toast).show();
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language
    const savedLang = localStorage.getItem('lang');
    if (savedLang) currentLang = savedLang;
    updateLanguage();

    // Enter key for IT login
    document.getElementById('it-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginAsIT();
    });
});

// ==================== Mock Data ====================
function getMockEquipment() {
    return [
        { id: 'rec1', fields: { '设备名称': 'Dell OptiPlex 7090', '设备编号': 'PC-2024-001', '设备类型': '电子设备 Electronics', '品牌型号': 'Dell OptiPlex 7090', '采购日期': '2024-01-15', '采购价格': 1200, '使用期限(年)': 5, '下次维护日期': '2025-02-01', '当前状态': '正常使用', '使用人': 'John Smith', '部门': '办公室 Office' }},
        { id: 'rec2', fields: { '设备名称': 'HP LaserJet Pro', '设备编号': 'PR-2024-001', '设备类型': '电子设备 Electronics', '品牌型号': 'HP LaserJet Pro M404dn', '采购日期': '2024-02-20', '采购价格': 450, '使用期限(年)': 5, '下次维护日期': '2025-01-25', '当前状态': '正常使用', '使用人': 'Front Desk', '部门': '办公室 Office' }},
        { id: 'rec3', fields: { '设备名称': 'Toyota Forklift', '设备编号': 'FL-2023-001', '设备类型': '仓库设备 Warehouse', '品牌型号': 'Toyota 8FGCU25', '采购日期': '2023-06-01', '采购价格': 25000, '使用期限(年)': 10, '下次维护日期': '2025-01-20', '当前状态': '待维修', '使用人': 'Warehouse Team', '部门': '仓库 Warehouse' }},
        { id: 'rec4', fields: { '设备名称': 'Standing Desk', '设备编号': 'OF-2024-001', '设备类型': '办公设备 Office', '品牌型号': 'Uplift V2', '采购日期': '2024-03-10', '采购价格': 600, '使用期限(年)': 10, '下次维护日期': null, '当前状态': '正常使用', '使用人': 'Manager Office', '部门': '办公室 Office' }},
        { id: 'rec5', fields: { '设备名称': 'Pallet Jack', '设备编号': 'PJ-2024-001', '设备类型': '仓库设备 Warehouse', '品牌型号': 'Crown PTH50', '采购日期': '2024-01-05', '采购价格': 3500, '使用期限(年)': 8, '下次维护日期': '2025-03-01', '当前状态': '维护中', '使用人': 'Warehouse Team', '部门': '仓库 Warehouse' }}
    ];
}

function getMockMaintenance() {
    return [
        { id: 'mt1', fields: { '工单编号': 'MT-20250120-001', '设备名称': 'Toyota Forklift', '设备编号': 'FL-2023-001', '工单类型': '故障维修', '问题描述': '液压系统漏油，升降功能异常', '紧急程度': '高 High', '提交人': 'Mike Chen', '提交日期': '2025-01-20', '处理状态': '处理中 In Progress' }},
        { id: 'mt2', fields: { '工单编号': 'MT-20250118-001', '设备名称': 'Pallet Jack', '设备编号': 'PJ-2024-001', '工单类型': '定期维护', '问题描述': '年度维护保养', '紧急程度': '低 Low', '提交人': 'System', '提交日期': '2025-01-18', '处理状态': '已完成 Completed' }}
    ];
}

function getMockPurchase() {
    return [
        { id: 'pr1', fields: { '申请编号': 'PR-20250115-001', '设备名称': 'MacBook Pro 14"', '设备类型': '电子设备 Electronics', '数量': 2, '总价预估': 4800, '申请人': 'Sarah Wang', '申请日期': '2025-01-15', '审批状态': '已批准 Approved' }},
        { id: 'pr2', fields: { '申请编号': 'PR-20250122-001', '设备名称': 'Office Chair', '设备类型': '办公设备 Office', '数量': 5, '总价预估': 1500, '申请人': 'Tom Lee', '申请日期': '2025-01-22', '审批状态': '待审批 Pending' }}
    ];
}
