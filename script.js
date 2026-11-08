const BACKEND_DOMAIN = 'https://xyurabckend.vercel.app';

const URL = BACKEND_DOMAIN + '/api/balance';
const Ya = 'sb_publishable_CPc6Un3PW8bCZf2exiamkg_KVtZD8N8';

const SUPA_URL = 'https://cdlakczwzpdoifutsqaw.supabase.co';
const SUPA_KEY = 'sb_publishable_CPc6Un3PW8bCZf2exiamkg_KVtZD8N8';

const DB_NAME = 'YussXyAdminDB';
const DB_VERSION = 2;
const STORE_TOPUP = 'topup_history';
const STORE_PROFIT = 'profit_history';

let currentUser = null;
let allUsers = [];
let allBanned = [];
let allTransaksi = [];
let passVisible = false;
let profitType = 'pemasukan';
let saldoAction = 'add';
let currentUserView = 'detail';
let confirmCallback = null;
let formCallback = null;
let lastTopupPhone = '';
let lastReceiptData = null;

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    setupClock();
    setupNavigation();
    setupSearch();
    setupSaldoForm();
    setupProfitForm();
    setupTransaksi();
    setupSettings();
    setupUserActions();
    setupModals();
    setupInstallButton();

    loadDashboard();
    loadRecentActivity();
    loadProfitSummary();
    loadProfitList();
});

/* ============================================
   TEMA
   ============================================ */
function initTheme() {
    var saved = localStorage.getItem('admin_theme') || 'light';
    applyTheme(saved);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
        var icon = document.getElementById('themeIcon');
        if (icon) icon.className = 'ri-sun-line';
    } else {
        document.body.classList.remove('theme-dark');
        var icon = document.getElementById('themeIcon');
        if (icon) icon.className = 'ri-moon-line';
    }

    document.querySelectorAll('.theme-option').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    localStorage.setItem('admin_theme', theme);
}

function toggleTheme() {
    var current = localStorage.getItem('admin_theme') || 'light';
    var next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    showToast(next === 'dark' ? 'Tema Dark aktif' : 'Tema Light aktif');
}

function setupThemeButtons() {
    var btn = document.getElementById('themeBtn');
    if (btn) btn.addEventListener('click', toggleTheme);

    document.querySelectorAll('.theme-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            applyTheme(this.dataset.theme);
            showToast('Tema diganti');
        });
    });
}

/* ============================================
   JAM
   ============================================ */
function setupClock() {
    function update() {
        var now = new Date();
        var jam = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        var tgl = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        var t = document.getElementById('clockTime');
        var d = document.getElementById('clockDate');
        if (t) t.textContent = jam;
        if (d) d.textContent = tgl;
    }
    update();
    setInterval(update, 30000);

    var hour = new Date().getHours();
    var greeting = 'Selamat Malam';
    if (hour < 11) greeting = 'Selamat Pagi';
    else if (hour < 15) greeting = 'Selamat Siang';
    else if (hour < 18) greeting = 'Selamat Sore';
    var el = document.getElementById('heroGreeting');
    if (el) el.textContent = greeting;
}

/* ============================================
   NAVIGASI TAB
   ============================================ */
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tab = this.dataset.tab;
            if (tab === 'more') {
                openMoreMenu();
                return;
            }
            switchTab(tab);
        });
    });

    document.querySelectorAll('.more-menu-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tab = this.dataset.tab;
            closeMoreMenu();
            setTimeout(function() { switchTab(tab); }, 200);
        });
    });

    document.querySelectorAll('.quick-menu-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    var closeBtn = document.getElementById('closeMoreMenu');
    if (closeBtn) closeBtn.addEventListener('click', closeMoreMenu);

    var menu = document.getElementById('moreMenu');
    if (menu) {
        menu.addEventListener('click', function(e) {
            if (e.target === menu) closeMoreMenu();
        });
    }
}

function switchTab(tab) {
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });

    var btn = document.querySelector('.nav-btn[data-tab="' + tab + '"]');
    if (btn) btn.classList.add('active');

    var content = document.getElementById('tab-' + tab);
    if (content) content.classList.add('active');

    if (tab === 'transaksi') loadAllTransaksi();
    if (tab === 'stats') {
        loadStats();
        loadTopSpenders();
        loadTopUsers();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openMoreMenu() {
    var menu = document.getElementById('moreMenu');
    if (menu) menu.classList.add('active');
}

function closeMoreMenu() {
    var menu = document.getElementById('moreMenu');
    if (menu) menu.classList.remove('active');
}

/* ============================================
   INDEXEDDB
   ============================================ */
function openDB() {
    return new Promise(function(resolve, reject) {
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_TOPUP)) {
                var s1 = db.createObjectStore(STORE_TOPUP, { keyPath: 'id' });
                s1.createIndex('created_at', 'created_at', { unique: false });
            }
            if (!db.objectStoreNames.contains(STORE_PROFIT)) {
                var s2 = db.createObjectStore(STORE_PROFIT, { keyPath: 'id' });
                s2.createIndex('created_at', 'created_at', { unique: false });
            }
        };
        req.onsuccess = function(e) { resolve(e.target.result); };
        req.onerror = function(e) { reject(e.target.error); };
    });
}

function dbPut(store, record) {
    return new Promise(function(resolve, reject) {
        openDB().then(function(db) {
            var tx = db.transaction([store], 'readwrite');
            var req = tx.objectStore(store).put(record);
            req.onsuccess = function() { resolve(); };
            req.onerror = function(e) { reject(e.target.error); };
        }).catch(reject);
    });
}

function dbGetAll(store) {
    return new Promise(function(resolve, reject) {
        openDB().then(function(db) {
            var tx = db.transaction([store], 'readonly');
            var req = tx.objectStore(store).getAll();
            req.onsuccess = function() { resolve(req.result || []); };
            req.onerror = function(e) { reject(e.target.error); };
        }).catch(reject);
    });
}

function dbClear(store) {
    return new Promise(function(resolve, reject) {
        openDB().then(function(db) {
            var tx = db.transaction([store], 'readwrite');
            var req = tx.objectStore(store).clear();
            req.onsuccess = function() { resolve(); };
            req.onerror = function(e) { reject(e.target.error); };
        }).catch(reject);
    });
}

/* ============================================
   CARI USER
   ============================================ */
function setupSearch() {
    var input = document.getElementById('userSearchInput');
    var btn = document.getElementById('userSearchBtn');

    if (btn) btn.addEventListener('click', searchUser);
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchUser();
        });
    }

    document.querySelectorAll('.tabs-mini-btn').forEach(function(b) {
        b.addEventListener('click', function() {
            var view = this.dataset.view;
            switchUserView(view);
        });
    });
}

