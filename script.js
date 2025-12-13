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

    // 激活目標按鈕 (略過 dropdown 元素本身)
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
    
    // *** 關鍵：此版本不包含自動收回選單的邏輯 ***
}

document.addEventListener('DOMContentLoaded', () => {
    
    const dropdownBtn = document.getElementById('service-dropdown-btn');
    const dropdownItem = dropdownBtn ? dropdownBtn.closest('.dropdown') : null;

    if (dropdownItem) {
        // 1. 點擊主按鈕時：【唯一目的：切換下拉選單狀態】
        dropdownBtn.addEventListener('click', (event) => {
            // 確保點擊動作只執行 toggle，並停止事件冒泡，防止 document 上的監聽器立即關閉它
            event.stopPropagation(); 
            dropdownItem.classList.toggle('active-dropdown');
        });

        // 2. 點擊頁面其他地方時：【保留此功能，這是唯一收回選單的方式】
        document.addEventListener('click', (event) => {
            if (!dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
        });
        
        // 3. 子選單項目點擊時：【阻止冒泡，確保點擊頁面後不會誤觸主按鈕的 toggle】
        dropdownItem.querySelectorAll('.submenu .nav-button').forEach(button => {
            button.addEventListener('click', (event) => {
                // 必須阻止冒泡，否則在點擊子項目時，事件會傳遞到主按鈕，導致主按鈕的 toggle 邏輯被執行。
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

window.addEventListener('hashchange', () => {
    let pageId = window.location.hash ? window.location.hash.substring(1) : 'about';
    showPage(pageId);
});