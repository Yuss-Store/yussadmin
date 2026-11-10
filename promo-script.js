const PROMO_SUPA_URL = 'https://jpzeirjjuewlvbqjlkty.supabase.co';
const PROMO_SUPA_KEY = 'sb_publishable_jPYXfcEodW3wLV2Gp8-9bA_-v9kzf1V';
const PROMO_TABLE = 'promo_diskon';
const PROMO_CLAIM_TABLE = 'promo_klaim';
const PROMO_BUCKET = 'promo-images';
const PROMO_ENC_SALT = 'YussXyPromo2025!SecureSalt';

const SUNTIK_SUPA_URL = 'https://ozgheebarlnrkoljwrel.supabase.co';
const SUNTIK_SUPA_KEY = 'sb_publishable_L4nBdPRNrgPWZ4SUgHTSWA_2qBvUor8';
const SUNTIK_TABLE = 'layanan_suntik';

const PRODUCT_LIST = [
    { id: 20, name: 'Aplikasi Premium', type: 'premium_app' },
    { id: 27, name: 'Suntik Sosmed Otomatis', type: 'suntik' },
    { id: 277, name: 'Paket Suntik Sosmed', type: 'suntik_paket' },
    { id: 9, name: 'Apk Bug WhatsApp', type: 'apk' },
    { id: 14, name: 'Nokos', type: 'nokos' },
    { id: 7, name: 'Panel Pterodactly', type: 'panel' },
    { id: 33, name: 'Topup DM - Free Fire', type: 'topup_ff' },
    { id: 1, name: 'Transfer ke DANA', type: 'generic' },
    { id: 311, name: 'Bot WA 500+ Fitur', type: 'generic' },
    { id: 312, name: '3 Apk Fake Notif', type: 'generic' },
    { id: 31, name: 'Reaction Saluran WA', type: 'generic' },
    { id: 35, name: 'Spam OTP Wa', type: 'generic' },
    { id: 34, name: 'Aplikasi Reaction WhatsApp', type: 'generic' },
    { id: 15, name: 'Jasa Bug', type: 'generic' },
    { id: 18, name: 'Jasa Joki Game', type: 'generic' },
    { id: 17, name: 'Apk Pembuat Logo JB', type: 'generic' },
    { id: 30, name: 'Apk Auto Sv Kontak', type: 'generic' },
    { id: 32, name: 'Apk Nonton Bioskop', type: 'generic' },
    { id: 24, name: 'Mentahan Design', type: 'generic' },
    { id: 29, name: 'Website Store', type: 'generic' },
    { id: 19, name: 'Reaction 90+ emoji', type: 'generic' },
    { id: 26, name: 'Paket Hemat Reaction Wa', type: 'generic' },
    { id: 25, name: 'Jasa Rekber', type: 'generic' },
    { id: 2, name: 'Reseler Panel Permanen', type: 'generic' },
    { id: 3, name: 'Source Kode Downloader', type: 'generic' }
];


const PREMIUM_APPS_SERVICES = [
    { id: '116', name: 'Alight Motion (Mei 2027)' },
    { id: '125', name: 'Canva Pro' },
    { id: '8', name: 'Viu Premium' }
];







const PAKET_SOSMED_SERVICES = [
    { id: 'tiktok_a', name: 'Paket TikTok A — Rp 7.000' },
    { id: 'tiktok_b', name: 'Paket TikTok B — Rp 35.000' },
    { id: 'tiktok_c', name: 'Paket TikTok C — Rp 70.000' },
    { id: 'instagram_a', name: 'Paket Instagram A — Rp 15.000' },
    { id: 'instagram_b', name: 'Paket Instagram B — Rp 35.000' },
    { id: 'instagram_c', name: 'Paket Instagram C — Rp 70.000' }
];