function switchUserView(view) {
    currentUserView = view;

    document.querySelectorAll('.tabs-mini-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.view === view);
    });

    document.querySelectorAll('.user-view').forEach(function(v) {
        v.style.display = 'none';
    });

    var target = document.getElementById('view-' + view);
    if (target) target.style.display = 'block';

    if (view === 'list') loadAllUsers();
    if (view === 'banned') loadBannedUsers();
}

async function searchUser() {
    var query = document.getElementById('userSearchInput').value.trim();
    if (!query) {
        showToast('Masukkan username atau HP', true);
        return;
    }

    showLoading('Mencari user...');

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': Ya
            },
            body: JSON.stringify({
                action: 'admin_get_user',
                username: query
            })
        });

        var data = await res.json();

        if (!data.success || !data.data) {
            var res2 = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': Ya
                },
                body: JSON.stringify({
                    action: 'admin_get_user',
                    phone: query
                })
            });
            data = await res2.json();
        }

        hideLoading();

        if (!data.success || !data.data) {
            showToast('User tidak ditemukan', true);
            document.getElementById('userProfileCard').style.display = 'none';
            document.getElementById('userEmptyState').style.display = 'block';
            return;
        }

        var user = data.data;
        user._password = await fetchPassword(user.username);

        currentUser = user;
        renderUserProfile(user);
        document.getElementById('userProfileCard').style.display = 'block';
        document.getElementById('userEmptyState').style.display = 'none';
        document.getElementById('userHistoryCard').style.display = 'none';

    } catch(e) {
        hideLoading();
        console.error(e);
        showToast('Gagal koneksi ke server', true);
    }
}

async function fetchPassword(username) {
    try {
        var url = SUPA_URL + '/rest/v1/user_balance?select=password&username=eq.' + encodeURIComponent(username.toLowerCase()) + '&limit=1';
        var res = await fetch(url, {
            headers: {
                'apikey': SUPA_KEY,
                'Authorization': 'Bearer ' + SUPA_KEY
            }
        });

        if (!res.ok) return '-';

        var data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            return data[0].password || '-';
        }
        return '-';
    } catch(e) {
        return '-';
    }
}

function renderUserProfile(user) {
    var username = user.username || '-';
    var initial = username.charAt(0).toUpperCase();

    document.getElementById('profileAvatar').textContent = initial;
    document.getElementById('profileUsername').textContent = username;
    document.getElementById('profilePhone').textContent = user.phone || '-';
    document.getElementById('profileRole').textContent = user.role || 'user';

    var trxList = Array.isArray(user.trx_id) ? user.trx_id : [];
    var totalKeluar = hitungTotalKeluar(trxList);

    document.getElementById('profileBalance').textContent = 'Rp ' + (user.balance || 0).toLocaleString('id-ID');
    document.getElementById('profileSpent').textContent = 'Rp ' + totalKeluar.toLocaleString('id-ID');

    document.getElementById('detailUsername').textContent = username;
    document.getElementById('detailPhone').textContent = user.phone || '-';
    document.getElementById('detailRole').textContent = user.role || 'user';
    document.getElementById('detailDevice').textContent = user.device_id || '-';

    var passEl = document.getElementById('detailPassword');
    if (passEl) {
        passEl.textContent = '••••••••';
        passEl.dataset.password = user._password || '-';
        passEl.classList.remove('show');
        passVisible = false;
        var toggleBtn = document.getElementById('togglePasswordBtn');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="ri-eye-line"></i>';
    }

    if (user.created_at) {
        var d = new Date(user.created_at);
        document.getElementById('detailJoin').textContent = d.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    } else {
        document.getElementById('detailJoin').textContent = '-';
    }

    document.getElementById('detailTrxCount').textContent = trxList.length + 'x';
    document.getElementById('detailLoginCount').textContent = (user.login_count || 0) + 'x';

    if (user.last_login) {
        var d2 = new Date(user.last_login);
        document.getElementById('detailLastLogin').textContent = d2.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        }) + ' ' + d2.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else {
        document.getElementById('detailLastLogin').textContent = '-';
    }
}

function hitungTotalKeluar(trxList) {
    var total = 0;
    if (!Array.isArray(trxList)) return 0;
    trxList.forEach(function(t) {
        if (!t) return;
        var type = t.type || '';
        if (type === 'deposit' || type === 'transfer_in') return;
        total += t.amount || 0;
    });
    return total;
}

function togglePassword() {
    var el = document.getElementById('detailPassword');
    var btn = document.getElementById('togglePasswordBtn');
    if (!el) return;

    if (passVisible) {
        el.textContent = '••••••••';
        el.classList.remove('show');
        passVisible = false;
        if (btn) btn.innerHTML = '<i class="ri-eye-line"></i>';
    } else {
        el.textContent = el.dataset.password || '-';
        el.classList.add('show');
        passVisible = true;
        if (btn) btn.innerHTML = '<i class="ri-eye-off-line"></i>';
    }
}

/* ============================================
   USER ACTIONS
   ============================================ */
function setupUserActions() {
    var toggle = document.getElementById('togglePasswordBtn');
    if (toggle) toggle.addEventListener('click', togglePassword);

    document.getElementById('userAddSaldoBtn').addEventListener('click', function() {
        if (!currentUser) return;
        switchTab('saldo');
        document.getElementById('saldoUsername').value = currentUser.username;
        document.querySelector('.type-btn[data-action="add"]').click();
    });

    document.getElementById('userSubSaldoBtn').addEventListener('click', function() {
        if (!currentUser) return;
        switchTab('saldo');
        document.getElementById('saldoUsername').value = currentUser.username;
        document.querySelector('.type-btn[data-action="sub"]').click();
    });

    document.getElementById('userSetSaldoBtn').addEventListener('click', function() {
        if (!currentUser) return;
        switchTab('saldo');
        document.getElementById('saldoUsername').value = currentUser.username;
        document.querySelector('.type-btn[data-action="set"]').click();
    });

    document.getElementById('userEditProfileBtn').addEventListener('click', showEditProfileModal);
    document.getElementById('userResetDeviceBtn').addEventListener('click', confirmResetDevice);
    document.getElementById('userForceLogoutBtn').addEventListener('click', confirmForceLogout);
    document.getElementById('userHistoryBtn').addEventListener('click', viewUserHistory);
    document.getElementById('userClearTrxBtn').addEventListener('click', confirmClearTrx);
    document.getElementById('userBanBtn').addEventListener('click', showBanModal);
    document.getElementById('closeUserHistoryBtn').addEventListener('click', function() {
        document.getElementById('userHistoryCard').style.display = 'none';
    });
}

