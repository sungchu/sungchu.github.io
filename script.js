function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-button');
    
    // --- 1. 頁面和按鈕的激活/去激活邏輯 ---
    pages.forEach(page => page.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));
    
    // 確保目標頁面存在
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        // 如果頁面不存在，預設回 'about'
        pageId = 'about';
        document.getElementById(pageId).classList.add('active');
    }

    // 找到對應的按鈕並加上 active 類別
    const targetButton = Array.from(buttons).find(btn => {
        // 透過解析 onclick 屬性找到對應的 pageId
        const btnPageId = btn.getAttribute('onclick')?.match(/showPage\('([^']+)'\)/)?.[1];
        
        return btnPageId === pageId;
    });

    if (targetButton) {
        targetButton.classList.add('active');
        
        // 【關鍵邏輯】：如果被激活的按鈕是下拉選單中的子項目，
        // 則也要將父層的 '服務項目' 按鈕標記為 active，以保持視覺一致性。
        const parentSubmenu = targetButton.closest('.submenu');
        if (parentSubmenu) {
            // 找到主按鈕 (即 submenu 的前一個兄弟元素)
            const dropdownBtn = parentSubmenu.previousElementSibling;
            if (dropdownBtn && dropdownBtn.id === 'service-dropdown-btn') {
                dropdownBtn.classList.add('active');
            }
        }
    }
    
    // --- 2. History API 處理 ---
    const newHash = '#' + pageId;
    // 只有當當前 Hash 與目標 Hash 不同時才 pushState
    if (window.location.hash !== newHash) {
        window.history.pushState({ page: pageId }, '', newHash);
    }

    // 平滑滾動至頁面頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 啟動時和下拉式選單的邏輯處理
document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. 處理下拉式選單的開合邏輯 (Dropdown Toggle) ---
    const dropdownBtn = document.getElementById('service-dropdown-btn');
    const dropdownItem = dropdownBtn ? dropdownBtn.closest('.dropdown') : null;

    if (dropdownItem) {
        // 點擊主按鈕時：切換 'active-dropdown' 類別來顯示/隱藏選單
        dropdownBtn.addEventListener('click', (event) => {
            // 點擊下拉按鈕時，阻止事件傳播，避免立即關閉
            event.stopPropagation(); 
            dropdownItem.classList.toggle('active-dropdown');
        });

        // 點擊子選單按鈕時：【自動收回選單】
        dropdownItem.querySelectorAll('.submenu .nav-button').forEach(button => {
            button.addEventListener('click', () => {
                // 點擊子項目後，切換頁面 (由 onclick 處理)，然後關閉選單
                dropdownItem.classList.remove('active-dropdown');
            });
        });

        // 點擊頁面其他地方時：關閉選單
        document.addEventListener('click', (event) => {
            // 如果點擊目標不在下拉容器內，則移除 active-dropdown
            if (!dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
        });
    }


    // --- B. 啟動時確保初始狀態正確 (Initial Load) ---
    let initialPage = 'about'; // 預設頁面
    const validPages = ['about', 'services', 'workshops', 'courses', 'booking', 'testimonials'];

    // 1. 檢查 URL 中是否有 #hash
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1); 
        
        if (validPages.includes(hashId)) {
            initialPage = hashId;
        }
    }

    // 2. 呼叫 showPage 來初始化頁面和按鈕
    showPage(initialPage);
});


// --- 3. 監聽 URL Hash 改變事件 (處理瀏覽器的 上一頁/下一頁 按鈕) ---
window.addEventListener('hashchange', () => {
    let pageId = 'about'; // 預設頁面
    if (window.location.hash) {
        pageId = window.location.hash.substring(1);
    }
    
    // 重新呼叫 showPage，它會負責切換內容
    showPage(pageId);
});