const NOKOS_SERVICES = [
    { id: 'wa_id', name: 'WhatsApp — Indonesia' },
    { id: 'wa_ph', name: 'WhatsApp — Filipina' },
    { id: 'wa_my', name: 'WhatsApp — Malaysia' },
    { id: 'wa_th', name: 'WhatsApp — Thailand' },
    { id: 'wa_co', name: 'WhatsApp — Colombia' },
    { id: 'wa_af', name: 'WhatsApp — Afganistan' },
    { id: 'wa_al', name: 'WhatsApp — Albania' },
    { id: 'wa_dz', name: 'WhatsApp — Algeria' },
    { id: 'wa_at', name: 'WhatsApp — Austria' },
    { id: 'wa_br', name: 'WhatsApp — Brazil' },
    { id: 'tg_id', name: 'Telegram — Indonesia' },
    { id: 'tg_ph', name: 'Telegram — Filipina' },
    { id: 'tg_my', name: 'Telegram — Malaysia' },
    { id: 'tg_co', name: 'Telegram — Colombia' },
    { id: 'dana_id', name: 'Dana — Indonesia' }
];

const PANEL_SERVICES = [
    { id: 'ram_2gb', name: '2GB RAM' },
    { id: 'ram_3gb', name: '3GB RAM' },
    { id: 'ram_4gb', name: '4GB RAM' },
    { id: 'ram_5gb', name: '5GB RAM' },
    { id: 'ram_6gb', name: '6GB RAM' },
    { id: 'ram_7gb', name: '7GB RAM' },
    { id: 'ram_8gb', name: '8GB RAM' },
    { id: 'ram_9gb', name: '9GB RAM' },
    { id: 'ram_10gb', name: '10GB RAM' },
    { id: 'ram_unli', name: 'Unli-GB RAM' }
];

let promoList = [];
let promoClaimsMap = {};
let promoStatusValue = true;
let promoEditingId = null;
let promoCurrentImageUrl = '';
let suntikServicesCache = null;

function promoFormatRp(n) {
    return 'Rp ' + (parseInt(n) || 0).toLocaleString('id-ID');
}

function promoTimeShort(t) {
    if (!t) return '-';
    return t.substring(0, 5);
}

function deriveKey(secret) {
    return (async function() {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            enc.encode(secret),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: enc.encode(PROMO_ENC_SALT),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    })();
}

async function encryptPayload(obj, secret) {
    const key = await deriveKey(secret);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(JSON.stringify(obj))
    );
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode.apply(null, combined));
}

async function decryptPayload(encoded, secret) {
    const key = await deriveKey(secret);
    const combined = Uint8Array.from(atob(encoded), function(c) { return c.charCodeAt(0); });
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
}

async function promoFetch(path, options) {
    options = options || {};
    const controller = new AbortController();
    const timeoutId = setTimeout(function() { controller.abort(); }, 15000);
    try {
        const res = await fetch(PROMO_SUPA_URL + '/rest/v1/' + path, {
            method: options.method || 'GET',
            headers: {
                'apikey': PROMO_SUPA_KEY,
                'Content-Type': 'application/json',
                'Prefer': options.prefer || (options.method === 'POST' ? 'return=representation' : 'return=minimal')
            },
            body: options.body,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!res.ok) {
            const txt = await res.text();
            throw new Error('Promo fetch ' + res.status + ': ' + txt);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    } catch (e) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') throw new Error('Request timeout (15s)');
        throw e;
    }
}

async function fetchSuntikServices() {
    if (suntikServicesCache) return suntikServicesCache;

    try {
        const res = await fetch(SUNTIK_SUPA_URL + '/rest/v1/' + SUNTIK_TABLE + '?select=*&order=id.asc', {
            headers: {
                'apikey': SUNTIK_SUPA_KEY
            }
        });

        if (!res.ok) throw new Error('HTTP ' + res.status);

        const rows = await res.json();
        suntikServicesCache = (rows || []).map(function(r) {
            return {
                id: String(r.id_layanan || r.id),
                name: r.nama_layanan || 'Layanan #' + r.id,
                kategori: r.type || 'other',
                harga: r.harga || 0
            };
        });
        return suntikServicesCache;

    } catch (e) {
        console.error('Gagal load suntik services:', e);
        return [];
    }
}

async function uploadPromoImage(file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const fileName = 'promo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8) + '.' + ext;
    const url = PROMO_SUPA_URL + '/storage/v1/object/' + PROMO_BUCKET + '/' + fileName;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': PROMO_SUPA_KEY,
            'Content-Type': file.type || 'image/jpeg',
            'x-upsert': 'true'
        },
        body: file
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error('Upload gagal: ' + err);
    }

    return PROMO_SUPA_URL + '/storage/v1/object/public/' + PROMO_BUCKET + '/' + fileName;
}