function showEditProfileModal() {
    if (!currentUser) return;
    showFormModal('Edit Profile', [
        { id: 'edit_username', label: 'Username Baru', value: currentUser.username, icon: 'ri-user-line' },
        { id: 'edit_phone', label: 'Nomor HP', value: currentUser.phone || '', icon: 'ri-phone-line' },
        { id: 'edit_password', label: 'Password Baru (opsional)', value: '', icon: 'ri-lock-line', type: 'password' }
    ], function(values) {
        var newUsername = values.edit_username.trim();
        var newPhone = values.edit_phone.trim();
        var newPassword = values.edit_password.trim();

        if (!newUsername) {
            showToast('Username tidak boleh kosong', true);
            return;
        }

        var body = {
            action: 'update_profile',
            username: currentUser.username
        };

        if (newUsername !== currentUser.username) body.new_username = newUsername;
        if (newPhone && newPhone !== currentUser.phone) body.phone = newPhone;
        if (newPassword) {
            body.password = currentUser._password || '';
            body.new_password = newPassword;
        }

        if (Object.keys(body).length === 2) {
            showToast('Tidak ada yang diubah', true);
            return;
        }

        showLoading('Menyimpan...');
        fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify(body)
        })
        .then(function(r) { return r.json(); })
        .then(function(d) {
            hideLoading();
            if (d.success) {
                showToast('Profile berhasil diupdate');
                closeFormModal();
                if (newUsername !== currentUser.username) {
                    searchUserByQuery(newUsername);
                } else {
                    searchUserByQuery(currentUser.username);
                }
            } else {
                showToast(d.message || 'Gagal update profile', true);
            }
        })
        .catch(function(e) {
            hideLoading();
            showToast('Gagal koneksi', true);
        });
    });
}

function searchUserByQuery(query) {
    document.getElementById('userSearchInput').value = query;
    searchUser();
}

function confirmResetDevice() {
    if (!currentUser) return;

    showConfirmModal('Reset Device ID', [
        { label: 'User', value: currentUser.username },
        { label: 'Device ID Lama', value: currentUser.device_id || '-' },
        { label: 'Device ID Baru', value: 'Generated', danger: false }
    ], function() {
        var newDeviceId = generateDeviceId();
        showLoading('Reset device...');
        fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: 'update_device_id',
                username: currentUser.username,
                device_id: newDeviceId
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(d) {
            hideLoading();
            if (d.success) {
                showToast('Device ID direset');
                closeConfirmModal();
                searchUserByQuery(currentUser.username);
            } else {
                showToast(d.message || 'Gagal reset device', true);
            }
        })
        .catch(function() { hideLoading(); showToast('Gagal koneksi', true); });
    });
}

function confirmForceLogout() {
    if (!currentUser) return;

    showConfirmModal('Force Logout', [
        { label: 'User', value: currentUser.username },
        { label: 'Aksi', value: 'Logout dari semua perangkat', danger: true }
    ], function() {
        showLoading('Memproses...');
        fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: 'force_logout',
                username: currentUser.username
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(d) {
            hideLoading();
            if (d.success) {
                showToast('User berhasil di-logout');
                closeConfirmModal();
            } else {
                showToast(d.message || 'Gagal force logout', true);
            }
        })
        .catch(function() { hideLoading(); showToast('Gagal koneksi', true); });
    });
}

function confirmClearTrx() {
    if (!currentUser) return;

    var trxCount = Array.isArray(currentUser.trx_id) ? currentUser.trx_id.length : 0;

    showConfirmModal('Hapus Riwayat', [
        { label: 'User', value: currentUser.username },
        { label: 'Jumlah Riwayat', value: trxCount + ' transaksi', danger: true },
        { label: 'Peringatan', value: 'Tidak bisa dibatalkan!', danger: true }
    ], function() {
        showLoading('Menghapus...');
        fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: 'clear_transactions',
                username: currentUser.username
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(d) {
            hideLoading();
            if (d.success) {
                showToast('Riwayat dihapus');
                closeConfirmModal();
                searchUserByQuery(currentUser.username);
            } else {
                showToast(d.message || 'Gagal hapus riwayat', true);
            }
        })
        .catch(function() { hideLoading(); showToast('Gagal koneksi', true); });
    });
}

function showBanModal() {
    if (!currentUser) return;

    showFormModal('Ban User', [
        { id: 'ban_reason', label: 'Alasan Ban', value: '', icon: 'ri-forbid-2-line', placeholder: 'Contoh: Melanggar aturan' }
    ], function(values) {
        var reason = values.ban_reason.trim() || 'Melanggar aturan';

        showConfirmModal('Konfirmasi Ban', [
            { label: 'User', value: currentUser.username },
            { label: 'Alasan', value: reason, danger: true }
        ], function() {
            showLoading('Ban user...');
            fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
                body: JSON.stringify({
                    action: 'ban',
                    identifier: currentUser.username,
                    type: 'username',
                    reason: reason
                })
            })
            .then(function(r) { return r.json(); })
            .then(function(d) {
                hideLoading();
                if (d.success) {
                    showToast('User diblokir');
                    closeConfirmModal();
                    closeFormModal();
                    loadBannedUsers();
                } else {
                    showToast(d.message || 'Gagal ban', true);
                }
            })
            .catch(function() { hideLoading(); showToast('Gagal koneksi', true); });
        });
    });
}

function generateDeviceId() {
    var chars = 'ABCDEF0123456789';
    var result = '';
    for (var i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/* ============================================
   RIWAYAT TRANSAKSI USER
   ============================================ */
async function viewUserHistory() {
    if (!currentUser) return;

    showLoading('Memuat riwayat...');

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: 'get_transactions',
                username: currentUser.username
            })
        });
        var data = await res.json();
        hideLoading();

        var transactions = [];
        if (data.success && data.data && data.data.transactions) {
            transactions = data.data.transactions;
        }

        transactions.sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });

        renderUserHistory(transactions);
        document.getElementById('userHistoryCard').style.display = 'block';

    } catch(e) {
        hideLoading();
        showToast('Gagal memuat riwayat', true);
    }
}

function renderUserHistory(transactions) {
    var list = document.getElementById('userHistoryList');
    var summary = document.getElementById('userHistorySummary');

    if (transactions.length === 0) {
        list.innerHTML = '<div class="riwayat-empty"><i class="ri-inbox-line"></i><p>Belum ada transaksi</p></div>';
        summary.innerHTML = '';
        return;
    }

    var totalIn = 0;
    var totalOut = 0;

    list.innerHTML = transactions.map(function(t) {
        var type = t.type || '';
        var isDeposit = type === 'deposit' || type === 'transfer_in';
        if (isDeposit) totalIn += t.amount || 0;
        else totalOut += t.amount || 0;

        var date = new Date(t.created_at);
        var tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        var jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        var bg = isDeposit ? '#dcfce7' : '#fee2e2';
        var color = isDeposit ? '#10b981' : '#ec4899';
        var sign = isDeposit ? '+' : '-';

        return '<div class="user-history-item" style="background:' + bg + ';">' +
            '<div class="user-history-left">' +
                '<div class="user-history-name">' + (t.product_name || type || 'Transaksi') + '</div>' +
                '<div class="user-history-date">' + tgl + ' - ' + jam + '</div>' +
            '</div>' +
            '<div class="user-history-amount" style="color:' + color + ';">' +
                sign + ' Rp ' + (t.amount || 0).toLocaleString('id-ID') +
            '</div>' +
        '</div>';
    }).join('');

    summary.innerHTML = '<div class="summary-row"><span>Total Masuk</span><span style="color:#34d399;">+ Rp ' + totalIn.toLocaleString('id-ID') + '</span></div>' +
        '<div class="summary-row"><span>Total Keluar</span><span style="color:#f472b6;">- Rp ' + totalOut.toLocaleString('id-ID') + '</span></div>' +
        '<div class="summary-row"><span>Jumlah Transaksi</span><span>' + transactions.length + 'x</span></div>';
}

