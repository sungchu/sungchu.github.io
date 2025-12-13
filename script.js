function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-button');
    
    // 清除所有 active 狀態
    pages.forEach(page => page.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));
    
    // 激活目標頁面
    const targetPage = document.getElementById(pageId) || document.getElementById('about');
    targetPage.classList.add('active');
    pageId = targetPage.id;

    // 激活目標按鈕
    const targetButton = Array.from(buttons).find(btn => {
        const btnPageId = btn.getAttribute('onclick')?.match(/showPage\('([^']+)'\)/)?.[1];
        return btnPageId === pageId;
    });

    if (targetButton) {
        targetButton.classList.add('active');
        
        // 激活下拉選單的父按鈕
        const parentSubmenu = targetButton.closest('.submenu');
        if (parentSubmenu) {
            const dropdownBtn = parentSubmenu.previousElementSibling;
            if (dropdownBtn && dropdownBtn.id === 'service-dropdown-btn') {
                dropdownBtn.classList.add('active');
            }
        }
    }
    
    // History API 處理
    const newHash = '#' + pageId;
    if (window.location.hash !== newHash) {
        window.history.pushState({ page: pageId }, '', newHash);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // *** 注意：此處刻意移除自動收回選單的邏輯 ***
}

// 啟動時和下拉式選單的邏輯處理
document.addEventListener('DOMContentLoaded', () => {
    
    const dropdownBtn = document.getElementById('service-dropdown-btn');
    const dropdownItem = dropdownBtn ? dropdownBtn.closest('.dropdown') : null;

    if (dropdownItem) {
        // 1. 點擊主按鈕時：切換 'active-dropdown' 類別來顯示/隱藏選單
        dropdownBtn.addEventListener('click', (event) => {
            // 阻止事件傳遞給 document，防止立即被 document 的監聽器關閉
            event.stopPropagation(); 
            
            // 每次點擊都切換狀態
            dropdownItem.classList.toggle('active-dropdown');
        });

        // 2. 點擊頁面其他地方時：關閉選單 (保留此功能，確保點擊頁面空白處可關閉)
        document.addEventListener('click', (event) => {
            if (!dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
        });
        
        // *** 子選單按鈕沒有額外的 addEventListener 處理收回 ***
    }

    // 初始化頁面
    let initialPage = 'about'; 
    const validPages = ['about', 'services', 'workshops', 'courses', 'booking', 'testimonials'];
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1); 
        if (validPages.includes(hashId)) {
            initialPage = hashId;
        }
    }
    showPage(initialPage);
});


// 監聽 URL Hash 改變事件
window.addEventListener('hashchange', () => {
    let pageId = window.location.hash ? window.location.hash.substring(1) : 'about';
    showPage(pageId);
});