async function deletePromoImage(imageUrl) {
    if (!imageUrl) return;
    try {
        const marker = '/object/public/' + PROMO_BUCKET + '/';
        const idx = imageUrl.indexOf(marker);
        if (idx === -1) return;
        const fileName = imageUrl.substring(idx + marker.length);
        const url = PROMO_SUPA_URL + '/storage/v1/object/' + PROMO_BUCKET + '/' + fileName;
        await fetch(url, {
            method: 'DELETE',
            headers: { 'apikey': PROMO_SUPA_KEY }
        });
    } catch (e) {
        console.warn('Gagal hapus gambar (diabaikan):', e.message);
    }
}

function populateProductOptions() {
    const sel = document.getElementById('promoProductId');
    if (!sel) return;
    let html = '<option value="">— Pilih Produk —</option>';
    PRODUCT_LIST.forEach(function(p) {
        html += '<option value="' + p.id + '">' + p.name + ' (ID: ' + p.id + ')</option>';
    });
    sel.innerHTML = html;
}

async function onPromoProductChange() {
    const sel = document.getElementById('promoProductId');
    if (!sel) return;

    const productId = parseInt(sel.value);
    const group = document.getElementById('promoSubServiceGroup');
    const label = document.getElementById('promoSubServiceLabel');
    const hint = document.getElementById('promoSubServiceHint');
    const dropdownWrap = document.getElementById('promoServiceDropdownWrap');
    const manualWrap = document.getElementById('promoServiceManualWrap');
    const dropdown = document.getElementById('promoServiceId');
    const manual = document.getElementById('promoServiceIdManual');
    const typeInput = document.getElementById('promoServiceType');

    const product = PRODUCT_LIST.find(function(p) { return p.id === productId; });

    if (!product || product.type === 'generic') {
        group.style.display = 'none';
        dropdown.innerHTML = '<option value="">— Pilih —</option>';
        manual.value = '';
        typeInput.value = 'generic';
        return;
    }

    group.style.display = 'block';
    typeInput.value = product.type;

    if (product.type === 'suntik') {
        dropdownWrap.style.display = 'flex';
        manualWrap.style.display = 'none';
        manual.value = '';

        label.innerHTML = '<i class="ri-list-check"></i> Pilih Layanan Suntik';
        hint.textContent = 'Memuat daftar layanan dari server...';
        dropdown.innerHTML = '<option value="">— Memuat... —</option>';

        const list = await fetchSuntikServices();

        if (list.length === 0) {
            dropdown.innerHTML = '<option value="">— Gagal memuat layanan —</option>';
            hint.textContent = 'Cek koneksi internet';
            return;
        }

        let html = '<option value="">— Pilih Layanan —</option>';
        list.forEach(function(s) {
            html += '<option value="' + s.id + '">' + s.name + ' — ' + promoFormatRp(s.harga) + '</option>';
        });
        dropdown.innerHTML = html;
        hint.textContent = 'Diskon berlaku untuk layanan ini saja (' + list.length + ' layanan tersedia)';
        return;
    }

    const dropdownTypes = ['premium_app', 'suntik_paket', 'nokos', 'panel'];
    const manualTypes = ['apk', 'topup_ff'];

    if (dropdownTypes.indexOf(product.type) !== -1) {
        dropdownWrap.style.display = 'flex';
        manualWrap.style.display = 'none';
        manual.value = '';

        let list = [];
        let labelText = '';
        let hintText = '';

        if (product.type === 'premium_app') {
            list = PREMIUM_APPS_SERVICES;
            labelText = '<i class="ri-apps-line"></i> Pilih Aplikasi Premium';
            hintText = 'Diskon berlaku untuk aplikasi ini saja';
        } else if (product.type === 'suntik_paket') {
            list = PAKET_SOSMED_SERVICES;
            labelText = '<i class="ri-gift-line"></i> Pilih Paket Suntik';
            hintText = 'Diskon berlaku untuk paket ini saja';
        } else if (product.type === 'nokos') {
            list = NOKOS_SERVICES;
            labelText = '<i class="ri-phone-line"></i> Pilih Nokos';
            hintText = 'Diskon berlaku untuk nomor aplikasi-negara ini saja';
        } else if (product.type === 'panel') {
            list = PANEL_SERVICES;
            labelText = '<i class="ri-server-line"></i> Pilih RAM Panel';
            hintText = 'Diskon berlaku untuk varian RAM ini saja';
        }

        label.innerHTML = labelText;
        hint.textContent = hintText;

        let html = '<option value="">— Pilih —</option>';
        list.forEach(function(s) {
            html += '<option value="' + s.id + '">' + s.name + ' (ID: ' + s.id + ')</option>';
        });
        dropdown.innerHTML = html;

    } else if (manualTypes.indexOf(product.type) !== -1) {
        dropdownWrap.style.display = 'none';
        manualWrap.style.display = 'flex';
        dropdown.innerHTML = '<option value="">— Pilih —</option>';

        if (product.type === 'apk') {
            label.innerHTML = '<i class="ri-hashtag"></i> Kode Paket APK';
            hint.textContent = 'Masukkan kode paket (contoh: villain_1, xfar_2)';
            manual.placeholder = 'Contoh: villain_1';
        } else if (product.type === 'topup_ff') {
            label.innerHTML = '<i class="ri-hashtag"></i> Nominal Diamond FF';
            hint.textContent = 'Masukkan nominal diamond (contoh: 70, 140, 355)';
            manual.placeholder = 'Contoh: 70';
        }
    }
}

