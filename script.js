/**
 * NETI 療癒工作室 JavaScript (最終穩定版本 - 確保手機下拉開啓和頁面切換)
 */

/**
 * 根據 pageId 切換頁面內容和導覽列按鈕的激活狀態。
 */
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

    // 延遲關閉選單（用於子項目點擊後收回）
    // 【關鍵修正】：如果目標是子項目，延遲關閉。
    const targetIsSubmenuItem = targetButton && targetButton.closest('.submenu');
    if (targetIsSubmenuItem) {
        setTimeout(() => {
            document.querySelectorAll('.dropdown').forEach(item => {
                item.classList.remove('active-dropdown');
            });
        }, 100); 
    }
}

// 啟動時和下拉式選單的邏輯處理
document.addEventListener('DOMContentLoaded', () => {
    
    const dropdownBtn = document.getElementById('service-dropdown-btn');
    const dropdownItem = dropdownBtn ? dropdownBtn.closest('.dropdown') : null;

    if (dropdownItem) {
        // 1. 點擊主按鈕時：開啓選單
        dropdownBtn.addEventListener('click', (event) => {
            // 【關鍵修正】：移除所有不必要的 stopPropagation()。
            // 只需要 toggle active-dropdown 狀態。
            dropdownItem.classList.toggle('active-dropdown');

            // 確保點擊後，頁面上的全局收合監聽器不會立即關閉它。
            // 將 event.stopPropagation() 留在此處
            // event.stopPropagation(); 
        });

        // 2. 點擊頁面其他地方時：關閉選單 (保留此功能)
        document.addEventListener('click', (event) => {
            if (!dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
        });
        
        // 【新增】：子選單按鈕，確保點擊時不會觸發外部的收合邏輯
        dropdownItem.querySelectorAll('.submenu .nav-button').forEach(button => {
            button.addEventListener('click', (event) => {
                // 阻止事件冒泡到主按鈕，防止出現雙擊效果
                event.stopPropagation();
            });
        });
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