/* ============================================
   SEMUA USER
   ============================================ */
async function loadAllUsers() {
    var container = document.getElementById('userListContainer');
    if (!container) return;

    showLoading('Memuat semua user...');

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({ action: 'get_all_users' })
        });
        var data = await res.json();
        hideLoading();

        if (data.success && data.users) {
            allUsers = data.users;
            document.getElementById('totalUserCount').textContent = allUsers.length;
            renderUserList(allUsers);
        } else {
            container.innerHTML = '<div class="empty-state"><i class="ri-error-warning-line"></i><p>Gagal memuat</p></div>';
        }
    } catch(e) {
        hideLoading();
        container.innerHTML = '<div class="empty-state"><i class="ri-error-warning-line"></i><p>Gagal koneksi</p></div>';
    }
}

function renderUserList(users) {
    var container = document.getElementById('userListContainer');
    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="ri-user-line"></i><p>Belum ada user</p></div>';
        return;
    }

    container.innerHTML = users.map(function(u) {
        var username = u.username || u.phone || 'Anonymous';
        var initial = username.charAt(0).toUpperCase();
        var color = getColorFromName(username);

        return '<div class="user-list-item" onclick="openUserFromList(\'' + username + '\')">' +
            '<div class="user-list-avatar" style="background:' + color + ';">' + initial + '</div>' +
            '<div class="user-list-info">' +
                '<div class="user-list-name">' + username + '</div>' +
                '<div class="user-list-sub">' + (u.phone || '-') + '</div>' +
            '</div>' +
            '<div class="user-list-balance">Rp ' + (u.balance || 0).toLocaleString('id-ID') + '</div>' +
        '</div>';
    }).join('');
}

function openUserFromList(username) {
    switchUserView('detail');
    document.getElementById('userSearchInput').value = username;
    searchUser();
}

function getColorFromName(name) {
    var colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#f97316', '#a855f7'];
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/* ============================================
   BANNED USERS
   ============================================ */
async function loadBannedUsers() {
    var container = document.getElementById('bannedListContainer');
    if (!container) return;

    showLoading('Memuat banned...');

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({ action: 'get_banned_list' })
        });
        var data = await res.json();
        hideLoading();

        if (data.success && data.data) {
            allBanned = data.data;
            document.getElementById('totalBannedCount').textContent = allBanned.length;
            renderBannedList(allBanned);
        } else {
            container.innerHTML = '<div class="empty-state"><i class="ri-forbid-2-line"></i><p>Tidak ada user banned</p></div>';
        }
    } catch(e) {
        hideLoading();
        container.innerHTML = '<div class="empty-state"><i class="ri-error-warning-line"></i><p>Gagal koneksi</p></div>';
    }
}

function renderBannedList(users) {
    var container = document.getElementById('bannedListContainer');
    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="ri-forbid-2-line"></i><p>Tidak ada user banned</p><span>Semua user bersih</span></div>';
        return;
    }

    container.innerHTML = users.map(function(u) {
        var username = u.username || u.phone || 'Anonymous';
        var banDate = u.banned_at ? new Date(u.banned_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

        return '<div class="banned-item">' +
            '<div class="banned-item-header">' +
                '<div class="banned-icon"><i class="ri-forbid-2-line"></i></div>' +
                '<div class="banned-info">' +
                    '<div class="banned-name">' + username + '</div>' +
                    '<div class="banned-reason">' + (u.ban_reason || 'Tidak ada alasan') + '</div>' +
                    '<div class="banned-date">Di-ban: ' + banDate + '</div>' +
                '</div>' +
            '</div>' +
            '<button class="banned-unban-btn" onclick="unbanUser(\'' + username + '\')">' +
                '<i class="ri-check-line"></i> Unban' +
            '</button>' +
        '</div>';
    }).join('');
}

function unbanUser(username) {
    showConfirmModal('Unban User', [
        { label: 'User', value: username },
        { label: 'Aksi', value: 'Buka blokir user' }
    ], function() {
        showLoading('Unban...');
        fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: 'unban',
                identifier: username,
                type: 'username'
            })
        })
        .then(function(r) { return r.json(); })
        .then(function(d) {
            hideLoading();
            if (d.success) {
                showToast('User di-unban');
                closeConfirmModal();
                loadBannedUsers();
            } else {
                showToast(d.message || 'Gagal unban', true);
            }
        })
        .catch(function() { hideLoading(); showToast('Gagal koneksi', true); });
    });
}

/* ============================================
   FORM SALDO
   ============================================ */
function setupSaldoForm() {
    document.querySelectorAll('.type-btn[data-action]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.type-btn[data-action]').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            saldoAction = this.dataset.action;
        });
    });

    document.querySelectorAll('.quick-amt-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.getElementById('saldoAmount').value = this.dataset.amount;
            document.querySelectorAll('.quick-amt-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    document.getElementById('saldoSubmitBtn').addEventListener('click', submitSaldo);
}

async function submitSaldo() {
    var username = document.getElementById('saldoUsername').value.trim();
    var amount = parseInt(document.getElementById('saldoAmount').value) || 0;
    var note = document.getElementById('saldoNote').value.trim() || '-';

    if (!username) {
        showToast('Masukkan username', true);
        return;
    }
    if (amount < 0 || (saldoAction !== 'set' && amount < 1)) {
        showToast('Masukkan jumlah yang valid', true);
        return;
    }
    if (saldoAction === 'set' && amount < 0) {
        showToast('Jumlah tidak boleh negatif', true);
        return;
    }

    showLoading('Mencari user...');

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: 'search_user',
                query: username
            })
        });
        var data = await res.json();
        hideLoading();

        if (!data.success || !data.data) {
            showToast('User tidak ditemukan', true);
            return;
        }

        var user = data.data;
        var oldBalance = user.balance || 0;
        var newBalance = oldBalance;

        if (saldoAction === 'add') newBalance = oldBalance + amount;
        else if (saldoAction === 'sub') newBalance = Math.max(0, oldBalance - amount);
        else if (saldoAction === 'set') newBalance = amount;

        var actionLabel = saldoAction === 'add' ? 'Tambah Saldo' :
                          saldoAction === 'sub' ? 'Kurangi Saldo' : 'Set Saldo';

        showConfirmModal(actionLabel, [
            { label: 'User', value: user.username },
            { label: 'Saldo Lama', value: 'Rp ' + oldBalance.toLocaleString('id-ID') },
            { label: saldoAction === 'sub' ? 'Dikurangi' : (saldoAction === 'set' ? 'Set Ke' : 'Ditambah'), value: 'Rp ' + amount.toLocaleString('id-ID'), amount: true },
            { label: 'Saldo Akhir', value: 'Rp ' + newBalance.toLocaleString('id-ID'), amount: true },
            { label: 'Catatan', value: note }
        ], function() {
            executeSaldo(user, oldBalance, newBalance, amount, note, saldoAction);
        });

    } catch(e) {
        hideLoading();
        showToast('Gagal koneksi', true);
    }
}