function setupPromoForm() {
    populateProductOptions();

    const productSel = document.getElementById('promoProductId');
    if (productSel) productSel.addEventListener('change', onPromoProductChange);

    document.querySelectorAll('.type-btn[data-promo-status]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.type-btn[data-promo-status]').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            promoStatusValue = this.dataset.promoStatus === 'true';
        });
    });

    const fileInput = document.getElementById('promoGambarFile');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('promoImagePreviewImg').src = e.target.result;
                document.getElementById('promoImagePreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    const submitBtn = document.getElementById('promoSubmitBtn');
    if (submitBtn) submitBtn.addEventListener('click', submitPromo);

    const cancelBtn = document.getElementById('promoCancelEditBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', cancelPromoEdit);

    const refreshBtn = document.getElementById('promoRefreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', function() {
        suntikServicesCache = null;
        loadPromoList();
        showToast('Daftar promo diperbarui');
    });

    const filter = document.getElementById('promoFilterStatus');
    if (filter) filter.addEventListener('change', renderPromoList);
}

function getServiceIdFromForm() {
    const type = document.getElementById('promoServiceType').value;
    if (type === 'generic') return null;

    const dropdownTypes = ['suntik', 'premium_app', 'suntik_paket', 'nokos', 'panel'];
    if (dropdownTypes.indexOf(type) !== -1) {
        return document.getElementById('promoServiceId').value || null;
    }
    return document.getElementById('promoServiceIdManual').value.trim() || null;
}

