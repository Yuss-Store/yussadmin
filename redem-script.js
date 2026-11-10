(function() {
    
    
    
    'use strict';
     
    if (!document.getElementById('redeemClaimsCSSInject')) {
    var s = document.createElement('style');
    s.id = 'redeemClaimsCSSInject';
    s.textContent = '@keyframes rcFadeIn{from{opacity:0}to{opacity:1}}'
        + '@keyframes rcFadeOut{from{opacity:1}to{opacity:0}}'
        + '@keyframes rcPopIn{0%{opacity:0;transform:scale(0.85)}60%{opacity:1;transform:scale(1.02)}100%{opacity:1;transform:scale(1)}}'
        + '@keyframes rcPopOut{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.9)}}'
        + '@keyframes rcCardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}'
        + '.redeem-claims-overlay{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;background:rgba(0,0,0,0.75)!important;z-index:99999!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:20px!important;animation:rcFadeIn 0.25s ease!important;}'
        + '.redeem-claims-overlay.closing{animation:rcFadeOut 0.22s ease forwards!important;}'
        + '.redeem-claims-sheet{width:100%!important;max-width:420px!important;max-height:85vh!important;background:#fff!important;border-radius:20px!important;border:2px solid #1e1b4b!important;display:flex!important;flex-direction:column!important;box-shadow:0 10px 40px rgba(0,0,0,0.3)!important;overflow:hidden!important;margin:0!important;animation:rcPopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards!important;}'
        + '.redeem-claims-overlay.closing .redeem-claims-sheet{animation:rcPopOut 0.22s ease forwards!important;}'
        + 'body.theme-dark .redeem-claims-sheet{background:#1a1a2e!important;border-color:#fff!important;}'
        + '.redeem-claims-handle{display:none!important;}'
        + '.redeem-claims-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:14px 18px!important;border-bottom:2px solid #1e1b4b!important;background:#fff!important;}'
        + 'body.theme-dark .redeem-claims-head{background:#1a1a2e!important;border-color:#fff!important;}'
        + '.redeem-claims-head-left{display:flex!important;align-items:center!important;gap:10px!important;min-width:0!important;flex:1!important;}'
        + '.redeem-claims-head-icon{width:36px!important;height:36px!important;border-radius:10px!important;background:#8b5cf6!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;border:2px solid #1e1b4b!important;}'
        + '.redeem-claims-head-icon i{font-size:17px!important;}'
        + '.redeem-claims-head-text{display:flex!important;flex-direction:column!important;gap:1px!important;min-width:0!important;}'
        + '.redeem-claims-head-title{font-size:13px!important;font-weight:900!important;color:#1e1b4b!important;text-transform:uppercase!important;line-height:1.2!important;margin:0!important;}'
        + 'body.theme-dark .redeem-claims-head-title{color:#fff!important;}'
        + '.redeem-claims-head-kode{font-size:11px!important;font-weight:700!important;color:#8b5cf6!important;font-family:monospace!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}'
        + '.redeem-claims-close-btn{width:32px!important;height:32px!important;background:#ec4899!important;border:2px solid #1e1b4b!important;border-radius:9px!important;color:#fff!important;font-size:16px!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;transition:transform 0.12s ease!important;}'
        + '.redeem-claims-close-btn:active{transform:scale(0.9)!important;}'
        + '.redeem-claims-summary{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;padding:10px 16px!important;background:#f5f3ff!important;border-bottom:2px solid #1e1b4b!important;}'
        + 'body.theme-dark .redeem-claims-summary{background:#252540!important;border-color:#fff!important;}'
        + '.redeem-claims-summary-item{display:flex!important;align-items:center!important;gap:8px!important;padding:8px 10px!important;background:#fff!important;border:2px solid #1e1b4b!important;border-radius:9px!important;animation:rcCardIn 0.35s ease both!important;}'
        + '.redeem-claims-summary-item:nth-child(1){animation-delay:0.08s!important;}'
        + '.redeem-claims-summary-item:nth-child(2){animation-delay:0.14s!important;}'
        + 'body.theme-dark .redeem-claims-summary-item{background:#1a1a2e!important;border-color:#fff!important;}'
        + '.redeem-claims-summary-icon{width:26px!important;height:26px!important;border-radius:7px!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;font-size:12px!important;}'
        + '.redeem-claims-summary-icon.total{background:#3b82f6!important;color:#fff!important;}'
        + '.redeem-claims-summary-icon.sisa{background:#fbbf24!important;color:#000!important;}'
        + '.redeem-claims-summary-info{display:flex!important;flex-direction:column!important;gap:1px!important;min-width:0!important;}'
        + '.redeem-claims-summary-value{font-size:13px!important;font-weight:900!important;color:#1e1b4b!important;line-height:1.1!important;}'
        + 'body.theme-dark .redeem-claims-summary-value{color:#fff!important;}'
        + '.redeem-claims-summary-label{font-size:8px!important;font-weight:900!important;color:#6b7280!important;text-transform:uppercase!important;}'
        + '.redeem-claims-list{flex:1!important;overflow-y:auto!important;padding:12px 14px!important;min-height:0!important;}'
        + '.redeem-claim-user-card{display:flex!important;align-items:flex-start!important;gap:11px!important;padding:11px 13px!important;background:#f5f3ff!important;border:2px solid #1e1b4b!important;border-radius:11px!important;margin-bottom:9px!important;position:relative!important;overflow:hidden!important;animation:rcCardIn 0.35s ease both!important;}'
        + '.redeem-claim-user-card:nth-child(1){animation-delay:0.16s!important;}'
        + '.redeem-claim-user-card:nth-child(2){animation-delay:0.20s!important;}'
        + '.redeem-claim-user-card:nth-child(3){animation-delay:0.24s!important;}'
        + '.redeem-claim-user-card:nth-child(4){animation-delay:0.28s!important;}'
        + '.redeem-claim-user-card:nth-child(5){animation-delay:0.32s!important;}'
        + '.redeem-claim-user-card:nth-child(6){animation-delay:0.36s!important;}'
        + '.redeem-claim-user-card:nth-child(7){animation-delay:0.40s!important;}'
        + '.redeem-claim-user-card:nth-child(8){animation-delay:0.44s!important;}'
        + '.redeem-claim-user-card:nth-child(9){animation-delay:0.48s!important;}'
        + '.redeem-claim-user-card:nth-child(10){animation-delay:0.52s!important;}'
        + 'body.theme-dark .redeem-claim-user-card{background:#252540!important;border-color:#fff!important;}'
        + '.redeem-claim-user-card::before{content:""!important;position:absolute!important;top:0!important;left:0!important;bottom:0!important;width:3px!important;background:#10b981!important;}'
        + '.redeem-claim-user-avatar{width:34px!important;height:34px!important;border-radius:50%!important;background:#1e1b4b!important;color:#fbbf24!important;font-size:13px!important;font-weight:900!important;display:flex!important;align-items:center!important;justify-content:center!important;flex-shrink:0!important;border:2px solid #1e1b4b!important;text-transform:uppercase!important;}'
        + '.redeem-claim-user-body{flex:1!important;min-width:0!important;display:flex!important;flex-direction:column!important;gap:5px!important;}'
        + '.redeem-claim-user-name{font-size:12px!important;font-weight:900!important;color:#1e1b4b!important;text-transform:uppercase!important;word-break:break-all!important;line-height:1.2!important;}'
        + 'body.theme-dark .redeem-claim-user-name{color:#fff!important;}'
        + '.redeem-claim-user-hadiah{display:inline-flex!important;align-items:center!important;gap:5px!important;padding:3px 9px!important;border-radius:6px!important;font-size:9.5px!important;font-weight:900!important;text-transform:uppercase!important;width:fit-content!important;max-width:100%!important;}'
        + '.redeem-claim-user-hadiah.saldo{background:rgba(16,185,129,0.15)!important;color:#10b981!important;border:1px solid rgba(16,185,129,0.3)!important;}'
        + '.redeem-claim-user-hadiah.produk{background:rgba(59,130,246,0.15)!important;color:#3b82f6!important;border:1px solid rgba(59,130,246,0.3)!important;}'
        + '.redeem-claim-user-hadiah.voucher{background:rgba(251,191,36,0.15)!important;color:#fbbf24!important;border:1px solid rgba(251,191,36,0.3)!important;}'
        + '.redeem-claim-user-time{display:flex!important;align-items:center!important;gap:4px!important;font-size:9.5px!important;font-weight:700!important;color:#6b7280!important;font-family:monospace!important;}'
        + '.redeem-claims-empty-state{text-align:center!important;padding:55px 20px!important;}'
        + '.redeem-claims-empty-state i{font-size:56px!important;opacity:0.3!important;margin-bottom:16px!important;display:block!important;}'
        + '.redeem-claims-empty-state p{font-size:13px!important;font-weight:900!important;text-transform:uppercase!important;margin-bottom:6px!important;color:#1e1b4b!important;}'
        + 'body.theme-dark .redeem-claims-empty-state p{color:#fff!important;}'
        + '.redeem-claims-empty-state span{font-size:11px!important;font-weight:700!important;color:#6b7280!important;}'
        + '.redeem-claims-bottom{padding:12px 16px!important;border-top:2px solid #1e1b4b!important;background:#f5f3ff!important;}'
        + 'body.theme-dark .redeem-claims-bottom{background:#252540!important;border-color:#fff!important;}'
        + '.redeem-claims-bottom-btn{width:100%!important;padding:11px!important;background:#1e1b4b!important;border:2px solid #1e1b4b!important;border-radius:10px!important;color:#fbbf24!important;font-weight:900!important;font-size:11.5px!important;text-transform:uppercase!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;font-family:inherit!important;transition:transform 0.12s ease!important;}'
        + '.redeem-claims-bottom-btn:active{transform:scale(0.97)!important;}'
        + 'body.theme-dark .redeem-claims-bottom-btn{background:#a78bfa!important;color:#000!important;}';
    document.head.appendChild(s);
}
    
    

    const SUPA_URL = 'https://jpzeirjjuewlvbqjlkty.supabase.co';
    const SUPA_KEY = 'sb_publishable_jPYXfcEodW3wLV2Gp8-9bA_-v9kzf1V';

    let allRedeemCodes = [];
    let redeemCurrentStatus = true;
    let redeemEditingId = null;

    function redeemFetch(path, opts) {
        opts = opts || {};
        return fetch(SUPA_URL + '/rest/v1/' + path, {
            method: opts.method || 'GET',
            headers: {
                'apikey': SUPA_KEY,
                'Authorization': 'Bearer ' + SUPA_KEY,
                'Content-Type': 'application/json',
                'Prefer': opts.prefer || ''
            },
            body: opts.body
        }).then(function(r) {
            if (!r.ok) return r.text().then(function(t) { throw new Error('HTTP ' + r.status + ': ' + t); });
            return r.text().then(function(t) { return t ? JSON.parse(t) : null; });
        });
    }

    function generateRandomRedeemCode() {
        var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        var segments = 3;
        var segLen = 4;
        var parts = [];
        for (var s = 0; s < segments; s++) {
            var part = '';
            for (var i = 0; i < segLen; i++) {
                part += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            parts.push(part);
        }
        return 'YSX-' + parts.join('-');
    }

    function addRedeemHadiahImpl(data) {
        data = data || {};
        var container = document.getElementById('redeemHadiahList');
        if (!container) {
            console.warn('[Redeem] Container #redeemHadiahList tidak ditemukan');
            return;
        }

        var idx = container.children.length;
        var div = document.createElement('div');
        div.className = 'redeem-hadiah-item';
        div.innerHTML =
            '<div class="redeem-hadiah-header">' +
                '<span>Hadiah #' + (idx + 1) + '</span>' +
                '<button type="button" class="redeem-hadiah-remove" onclick="this.closest(\'.redeem-hadiah-item\').remove()">' +
                    '<i class="ri-close-line"></i>' +
                '</button>' +
            '</div>' +
            '<div class="redeem-hadiah-row">' +
                '<select class="redeem-hadiah-select redeem-hadiah-type">' +
                    '<option value="saldo"' + (data.type === 'saldo' ? ' selected' : '') + '>Saldo</option>' +
                    '<option value="produk"' + (data.type === 'produk' ? ' selected' : '') + '>Produk</option>' +
                    '<option value="voucher"' + (data.type === 'voucher' ? ' selected' : '') + '>Voucher</option>' +
                '</select>' +
                '<input type="text" class="redeem-hadiah-input redeem-hadiah-value" placeholder="Saldo: 5000 / Produk: nama / Voucher: kode" value="' + (data.value || '') + '">' +
            '</div>' +
            '<div class="redeem-hadiah-row" style="grid-template-columns:1fr 1fr;">' +
                '<input type="text" class="redeem-hadiah-input redeem-hadiah-label" placeholder="Label tampilan" value="' + (data.label || '') + '">' +
                '<input type="text" class="redeem-hadiah-input redeem-hadiah-extra" placeholder="Info tambahan" value="' + (data.extra || '') + '">' +
            '</div>';
        container.appendChild(div);
    }

    function collectRedeemHadiah() {
        var container = document.getElementById('redeemHadiahList');
        if (!container) return [];
        var items = [];
        container.querySelectorAll('.redeem-hadiah-item').forEach(function(el) {
            var type = el.querySelector('.redeem-hadiah-type').value;
            var value = el.querySelector('.redeem-hadiah-value').value.trim();
            var label = el.querySelector('.redeem-hadiah-label').value.trim();
            var extra = el.querySelector('.redeem-hadiah-extra').value.trim();
            if (!value) return;
            items.push({
                type: type,
                value: value,
                label: label || (type === 'saldo' ? 'Saldo Rp ' + (parseInt(value) || 0).toLocaleString('id-ID') : value),
                extra: extra
            });
        });
        return items;
    }

    function getRedeemStatus(c) {
        if (!c.is_active) return { label: 'Nonaktif', cls: 'inactive' };
        var now = new Date();
        if (c.expired_at && new Date(c.expired_at) < now) return { label: 'Expired', cls: 'expired' };
        if (c.total_klaim >= c.max_klaim) return { label: 'Habis', cls: 'full' };
        return { label: 'Aktif', cls: 'active' };
    }

    function formatRedeemHadiah(h) {
        if (!h) return '-';
        if (h.type === 'saldo') return 'Saldo Rp ' + (parseInt(h.value) || 0).toLocaleString('id-ID');
        if (h.type === 'produk') return 'Produk: ' + (h.label || h.value || '-');
        if (h.type === 'voucher') return 'Voucher: ' + (h.label || h.value || '-');
        return h.label || h.value || '-';
    }

    function renderRedeemList() {
        var list = document.getElementById('redeemList');
        var count = document.getElementById('redeemCount');
        if (!list) return;

        var filterEl = document.getElementById('redeemFilterStatus');
        var filter = filterEl ? filterEl.value : 'all';

        var filtered = allRedeemCodes.filter(function(c) {
            var st = getRedeemStatus(c).cls;
            if (filter === 'all') return true;
            return st === filter;
        });

        if (count) count.textContent = filtered.length;

        if (filtered.length === 0) {
            list.innerHTML = '<div class="riwayat-empty"><i class="ri-gift-line"></i><p>Belum ada kode redeem</p></div>';
            return;
        }

        list.innerHTML = filtered.map(function(c) {
            var st = getRedeemStatus(c);
            var hadiahList = (c.hadiah_list || []).map(function(h) {
                return '<div class="redeem-item-hadiah-row"><i class="ri-gift-line"></i> ' + formatRedeemHadiah(h) + '</div>';
            }).join('');

            var expStr = c.expired_at ? new Date(c.expired_at).toLocaleString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : '∞ Tidak ada';

            var progress = c.max_klaim > 0 ? Math.min(100, (c.total_klaim / c.max_klaim) * 100) : 0;

            return '<div class="redeem-item">' +
                '<div class="redeem-item-header">' +
                    '<span class="redeem-item-kode">' + c.kode + '</span>' +
                    '<span class="redeem-badge ' + st.cls + '">' + st.label + '</span>' +
                '</div>' +
                '<div class="redeem-item-hadiah-list">' +
                    (hadiahList || '<div class="redeem-item-hadiah-row" style="opacity:0.5;"><i class="ri-error-warning-line"></i> Tidak ada hadiah</div>') +
                '</div>' +
                '<div class="redeem-item-meta">' +
                    '<span><i class="ri-group-line"></i> ' + c.total_klaim + ' / ' + c.max_klaim + ' klaim</span>' +
                    '<span><i class="ri-time-line"></i> Expired: ' + expStr + '</span>' +
                '</div>' +
                '<div class="redeem-progress"><div class="redeem-progress-fill" style="width:' + progress + '%"></div></div>' +
                '<div class="redeem-item-actions">' +
                    '<button class="redeem-action-btn claims" onclick="viewRedeemClaims(' + c.id + ')"><i class="ri-eye-line"></i> Klaim</button>' +
                    '<button class="redeem-action-btn edit" onclick="editRedeemCode(' + c.id + ')"><i class="ri-edit-line"></i> Edit</button>' +
                    '<button class="redeem-action-btn delete" onclick="deleteRedeemCode(' + c.id + ')"><i class="ri-delete-bin-line"></i> Hapus</button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    function loadRedeemCodesImpl() {
        var list = document.getElementById('redeemList');
        if (!list) return;
        list.innerHTML = '<div class="riwayat-empty"><i class="ri-loader-4-line spin"></i><p>Memuat...</p></div>';

        redeemFetch('redeem_codes?select=*&order=created_at.desc').then(function(rows) {
            allRedeemCodes = rows || [];
            renderRedeemList();
        }).catch(function(e) {
            list.innerHTML = '<div class="riwayat-empty"><i class="ri-error-warning-line"></i><p>Gagal memuat: ' + e.message + '</p></div>';
        });
    }

    function saveRedeemCode() {
        var kode = document.getElementById('redeemKode').value.trim().toUpperCase();
        var maxKlaim = parseInt(document.getElementById('redeemMaxKlaim').value) || 1;
        var expiredInput = document.getElementById('redeemExpired').value;
        var expiredAt = expiredInput ? new Date(expiredInput).toISOString() : null;
        var hadiah = collectRedeemHadiah();

        if (!kode) { showToast('Kode wajib diisi', true); return; }
        if (hadiah.length === 0) { showToast('Minimal 1 hadiah', true); return; }
        if (maxKlaim < 1) { showToast('Maks klaim minimal 1', true); return; }

        var payload = {
            kode: kode,
            hadiah_list: hadiah,
            max_klaim: maxKlaim,
            expired_at: expiredAt,
            is_active: redeemCurrentStatus,
            updated_at: new Date().toISOString()
        };

        showLoading('Menyimpan kode...');

        var req = redeemEditingId
            ? redeemFetch('redeem_codes?id=eq.' + redeemEditingId, { method: 'PATCH', body: JSON.stringify(payload) })
            : redeemFetch('redeem_codes', { method: 'POST', body: JSON.stringify(payload) });

        req.then(function() {
            hideLoading();
            showToast(redeemEditingId ? 'Kode diupdate' : 'Kode dibuat');
            resetRedeemForm();
            loadRedeemCodesImpl();
        }).catch(function(e) {
            hideLoading();
            showToast('Gagal simpan: ' + e.message, true);
        });
    }

    function resetRedeemForm() {
        redeemEditingId = null;
        redeemCurrentStatus = true;
        document.getElementById('redeemEditId').value = '';
        document.getElementById('redeemKode').value = '';
        document.getElementById('redeemMaxKlaim').value = 10;
        document.getElementById('redeemExpired').value = '';
        document.getElementById('redeemHadiahList').innerHTML = '';
        document.getElementById('redeemFormTitle').textContent = 'Buat Kode Redeem';
        document.getElementById('redeemSubmitText').textContent = 'Simpan Kode';
        document.getElementById('redeemCancelEditBtn').style.display = 'none';
        document.querySelectorAll('[data-redeem-status]').forEach(function(b) {
            b.classList.remove('active');
            if (b.dataset.redeemStatus === 'true') b.classList.add('active');
        });
        addRedeemHadiahImpl();
    }

    function editRedeemCodeImpl(id) {
        var c = allRedeemCodes.find(function(x) { return x.id === id; });
        if (!c) return;

        redeemEditingId = id;
        document.getElementById('redeemEditId').value = id;
        document.getElementById('redeemKode').value = c.kode;
        document.getElementById('redeemMaxKlaim').value = c.max_klaim;
        document.getElementById('redeemExpired').value = c.expired_at
            ? new Date(c.expired_at).toISOString().slice(0, 16) : '';
        document.getElementById('redeemFormTitle').textContent = 'Edit Kode Redeem';
        document.getElementById('redeemSubmitText').textContent = 'Update Kode';
        document.getElementById('redeemCancelEditBtn').style.display = 'flex';

        redeemCurrentStatus = c.is_active;
        document.querySelectorAll('[data-redeem-status]').forEach(function(b) {
            b.classList.toggle('active', (b.dataset.redeemStatus === 'true') === c.is_active);
        });

        document.getElementById('redeemHadiahList').innerHTML = '';
        (c.hadiah_list || []).forEach(function(h) { addRedeemHadiahImpl(h); });
        if ((c.hadiah_list || []).length === 0) addRedeemHadiahImpl();

        var redeemNavBtn = document.querySelector('.bottom-nav [data-tab="redeem"]');
        if (redeemNavBtn) redeemNavBtn.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteRedeemCodeImpl(id) {
        if (!confirm('Yakin hapus kode ini? Klaim user juga akan hilang.')) return;

        showLoading('Menghapus...');
        redeemFetch('redeem_codes?id=eq.' + id, { method: 'DELETE' }).then(function() {
            hideLoading();
            showToast('Kode dihapus');
            loadRedeemCodesImpl();
        }).catch(function(e) {
            hideLoading();
            showToast('Gagal hapus: ' + e.message, true);
        });
    }

    function viewRedeemClaimsImpl(id) {
    showLoading('Memuat klaim...');

    redeemFetch('redeem_claims?redeem_id=eq.' + id + '&order=claimed_at.desc').then(function(rows) {
        hideLoading();

        var kodeInfo = '';
        var maxKlaim = 0;
        var kodeObj = allRedeemCodes.find(function(c) { return c.id === id; });
        if (kodeObj) {
            kodeInfo = kodeObj.kode;
            maxKlaim = kodeObj.max_klaim;
        }

        var totalKlaim = rows ? rows.length : 0;
        var sisaKuota = Math.max(0, maxKlaim - totalKlaim);

        var existing = document.getElementById('redeemClaimsOverlay');
        if (existing) existing.remove();

        var overlay = document.createElement('div');
        overlay.id = 'redeemClaimsOverlay';
        overlay.className = 'redeem-claims-overlay';

        var listHtml = '';

        if (!rows || rows.length === 0) {
            listHtml = '<div class="redeem-claims-empty-state">' +
                '<i class="ri-user-search-line"></i>' +
                '<p>Belum Ada Klaim</p>' +
                '<span>Belum ada user yang klaim kode ini</span>' +
            '</div>';
        } else {
            listHtml = rows.map(function(r) {
                var h = r.hadiah_value || {};
                var type = h.type || 'saldo';
                var label = h.label || h.value || '-';
                var hadiahText = '';
                var hadiahClass = type;
                var icon = 'ri-gift-line';

                if (type === 'saldo') {
                    hadiahText = 'Saldo Rp ' + (parseInt(h.value) || 0).toLocaleString('id-ID');
                    icon = 'ri-wallet-3-line';
                } else if (type === 'produk') {
                    hadiahText = 'Produk: ' + label;
                    icon = 'ri-apps-2-line';
                } else if (type === 'voucher') {
                    hadiahText = 'Voucher: ' + label;
                    icon = 'ri-coupon-3-line';
                } else {
                    hadiahText = label;
                }

                var initial = (r.username || 'U').charAt(0).toUpperCase();
                var timeStr = new Date(r.claimed_at).toLocaleString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                return '<div class="redeem-claim-user-card">' +
                    '<div class="redeem-claim-user-avatar">' + initial + '</div>' +
                    '<div class="redeem-claim-user-body">' +
                        '<div class="redeem-claim-user-name">' + r.username + '</div>' +
                        '<div class="redeem-claim-user-hadiah ' + hadiahClass + '">' +
                            '<i class="' + icon + '"></i>' +
                            '<span>' + hadiahText + '</span>' +
                        '</div>' +
                        '<div class="redeem-claim-user-time">' +
                            '<i class="ri-time-line"></i>' +
                            timeTextSafe(timeStr) +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        overlay.innerHTML =
            '<div class="redeem-claims-sheet">' +
                '<div class="redeem-claims-handle"></div>' +
                '<div class="redeem-claims-head">' +
                    '<div class="redeem-claims-head-left">' +
                        '<div class="redeem-claims-head-icon">' +
                            '<i class="ri-user-follow-line"></i>' +
                        '</div>' +
                        '<div class="redeem-claims-head-text">' +
                            '<div class="redeem-claims-head-title">Daftar Klaim</div>' +
                            '<div class="redeem-claims-head-kode">' + kodeInfo + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<button class="redeem-claims-close-btn" id="redeemClaimsCloseBtn">' +
                        '<i class="ri-close-line"></i>' +
                    '</button>' +
                '</div>' +
                '<div class="redeem-claims-summary">' +
                    '<div class="redeem-claims-summary-item">' +
                        '<div class="redeem-claims-summary-icon total"><i class="ri-user-line"></i></div>' +
                        '<div class="redeem-claims-summary-info">' +
                            '<div class="redeem-claims-summary-value">' + totalKlaim + '</div>' +
                            '<div class="redeem-claims-summary-label">Total Klaim</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="redeem-claims-summary-item">' +
                        '<div class="redeem-claims-summary-icon sisa"><i class="ri-group-line"></i></div>' +
                        '<div class="redeem-claims-summary-info">' +
                            '<div class="redeem-claims-summary-value">' + sisaKuota + '</div>' +
                            '<div class="redeem-claims-summary-label">Sisa Kuota</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="redeem-claims-list">' + listHtml + '</div>' +
                '<div class="redeem-claims-bottom">' +
                    '<button class="redeem-claims-bottom-btn" id="redeemClaimsBottomClose">' +
                        '<i class="ri-check-line"></i> Tutup' +
                    '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(overlay);

        function closeClaimsModal() {
    overlay.style.animation = 'rcFadeOut 0.2s ease forwards';
    setTimeout(function() { overlay.remove(); }, 200);
}

        document.getElementById('redeemClaimsCloseBtn').addEventListener('click', closeClaimsModal);
        document.getElementById('redeemClaimsBottomClose').addEventListener('click', closeClaimsModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeClaimsModal();
        });

    }).catch(function(e) {
        hideLoading();
        showToast('Gagal: ' + e.message, true);
    });
}

function timeTextSafe(t) {
    return String(t).replace(/[<>&]/g, function(c) {
        if (c === '<') return '&lt;';
        if (c === '>') return '&gt;';
        if (c === '&') return '&amp;';
        return c;
    });
}

    function initRedeemAdminImpl() {
        var submitBtn = document.getElementById('redeemSubmitBtn');
        if (submitBtn && !submitBtn.dataset._bound) {
            submitBtn.dataset._bound = '1';
            submitBtn.addEventListener('click', saveRedeemCode);
        }

        var cancelEdit = document.getElementById('redeemCancelEditBtn');
        if (cancelEdit && !cancelEdit.dataset._bound) {
            cancelEdit.dataset._bound = '1';
            cancelEdit.addEventListener('click', resetRedeemForm);
        }

        var refresh = document.getElementById('redeemRefreshBtn');
        if (refresh && !refresh.dataset._bound) {
            refresh.dataset._bound = '1';
            refresh.addEventListener('click', loadRedeemCodesImpl);
        }

        var filter = document.getElementById('redeemFilterStatus');
        if (filter && !filter.dataset._bound) {
            filter.dataset._bound = '1';
            filter.addEventListener('change', renderRedeemList);
        }

        var generateBtn = document.getElementById('redeemGenerateBtn');
        if (generateBtn && !generateBtn.dataset._bound) {
            generateBtn.dataset._bound = '1';
            generateBtn.addEventListener('click', function() {
                var input = document.getElementById('redeemKode');
                if (!input) return;
                input.value = generateRandomRedeemCode();
                input.dispatchEvent(new Event('input'));
                showToast('Kode berhasil diacak');
            });
        }

        var addHadiahBtn = document.getElementById('redeemAddHadiahBtn');
        if (addHadiahBtn && !addHadiahBtn.dataset._bound) {
            addHadiahBtn.dataset._bound = '1';
            addHadiahBtn.addEventListener('click', function() {
                addRedeemHadiahImpl();
            });
        }

        document.querySelectorAll('[data-redeem-status]').forEach(function(btn) {
            if (btn.dataset._bound) return;
            btn.dataset._bound = '1';
            btn.addEventListener('click', function() {
                document.querySelectorAll('[data-redeem-status]').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                redeemCurrentStatus = this.dataset.redeemStatus === 'true';
            });
        });

        var hadiahContainer = document.getElementById('redeemHadiahList');
        if (hadiahContainer && hadiahContainer.children.length === 0) {
            addRedeemHadiahImpl();
        }

        loadRedeemCodesImpl();
    }

    window.addRedeemHadiah = addRedeemHadiahImpl;
    window.loadRedeemCodes = loadRedeemCodesImpl;
    window.editRedeemCode = editRedeemCodeImpl;
    window.deleteRedeemCode = deleteRedeemCodeImpl;
    window.viewRedeemClaims = viewRedeemClaimsImpl;
    window.initRedeemAdmin = initRedeemAdminImpl;

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            if (document.getElementById('tab-redeem')) {
                initRedeemAdminImpl();
            }
        }, 500);
    });
})();