async function executeSaldo(user, oldBalance, newBalance, amount, note, action) {
    closeConfirmModal();
    showLoading('Memproses...');

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: action,
                username: user.username,
                amount: amount
            })
        });

        var data = await res.json();

        if (!data.success) {
            hideLoading();
            showToast(data.message || 'Gagal proses saldo', true);
            return;
        }

        var trxId = 'ADM' + Date.now().toString().slice(-10);
        var createdAt = new Date().toISOString();

        var historyRecord = {
            id: trxId,
            username: user.username,
            amount: amount,
            note: note,
            action: action,
            old_balance: oldBalance,
            new_balance: newBalance,
            created_at: createdAt
        };

        try { await dbPut(STORE_TOPUP, historyRecord); } catch(e) {}

        if (action === 'add') {
            var profitRecord = {
                id: 'PRF' + Date.now().toString().slice(-10),
                type: 'pemasukan',
                kategori: 'Top Up ' + user.username,
                amount: amount,
                note: note,
                created_at: createdAt
            };
            try { await dbPut(STORE_PROFIT, profitRecord); } catch(e) {}
        }

        fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({
                action: 'add_transaction',
                username: user.username,
                trx_id: {
                    id: trxId,
                    product_name: action === 'add' ? 'Top Up Saldo' : (action === 'sub' ? 'Kurangi Saldo' : 'Set Saldo'),
                    type: 'deposit',
                    amount: amount,
                    method: 'admin_manual',
                    admin_action: action,
                    note: note,
                    status: 'success',
                    created_at: createdAt
                }
            })
        }).catch(function() {});

        hideLoading();

        var actionText = action === 'add' ? 'ditambahkan' : (action === 'sub' ? 'dikurangi' : 'diset');

        document.getElementById('successDetail').innerHTML =
            '<div class="success-row"><span class="label">User</span><span class="value">' + user.username + '</span></div>' +
            '<div class="success-row"><span class="label">Aksi</span><span class="value">' + actionLabelFull(action) + '</span></div>' +
            '<div class="success-row"><span class="label">Saldo Akhir</span><span class="value">Rp ' + newBalance.toLocaleString('id-ID') + '</span></div>' +
            '<div class="success-row"><span class="label">TRX ID</span><span class="value">' + trxId + '</span></div>';

        lastReceiptData = {
            username: user.username,
            amount: amount,
            oldBalance: oldBalance,
            newBalance: newBalance,
            note: note,
            action: action,
            trxId: trxId
        };
        lastTopupPhone = user.phone || '';

        document.getElementById('receiptText').textContent = generateReceipt(lastReceiptData);
        document.getElementById('receiptBox').style.display = action === 'add' ? 'block' : 'none';
        document.getElementById('receiptActions').style.display = action === 'add' ? 'grid' : 'none';

        document.getElementById('successModal').classList.add('active');

        document.getElementById('saldoUsername').value = '';
        document.getElementById('saldoAmount').value = '';
        document.getElementById('saldoNote').value = '';
        document.querySelectorAll('.quick-amt-btn').forEach(function(b) { b.classList.remove('active'); });

        loadDashboard();
        loadRecentActivity();
        loadProfitSummary();
        loadProfitList();

    } catch(e) {
        hideLoading();
        showToast('Gagal koneksi', true);
    }
}

function actionLabelFull(action) {
    if (action === 'add') return 'Tambah Saldo';
    if (action === 'sub') return 'Kurangi Saldo';
    if (action === 'set') return 'Set Saldo';
    return 'Proses';
}

function generateReceipt(data) {
    var now = new Date();
    var tgl = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    var jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    var msg = 'Halo Kak 👋\n\n';
    msg += 'Saldo YussXy Store kamu sudah masuk ✅\n\n';
    msg += '📋 DETAIL TOP UP\n';
    msg += '━━━━━━━━━━━━━━━━━━\n';
    msg += 'Username   : ' + data.username + '\n';
    msg += 'Ditambah   : Rp ' + data.amount.toLocaleString('id-ID') + '\n';
    msg += 'Saldo Awal : Rp ' + data.oldBalance.toLocaleString('id-ID') + '\n';
    msg += 'Saldo Akhir: Rp ' + data.newBalance.toLocaleString('id-ID') + '\n';
    if (data.note && data.note !== '-') {
        msg += 'Catatan    : ' + data.note + '\n';
    }
    msg += '━━━━━━━━━━━━━━━━━━\n';
    msg += 'TRX ID     : ' + data.trxId + '\n';
    msg += 'Tanggal    : ' + tgl + '\n';
    msg += 'Jam        : ' + jam + '\n';
    msg += '━━━━━━━━━━━━━━━━━━\n\n';
    msg += 'Terima kasih sudah top up di YussXy Store 🙏\n';
    msg += 'Saldo bisa langsung dipakai untuk pembelian.';

    return msg;
}

function copyReceipt() {
    var text = document.getElementById('receiptText').textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(function() {
        showToast('Struk disalin');
    }).catch(function() {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showToast('Struk disalin');
        } catch(e) {
            showToast('Gagal menyalin', true);
        }
        document.body.removeChild(ta);
    });
}

function sendReceiptToWA() {
    var text = document.getElementById('receiptText').textContent;
    if (!text) return;

    var phone = lastTopupPhone || '';
    phone = phone.replace(/\D/g, '');

    if (phone && !phone.startsWith('62') && phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
    }

    var waUrl = phone
        ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text)
        : 'https://wa.me/?text=' + encodeURIComponent(text);

    window.open(waUrl, '_blank');
}

/* ============================================
   PROFIT
   ============================================ */