async function submitPromo() {
    const editId = document.getElementById('promoEditId').value;
    const productId = parseInt(document.getElementById('promoProductId').value);
    const nama = document.getElementById('promoNama').value.trim();
    const jumlah = parseInt(document.getElementById('promoJumlah').value) || 0;
    const hargaAwal = parseInt(document.getElementById('promoHargaAwal').value) || 0;
    const hargaDiskon = parseInt(document.getElementById('promoHargaDiskon').value) || 0;
    const dariJam = document.getElementById('promoDariJam').value;
    const sampaiJam = document.getElementById('promoSampaiJam').value;
    const kuota = parseInt(document.getElementById('promoKuota').value) || 0;
    const fileInput = document.getElementById('promoGambarFile');
    const serviceType = document.getElementById('promoServiceType').value || 'generic';
    const serviceId = getServiceIdFromForm();

    if (!productId) return showToast('Pilih produk dulu', true);
    if (!nama) return showToast('Nama wajib diisi', true);
    if (jumlah <= 0) return showToast('Jumlah di promo harus > 0', true);
    if (hargaAwal <= 0) return showToast('Harga awal harus > 0', true);
    if (hargaDiskon <= 0) return showToast('Harga diskon harus > 0', true);
    if (hargaDiskon >= hargaAwal) return showToast('Harga diskon harus lebih kecil dari harga awal', true);
    if (!dariJam || !sampaiJam) return showToast('Jam aktif wajib diisi', true);
    if (kuota <= 0) return showToast('Kuota user harus > 0', true);
    if (serviceType !== 'generic' && !serviceId) {
        return showToast('Masukkan / pilih sub-layanan dulu', true);
    }
    if (!editId && (!fileInput.files || !fileInput.files[0]) && !promoCurrentImageUrl) {
        return showToast('Upload gambar promo', true);
    }

    showLoading(editId ? 'Update promo...' : 'Menyimpan promo...');

    try {
        let imageUrl = promoCurrentImageUrl;

        if (fileInput.files && fileInput.files[0]) {
            if (promoCurrentImageUrl) await deletePromoImage(promoCurrentImageUrl);
            imageUrl = await uploadPromoImage(fileInput.files[0]);
        }

        const payloadData = {
            nama_produk: nama,
            jumlah_promo: jumlah,
            harga_awal: hargaAwal,
            harga_diskon: hargaDiskon,
            gambar_url: imageUrl,
            aktif_dari_jam: dariJam + ':00',
            aktif_sampai_jam: sampaiJam + ':00',
            kuota_user: kuota,
            service_id: serviceId,
            service_type: serviceType
        };

        let savedId = editId ? parseInt(editId) : null;

        if (!savedId) {
            const temp = await promoFetch(PROMO_TABLE, {
                method: 'POST',
                body: JSON.stringify({
                    product_id: productId,
                    nama_produk: nama,
                    jumlah_promo: jumlah,
                    harga_awal: hargaAwal,
                    harga_diskon: hargaDiskon,
                    gambar_url: imageUrl,
                    aktif_dari_jam: dariJam + ':00',
                    aktif_sampai_jam: sampaiJam + ':00',
                    kuota_user: kuota,
                    kuota_terpakai: 0,
                    is_active: promoStatusValue,
                    service_id: serviceId,
                    service_type: serviceType
                })
            });
            if (temp && temp[0]) savedId = temp[0].id;
        }

        if (!savedId) throw new Error('Gagal dapat ID promo');

        const secret = 'promo_' + savedId + '_' + productId + '_' + PROMO_ENC_SALT;
        const encrypted = await encryptPayload(payloadData, secret);

        await promoFetch(PROMO_TABLE + '?id=eq.' + savedId, {
            method: 'PATCH',
            body: JSON.stringify({
                product_id: productId,
                nama_produk: nama,
                jumlah_promo: jumlah,
                harga_awal: hargaAwal,
                harga_diskon: hargaDiskon,
                gambar_url: imageUrl,
                aktif_dari_jam: dariJam + ':00',
                aktif_sampai_jam: sampaiJam + ':00',
                kuota_user: kuota,
                is_active: promoStatusValue,
                service_id: serviceId,
                service_type: serviceType,
                encrypted_payload: encrypted,
                updated_at: new Date().toISOString()
            })
        });

        hideLoading();
        showToast(editId ? 'Promo diperbarui' : 'Promo dibuat');
        resetPromoForm();
        loadPromoList();

    } catch (e) {
        hideLoading();
        console.error(e);
        showToast(e.message || 'Gagal simpan promo', true);
    }
}

function resetPromoForm() {
    document.getElementById('promoEditId').value = '';
    document.getElementById('promoProductId').value = '';
    document.getElementById('promoNama').value = '';
    document.getElementById('promoJumlah').value = '';
    document.getElementById('promoHargaAwal').value = '';
    document.getElementById('promoHargaDiskon').value = '';
    document.getElementById('promoDariJam').value = '00:00';
    document.getElementById('promoSampaiJam').value = '23:59';
    document.getElementById('promoKuota').value = '';
    document.getElementById('promoGambarFile').value = '';
    document.getElementById('promoImagePreview').style.display = 'none';
    document.getElementById('promoImagePreviewImg').src = '';
    document.getElementById('promoFormTitle').textContent = 'Buat Promo Diskon';
    document.getElementById('promoSubmitText').textContent = 'Simpan Promo';
    document.getElementById('promoCancelEditBtn').style.display = 'none';
    document.getElementById('promoServiceId').innerHTML = '<option value="">— Pilih —</option>';
    document.getElementById('promoServiceIdManual').value = '';
    document.getElementById('promoServiceType').value = 'generic';
    document.getElementById('promoSubServiceGroup').style.display = 'none';

    document.querySelectorAll('.type-btn[data-promo-status]').forEach(function(b, i) {
        b.classList.toggle('active', i === 0);
    });
    promoStatusValue = true;
    promoEditingId = null;
    promoCurrentImageUrl = '';
}

function cancelPromoEdit() {
    resetPromoForm();
    showToast('Edit dibatalkan');
}

async function startEditPromo(id) {
    const row = promoList.find(function(p) { return p.id === id; });
    if (!row) return;

    promoEditingId = id;
    promoCurrentImageUrl = row.gambar_url || '';

    document.getElementById('promoEditId').value = id;
    document.getElementById('promoProductId').value = row.product_id;
    document.getElementById('promoNama').value = row.nama_produk;
    document.getElementById('promoJumlah').value = row.jumlah_promo || '';
    document.getElementById('promoHargaAwal').value = row.harga_awal;
    document.getElementById('promoHargaDiskon').value = row.harga_diskon;
    document.getElementById('promoDariJam').value = (row.aktif_dari_jam || '').substring(0, 5);
    document.getElementById('promoSampaiJam').value = (row.aktif_sampai_jam || '').substring(0, 5);
    document.getElementById('promoKuota').value = row.kuota_user;
    document.getElementById('promoFormTitle').textContent = 'Edit Promo Diskon';
    document.getElementById('promoSubmitText').textContent = 'Update Promo';
    document.getElementById('promoCancelEditBtn').style.display = 'flex';

    document.getElementById('promoServiceType').value = row.service_type || 'generic';

    await onPromoProductChange();

    if (row.service_id) {
        const dropdownTypes = ['suntik', 'premium_app', 'suntik_paket', 'nokos', 'panel'];
        if (dropdownTypes.indexOf(row.service_type) !== -1) {
            document.getElementById('promoServiceId').value = row.service_id;
        } else {
            document.getElementById('promoServiceIdManual').value = row.service_id;
        }
    }

    if (row.gambar_url) {
        document.getElementById('promoImagePreviewImg').src = row.gambar_url;
        document.getElementById('promoImagePreview').style.display = 'block';
    } else {
        document.getElementById('promoImagePreview').style.display = 'none';
    }

    document.querySelectorAll('.type-btn[data-promo-status]').forEach(function(b) {
        b.classList.toggle('active', (b.dataset.promoStatus === 'true') === row.is_active);
    });
    promoStatusValue = !!row.is_active;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function togglePromoStatus(id) {
    const row = promoList.find(function(p) { return p.id === id; });
    if (!row) return;

    const next = !row.is_active;
    showConfirmModal('Ubah Status Promo', [
        { label: 'Produk', value: row.nama_produk },
        { label: 'Status Baru', value: next ? 'AKTIF' : 'NONAKTIF', danger: !next }
    ], async function() {
        closeConfirmModal();
        showLoading('Update status...');
        try {
            await promoFetch(PROMO_TABLE + '?id=eq.' + id, {
                method: 'PATCH',
                body: JSON.stringify({ is_active: next, updated_at: new Date().toISOString() })
            });
            hideLoading();
            showToast('Status diubah');
            loadPromoList();
        } catch (e) {
            hideLoading();
            showToast('Gagal update status: ' + (e.message || 'unknown'), true);
        }
    });
}

async function deletePromo(id) {
    const row = promoList.find(function(p) { return p.id === id; });
    if (!row) return;

    showConfirmModal('Hapus Promo', [
        { label: 'Produk', value: row.nama_produk },
        { label: 'Peringatan', value: 'Tidak bisa dibatalkan!', danger: true }
    ], async function() {
        closeConfirmModal();
        showLoading('Menghapus...');
        try {
            if (row.gambar_url) {
                await deletePromoImage(row.gambar_url);
            }

            try {
                await promoFetch(PROMO_CLAIM_TABLE + '?promo_id=eq.' + id, {
                    method: 'DELETE',
                    prefer: 'return=minimal'
                });
            } catch (e1) {
                console.warn('Hapus klaim gagal (diabaikan):', e1.message);
            }

            await promoFetch(PROMO_TABLE + '?id=eq.' + id, {
                method: 'DELETE',
                prefer: 'return=minimal'
            });

            hideLoading();
            showToast('Promo dihapus');
            if (promoEditingId === id) resetPromoForm();
            loadPromoList();
        } catch (e) {
            hideLoading();
            console.error('Delete promo error:', e);
            showToast('Gagal hapus promo: ' + (e.message || 'unknown'), true);
        }
    });
}

async function resetPromoClaim(id) {
    const row = promoList.find(function(p) { return p.id === id; });
    if (!row) return;

    showConfirmModal('Reset Klaim', [
        { label: 'Produk', value: row.nama_produk },
        { label: 'Klaim Terpakai', value: row.kuota_terpakai + ' / ' + row.kuota_user, danger: true }
    ], async function() {
        closeConfirmModal();
        showLoading('Reset klaim...');
        try {
            await promoFetch(PROMO_CLAIM_TABLE + '?promo_id=eq.' + id, {
                method: 'DELETE',
                prefer: 'return=minimal'
            });
            await promoFetch(PROMO_TABLE + '?id=eq.' + id, {
                method: 'PATCH',
                body: JSON.stringify({ kuota_terpakai: 0 })
            });
            hideLoading();
            showToast('Klaim direset');
            loadPromoList();
        } catch (e) {
            hideLoading();
            console.error('Reset klaim error:', e);
            showToast('Gagal reset klaim: ' + (e.message || 'unknown'), true);
        }
    });
}

async function loadPromoList() {
    const list = document.getElementById('promoList');
    const count = document.getElementById('promoCount');
    if (!list) return;

    try {
        const rows = await promoFetch(PROMO_TABLE + '?select=*&order=created_at.desc');
        promoList = Array.isArray(rows) ? rows : [];

        try {
            const claims = await promoFetch(PROMO_CLAIM_TABLE + '?select=*&order=claimed_at.desc');
            promoClaimsMap = {};
            (claims || []).forEach(function(c) {
                if (!promoClaimsMap[c.promo_id]) promoClaimsMap[c.promo_id] = [];
                promoClaimsMap[c.promo_id].push(c);
            });
        } catch (e) {
            console.warn('Gagal load klaim:', e.message);
            promoClaimsMap = {};
        }

        if (count) count.textContent = promoList.length;
        renderPromoList();
    } catch (e) {
        console.error(e);
        list.innerHTML = '<div class="riwayat-empty"><i class="ri-error-warning-line"></i><p>Gagal memuat promo</p></div>';
    }
}

function getServiceLabel(row) {
    if (!row.service_type || row.service_type === 'generic') {
        return 'Produk Utuh';
    }

    if (row.service_type === 'suntik') {
        if (suntikServicesCache) {
            const item = suntikServicesCache.find(function(s) { return s.id === String(row.service_id); });
            if (item) return 'Suntik: ' + item.name;
        }
        return 'Suntik ID: ' + row.service_id;
    }

    const map = {
        premium_app: { list: PREMIUM_APPS_SERVICES, prefix: 'App' },
        suntik_paket: { list: PAKET_SOSMED_SERVICES, prefix: 'Paket' },
        nokos: { list: NOKOS_SERVICES, prefix: 'Nokos' },
        panel: { list: PANEL_SERVICES, prefix: 'Panel' },
        apk: { list: null, prefix: 'APK' },
        topup_ff: { list: null, prefix: 'DM' }
    };

    const conf = map[row.service_type];
    if (!conf) return row.service_type + ': ' + row.service_id;

    if (conf.list) {
        const item = conf.list.find(function(s) { return s.id === String(row.service_id); });
        return conf.prefix + ': ' + (item ? item.name : row.service_id);
    }

    return conf.prefix + ': ' + row.service_id;
}

function renderPromoList() {
    const list = document.getElementById('promoList');
    if (!list) return;

    const filterEl = document.getElementById('promoFilterStatus');
    const filter = filterEl ? filterEl.value : 'all';

    let filtered = promoList.slice();
    if (filter === 'active') filtered = filtered.filter(function(p) { return p.is_active && p.kuota_terpakai < p.kuota_user; });
    else if (filter === 'inactive') filtered = filtered.filter(function(p) { return !p.is_active; });
    else if (filter === 'expired') filtered = filtered.filter(function(p) { return p.kuota_terpakai >= p.kuota_user; });

    if (filtered.length === 0) {
        list.innerHTML = '<div class="riwayat-empty"><i class="ri-inbox-line"></i><p>Tidak ada promo</p></div>';
        return;
    }

    list.innerHTML = filtered.map(function(row) {
        const isFull = row.kuota_terpakai >= row.kuota_user;
        const statusClass = isFull ? 'full' : (row.is_active ? 'on' : 'off');
        const statusText = isFull ? 'Kuota Habis' : (row.is_active ? 'Aktif' : 'Nonaktif');
        const progressPct = row.kuota_user > 0 ? Math.min(100, (row.kuota_terpakai / row.kuota_user) * 100) : 0;
        const diskonPct = row.harga_awal > 0 ? Math.round(((row.harga_awal - row.harga_diskon) / row.harga_awal) * 100) : 0;

        const claims = promoClaimsMap[row.id] || [];
        let claimsHtml = '';
        if (claims.length > 0) {
            claimsHtml = '<div class="promo-claims-box">' +
                '<div class="promo-claims-title"><i class="ri-user-3-line"></i> Daftar Klaim (' + claims.length + ')</div>' +
                claims.map(function(c, i) {
                    let tgl = '-';
                    if (c.claimed_at) {
                        const d = new Date(c.claimed_at);
                        tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
                              ' • ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    }
                    return '<div class="promo-claim-item">' +
                        '<span class="promo-claim-num">' + (i + 1) + '</span>' +
                        '<span class="promo-claim-user"><i class="ri-user-line"></i> ' + (c.username || '-') + '</span>' +
                        '<span class="promo-claim-time"><i class="ri-time-line"></i> ' + tgl + '</span>' +
                    '</div>';
                }).join('') +
            '</div>';
        } else {
            claimsHtml = '<div class="promo-claims-empty"><i class="ri-user-line"></i> Belum ada klaim</div>';
        }

        return '<div class="promo-item">' +
            '<div class="promo-item-header">' +
                '<img src="' + (row.gambar_url || '') + '" class="promo-item-img" alt="img" onerror="this.style.display=\'none\'">' +
                '<div class="promo-item-info">' +
                    '<div class="promo-item-name">' + row.nama_produk + '</div>' +
                    '<div class="promo-item-price">' +
                        '<span class="promo-old-price">' + promoFormatRp(row.harga_awal) + '</span>' +
                        '<span class="promo-new-price">' + promoFormatRp(row.harga_diskon) + '</span>' +
                        '<span class="promo-badge-active ' + statusClass + '">' + statusText + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="promo-item-meta">' +
                '<span><i class="ri-time-line"></i> ' + promoTimeShort(row.aktif_dari_jam) + ' - ' + promoTimeShort(row.aktif_sampai_jam) + '</span>' +
                '<span><i class="ri-group-line"></i> ' + row.kuota_terpakai + ' / ' + row.kuota_user + ' user</span>' +
                '<span><i class="ri-bar-chart-line"></i> ' + (row.jumlah_promo ? row.jumlah_promo.toLocaleString('id-ID') + ' unit' : '-') + '</span>' +
                '<span><i class="ri-price-tag-2-line"></i> ' + getServiceLabel(row) + '</span>' +
                (diskonPct > 0 ? '<span style="color:var(--success);font-weight:900;">🔥 Hemat ' + diskonPct + '%</span>' : '') +
            '</div>' +
            '<div class="promo-progress"><div class="promo-progress-fill" style="width:' + progressPct + '%"></div></div>' +
            claimsHtml +
            '<div class="promo-item-actions">' +
                '<button class="promo-action-btn edit" onclick="startEditPromo(' + row.id + ')"><i class="ri-edit-line"></i> Edit</button>' +
                '<button class="promo-action-btn toggle" onclick="togglePromoStatus(' + row.id + ')"><i class="ri-toggle-line"></i> ' + (row.is_active ? 'Off' : 'On') + '</button>' +
                '<button class="promo-action-btn delete" onclick="deletePromo(' + row.id + ')"><i class="ri-delete-bin-line"></i> Hapus</button>' +
            '</div>' +
            '<button class="promo-action-btn toggle" style="margin-top:4px;" onclick="resetPromoClaim(' + row.id + ')"><i class="ri-refresh-line"></i> Reset Klaim</button>' +
        '</div>';
    }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    setupPromoForm();
    loadPromoList();

    const tabBtn = document.querySelector('.nav-btn[data-tab="promo"]');
    if (tabBtn) {
        tabBtn.addEventListener('click', function() {
            setTimeout(loadPromoList, 300);
        });
    }
});

window.startEditPromo = startEditPromo;
window.togglePromoStatus = togglePromoStatus;
window.deletePromo = deletePromo;
window.resetPromoClaim = resetPromoClaim;