function setupProfitForm() {
    document.querySelectorAll('.type-selector .type-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.type-selector .type-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            profitType = this.dataset.type;
        });
    });

    document.querySelectorAll('.quick-profit-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.getElementById('profitAmount').value = this.dataset.amount;
            document.querySelectorAll('.quick-profit-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    document.getElementById('submitProfitBtn').addEventListener('click', saveProfit);
    document.getElementById('clearProfit').addEventListener('click', clearProfitHistory);
    document.getElementById('filterProfitType').addEventListener('change', filterProfit);
}

async function saveProfit() {
    var kategori = document.getElementById('profitKategori').value.trim();
    var amount = parseInt(document.getElementById('profitAmount').value) || 0;
    var note = document.getElementById('profitNote').value.trim() || '-';

    if (!kategori) {
        showToast('Masukkan kategori', true);
        return;
    }
    if (amount < 1) {
        showToast('Masukkan jumlah', true);
        return;
    }

    var record = {
        id: 'PRF' + Date.now().toString().slice(-10),
        type: profitType,
        kategori: kategori,
        amount: amount,
        note: note,
        created_at: new Date().toISOString()
    };

    try {
        await dbPut(STORE_PROFIT, record);
        showToast('Catatan disimpan');
        document.getElementById('profitKategori').value = '';
        document.getElementById('profitAmount').value = '';
        document.getElementById('profitNote').value = '';
        document.querySelectorAll('.quick-profit-btn').forEach(function(b) { b.classList.remove('active'); });
        loadProfitList();
        loadProfitSummary();
    } catch(e) {
        showToast('Gagal menyimpan', true);
    }
}

async function loadProfitList() {
    var records = [];
    try { records = await dbGetAll(STORE_PROFIT); } catch(e) {}
    records.sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });

    var list = document.getElementById('profitList');
    var count = document.getElementById('profitCount');
    if (!list) return;

    if (count) count.textContent = records.length;

    if (records.length === 0) {
        list.innerHTML = '<div class="riwayat-empty"><i class="ri-inbox-line"></i><p>Belum ada catatan</p></div>';
        return;
    }

    list.innerHTML = records.map(function(t) {
        var date = new Date(t.created_at);
        var tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        var jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        var isIn = t.type === 'pemasukan';
        var sign = isIn ? '+' : '-';
        var color = isIn ? 'var(--success)' : 'var(--danger)';
        var icon = isIn ? 'ri-arrow-down-line' : 'ri-arrow-up-line';

        return '<div class="riwayat-item">' +
            '<div class="riwayat-icon" style="background:' + color + ';"><i class="' + icon + '"></i></div>' +
            '<div class="riwayat-info">' +
                '<div class="riwayat-user">' + t.kategori + '</div>' +
                '<div class="riwayat-nominal" style="color:' + color + ';">' + sign + ' Rp ' + (t.amount || 0).toLocaleString('id-ID') + '</div>' +
                '<div class="riwayat-date">' + tgl + ' - ' + jam + (t.note !== '-' ? ' - ' + t.note : '') + '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function filterProfit() {
    var type = document.getElementById('filterProfitType').value;
    dbGetAll(STORE_PROFIT).then(function(records) {
        var filtered = type === 'all' ? records : records.filter(function(r) { return r.type === type; });
        filtered.sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });

        var list = document.getElementById('profitList');
        var count = document.getElementById('profitCount');
        if (count) count.textContent = filtered.length;

        if (filtered.length === 0) {
            list.innerHTML = '<div class="riwayat-empty"><i class="ri-inbox-line"></i><p>Tidak ada data</p></div>';
            return;
        }

        list.innerHTML = filtered.map(function(t) {
            var date = new Date(t.created_at);
            var tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            var isIn = t.type === 'pemasukan';
            var color = isIn ? 'var(--success)' : 'var(--danger)';

            return '<div class="riwayat-item">' +
                '<div class="riwayat-icon" style="background:' + color + ';"><i class="ri-arrow-up-line"></i></div>' +
                '<div class="riwayat-info">' +
                    '<div class="riwayat-user">' + t.kategori + '</div>' +
                    '<div class="riwayat-nominal" style="color:' + color + ';">' + (isIn ? '+' : '-') + ' Rp ' + (t.amount || 0).toLocaleString('id-ID') + '</div>' +
                    '<div class="riwayat-date">' + tgl + '</div>' +
                '</div>' +
            '</div>';
        }).join('');
    });
}

async function clearProfitHistory() {
    if (!confirm('Hapus semua catatan profit?')) return;
    try {
        await dbClear(STORE_PROFIT);
        showToast('Catatan dihapus');
        loadProfitList();
        loadProfitSummary();
    } catch(e) {
        showToast('Gagal menghapus', true);
    }
}

async function loadProfitSummary() {
    var records = [];
    try { records = await dbGetAll(STORE_PROFIT); } catch(e) {}

    var masuk = 0;
    var keluar = 0;
    records.forEach(function(t) {
        if (t.type === 'pemasukan') masuk += t.amount || 0;
        else keluar += t.amount || 0;
    });

    var bersih = masuk - keluar;

    var el1 = document.getElementById('profitPemasukan');
    var el2 = document.getElementById('profitPengeluaran');
    var el3 = document.getElementById('profitBersih');
    if (el1) el1.textContent = 'Rp ' + masuk.toLocaleString('id-ID');
    if (el2) el2.textContent = 'Rp ' + keluar.toLocaleString('id-ID');
    if (el3) el3.textContent = 'Rp ' + bersih.toLocaleString('id-ID');
}

/* ============================================
   DASHBOARD & RECENT
   ============================================ */
async function loadDashboard() {
    var records = [];
    try { records = await dbGetAll(STORE_TOPUP); } catch(e) {}

    var now = new Date();
    var todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

    var totalSaldo = 0;
    var todayCount = 0;
    var lastRecord = null;

    records.forEach(function(t) {
        totalSaldo += t.amount || 0;
        if (t.created_at) {
            var d = new Date(t.created_at);
            var dStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            if (dStr === todayStr) todayCount++;
        }
        if (!lastRecord || new Date(t.created_at) > new Date(lastRecord.created_at)) {
            lastRecord = t;
        }
    });

    var el1 = document.getElementById('dashTotalMasuk');
    var el2 = document.getElementById('dashTotalAdd');
    var el3 = document.getElementById('dashHariIni');
    var el4 = document.getElementById('dashTerakhir');

    if (el1) el1.textContent = 'Rp ' + totalSaldo.toLocaleString('id-ID');
    if (el2) el2.textContent = records.length + 'x';
    if (el3) el3.textContent = todayCount + 'x';
    if (el4) {
        if (lastRecord) {
            var d2 = new Date(lastRecord.created_at);
            el4.textContent = d2.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else {
            el4.textContent = '-';
        }
    }
}

async function loadRecentActivity() {
    var list = document.getElementById('recentList');
    if (!list) return;

    var records = [];
    try { records = await dbGetAll(STORE_TOPUP); } catch(e) {}

    records.sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });
    var recent = records.slice(0, 5);

    if (recent.length === 0) {
        list.innerHTML = '<div class="recent-empty"><i class="ri-inbox-line"></i><p>Belum ada aktivitas</p></div>';
        return;
    }

    list.innerHTML = recent.map(function(t) {
        var initial = (t.username || 'U').charAt(0).toUpperCase();
        var d = new Date(t.created_at);
        var tgl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        var jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        var action = t.action || 'add';
        var color = action === 'add' ? 'var(--success)' : (action === 'sub' ? 'var(--danger)' : 'var(--blue)');
        var sign = action === 'add' ? '+' : (action === 'sub' ? '-' : '=');

        return '<div class="recent-item">' +
            '<div class="recent-avatar">' + initial + '</div>' +
            '<div class="recent-info">' +
                '<div class="recent-username">@' + t.username + '</div>' +
                '<div class="recent-time">' + tgl + ' - ' + jam + '</div>' +
            '</div>' +
            '<div class="recent-amount" style="color:' + color + ';">' + sign + ' Rp ' + (t.amount || 0).toLocaleString('id-ID') + '</div>' +
        '</div>';
    }).join('');
}

/* ============================================
   TRANSAKSI
   ============================================ */
function setupTransaksi() {
    var filter = document.getElementById('filterTrxInput');
    var refresh = document.getElementById('refreshTrxBtn');

    if (filter) filter.addEventListener('input', filterTransaksi);
    if (refresh) refresh.addEventListener('click', loadAllTransaksi);
}

async function loadAllTransaksi() {
    var list = document.getElementById('transaksiList');
    if (!list) return;

    showLoading('Memuat transaksi...');

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({ action: 'get_recent_activity' })
        });
        var data = await res.json();
        hideLoading();

        if (data.success && data.data) {
            allTransaksi = data.data;
            document.getElementById('totalTransaksiAll').textContent = allTransaksi.length;
            document.getElementById('transaksiCount').textContent = allTransaksi.length;
            renderTransaksi(allTransaksi);
        } else {
            list.innerHTML = '<div class="riwayat-empty"><i class="ri-inbox-line"></i><p>Belum ada transaksi</p></div>';
        }
    } catch(e) {
        hideLoading();
        list.innerHTML = '<div class="riwayat-empty"><i class="ri-error-warning-line"></i><p>Gagal koneksi</p></div>';
    }
}

function renderTransaksi(data) {
    var list = document.getElementById('transaksiList');
    if (!list) return;

    if (data.length === 0) {
        list.innerHTML = '<div class="riwayat-empty"><i class="ri-inbox-line"></i><p>Tidak ada transaksi</p></div>';
        return;
    }

    list.innerHTML = data.slice(0, 100).map(function(t) {
        var date = new Date(t.created_at);
        var tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        var jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        var isIn = t.type === 'deposit' || t.type === 'transfer_in';
        var color = isIn ? 'var(--success)' : 'var(--danger)';
        var sign = isIn ? '+' : '-';

        return '<div class="riwayat-item">' +
            '<div class="riwayat-icon" style="background:' + color + ';"><i class="ri-exchange-line"></i></div>' +
            '<div class="riwayat-info">' +
                '<div class="riwayat-user">@' + (t.username || '-') + '</div>' +
                '<div class="riwayat-nominal" style="color:' + color + ';">' + sign + ' Rp ' + (t.amount || 0).toLocaleString('id-ID') + '</div>' +
                '<div class="riwayat-date">' + (t.product_name || t.type || 'Trx') + ' - ' + tgl + ' ' + jam + '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function filterTransaksi() {
    var q = document.getElementById('filterTrxInput').value.trim().toLowerCase();
    if (!q) {
        renderTransaksi(allTransaksi);
        document.getElementById('transaksiCount').textContent = allTransaksi.length;
        return;
    }

    var filtered = allTransaksi.filter(function(t) {
        return (t.username || '').toLowerCase().includes(q) ||
               (t.id || '').toLowerCase().includes(q) ||
               (t.product_name || '').toLowerCase().includes(q);
    });

    renderTransaksi(filtered);
    document.getElementById('transaksiCount').textContent = filtered.length;
}

/* ============================================
   STATISTIK
   ============================================ */
async function loadStats() {
    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({ action: 'get_total_users' })
        });
        var data = await res.json();

        if (data.success) {
            document.getElementById('statsTotalUser').textContent = data.total_users || 0;
        }
    } catch(e) {}

    try {
        var res2 = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({ action: 'get_all_users' })
        });
        var d2 = await res2.json();

        if (d2.success && d2.users) {
            var totalSaldo = 0;
            var totalTrx = 0;
            var banned = 0;

            d2.users.forEach(function(u) {
                totalSaldo += u.balance || 0;
                if (Array.isArray(u.trx_id)) totalTrx += u.trx_id.length;
                if (u.is_banned) banned++;
            });

            document.getElementById('statsTotalSaldo').textContent = 'Rp ' + totalSaldo.toLocaleString('id-ID');
            document.getElementById('statsTotalTrx').textContent = totalTrx;
            document.getElementById('statsTotalBanned').textContent = banned;
        }
    } catch(e) {}
}

async function loadTopSpenders() {
    var container = document.getElementById('topSpendersList');
    if (!container) return;

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({ action: 'get_top_spenders', limit: 10 })
        });
        var data = await res.json();

        if (data.success && data.data) {
            renderRankList(container, data.data, 'spent');
        } else {
            container.innerHTML = '<div class="empty-state"><i class="ri-trophy-line"></i><p>Belum ada data</p></div>';
        }
    } catch(e) {
        container.innerHTML = '<div class="empty-state"><i class="ri-error-warning-line"></i><p>Gagal memuat</p></div>';
    }
}

async function loadTopUsers() {
    var container = document.getElementById('topUsersList');
    if (!container) return;

    try {
        var res = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': Ya },
            body: JSON.stringify({ action: 'get_top_users_by_transaction' })
        });
        var data = await res.json();

        if (data.success && data.data) {
            renderRankList(container, data.data, 'trx');
        } else {
            container.innerHTML = '<div class="empty-state"><i class="ri-fire-line"></i><p>Belum ada data</p></div>';
        }
    } catch(e) {
        container.innerHTML = '<div class="empty-state"><i class="ri-error-warning-line"></i><p>Gagal memuat</p></div>';
    }
}

function renderRankList(container, users, mode) {
    container.innerHTML = users.map(function(u, i) {
        var rankClass = i === 0 ? 'gold' : (i === 1 ? 'silver' : (i === 2 ? 'bronze' : 'normal'));
        var name = u.username || 'Anonymous';
        var sub, value;

        if (mode === 'spent') {
            sub = (u.total_transactions || 0) + 'x pembelian';
            value = 'Rp ' + (u.total_spent || 0).toLocaleString('id-ID');
        } else {
            sub = (u.phone || '-');
            value = (u.total_transactions || 0) + 'x';
        }

        return '<div class="rank-item">' +
            '<div class="rank-number ' + rankClass + '">' + (i + 1) + '</div>' +
            '<div class="rank-info">' +
                '<div class="rank-name">' + name + '</div>' +
                '<div class="rank-sub">' + sub + '</div>' +
            '</div>' +
            '<div class="rank-value">' + value + '</div>' +
        '</div>';
    }).join('');
}

/* ============================================
   PENGATURAN
   ============================================ */
function setupSettings() {
    setupThemeButtons();

    var infoBackend = document.getElementById('infoBackend');
    if (infoBackend) infoBackend.textContent = 'Vercel + Supabase';

    var uptime = document.getElementById('infoUptime');
    if (uptime) {
        var start = Date.now();
        setInterval(function() {
            var diff = Math.floor((Date.now() - start) / 1000);
            var h = Math.floor(diff / 3600);
            var m = Math.floor((diff % 3600) / 60);
            var s = diff % 60;
            uptime.textContent = h + 'j ' + m + 'm ' + s + 's';
        }, 1000);
    }

    var resetBtn = document.getElementById('resetPanelBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            showConfirmModal('Reset Panel', [
                { label: 'Peringatan', value: 'Semua data lokal akan dihapus', danger: true },
                { label: 'Data yang dihapus', value: 'Riwayat top up + Profit', danger: true }
            ], async function() {
                try {
                    await dbClear(STORE_TOPUP);
                    await dbClear(STORE_PROFIT);
                    closeConfirmModal();
                    showToast('Semua data lokal dihapus');
                    loadDashboard();
                    loadRecentActivity();
                    loadProfitList();
                    loadProfitSummary();
                } catch(e) {
                    showToast('Gagal reset', true);
                }
            });
        });
    }
}

/* ============================================
   MODAL HELPER
   ============================================ */
function setupModals() {
    document.getElementById('cancelConfirm').addEventListener('click', closeConfirmModal);
    document.getElementById('okConfirm').addEventListener('click', function() {
        if (confirmCallback) confirmCallback();
    });

    var cm = document.getElementById('confirmModal');
    if (cm) {
        cm.addEventListener('click', function(e) {
            if (e.target === cm) closeConfirmModal();
        });
    }

    document.getElementById('cancelFormBtn').addEventListener('click', closeFormModal);
    document.getElementById('saveFormBtn').addEventListener('click', function() {
        if (formCallback) {
            var values = {};
            document.querySelectorAll('#formModalBody input').forEach(function(inp) {
                values[inp.id] = inp.value;
            });
            formCallback(values);
        }
    });

    var fm = document.getElementById('formModal');
    if (fm) {
        fm.addEventListener('click', function(e) {
            if (e.target === fm) closeFormModal();
        });
    }

    document.getElementById('closeSuccess').addEventListener('click', function() {
        document.getElementById('successModal').classList.remove('active');
    });

    document.getElementById('copyReceiptBtn').addEventListener('click', copyReceipt);
    document.getElementById('sendWaBtn').addEventListener('click', sendReceiptToWA);
}

function showConfirmModal(title, rows, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmDetail').innerHTML = rows.map(function(r) {
        var cls = r.danger ? 'value danger' : (r.amount ? 'value amount' : 'value');
        return '<div class="confirm-row">' +
            '<span class="label">' + r.label + '</span>' +
            '<span class="' + cls + '">' + r.value + '</span>' +
        '</div>';
    }).join('');

    confirmCallback = callback;
    document.getElementById('confirmModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    confirmCallback = null;
}

function showFormModal(title, fields, callback) {
    document.getElementById('formModalTitle').textContent = title;

    document.getElementById('formModalBody').innerHTML = fields.map(function(f) {
        return '<div class="input-group">' +
            '<label><i class="' + (f.icon || 'ri-edit-line') + '"></i> ' + f.label + '</label>' +
            '<div class="input-wrapper">' +
                '<input type="' + (f.type || 'text') + '" id="' + f.id + '" value="' + (f.value || '') + '" placeholder="' + (f.placeholder || '') + '">' +
            '</div>' +
        '</div>';
    }).join('');

    formCallback = callback;
    document.getElementById('formModal').classList.add('active');
}

function closeFormModal() {
    document.getElementById('formModal').classList.remove('active');
    formCallback = null;
}

/* ============================================
   LOADING & TOAST
   ============================================ */
function showLoading(text) {
    var el = document.getElementById('loadingText');
    if (el) el.textContent = text || 'Memproses...';
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showToast(message, isError) {
    var toast = document.createElement('div');
    var bg = isError ? '#ec4899' : '#10b981';
    toast.style.cssText = 'position:fixed;bottom:120px;left:50%;transform:translateX(-50%);background:' + bg + ';color:#fff;padding:10px 18px;border:2px solid #1e1b4b;box-shadow:3px 3px 0px #1e1b4b;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;z-index:99999;max-width:90%;text-align:center;border-radius:10px;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.transition = 'all 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(function() { toast.remove(); }, 300);
    }, 2200);
}












/* ============================================
   PWA INSTALL
   ============================================ */
let deferredPrompt = null;

function setupInstallButton() {
    var installBtn = document.getElementById('installBtn');
    var settingsInstallBtn = document.getElementById('settingsInstallBtn');

    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBtn();
    });

    if (installBtn) {
        installBtn.addEventListener('click', doInstall);
    }

    if (settingsInstallBtn) {
        settingsInstallBtn.addEventListener('click', doInstall);
    }

    window.addEventListener('appinstalled', function() {
        hideInstallBtn();
        deferredPrompt = null;
        showToast('Aplikasi berhasil di-install');
    });

    setTimeout(function() {
        if (deferredPrompt && !isStandalone()) showInstallBtn();
    }, 2000);
}

async function doInstall() {
    if (!deferredPrompt) {
        showToast('Buka menu browser, pilih "Install App" atau "Tambahkan ke Layar Utama"', true);
        return;
    }
    deferredPrompt.prompt();
    var choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
        showToast('Aplikasi sedang di-install');
    } else {
        showToast('Install dibatalkan', true);
    }
    deferredPrompt = null;
    hideInstallBtn();
}

function showInstallBtn() {
    var btn = document.getElementById('installBtn');
    if (!btn) return;
    if (isStandalone()) return;
    btn.style.display = 'flex';
}

function hideInstallBtn() {
    var btn = document.getElementById('installBtn');
    if (!btn) return;
    btn.style.display = 'none';
}

function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
}