function showPage(pageId) {
    // 頁面切換和按鈕激活邏輯 (保持不變)
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-button');
    
    pages.forEach(page => page.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId) || document.getElementById('about');
    targetPage.classList.add('active');
    pageId = targetPage.id;

    const targetButton = Array.from(buttons).find(btn => {
        const btnPageId = btn.getAttribute('onclick')?.match(/showPage\('([^']+)'\)/)?.[1];
        return btnPageId === pageId;
    });

    if (targetButton) {
        targetButton.classList.add('active');
        const parentSubmenu = targetButton.closest('.submenu');
        if (parentSubmenu) {
            const dropdownBtn = parentSubmenu.previousElementSibling;
            if (dropdownBtn && dropdownBtn.id === 'service-dropdown-btn') {
                dropdownBtn.classList.add('active');
            }
        }
    }
    
    const newHash = '#' + pageId;
    if (window.location.hash !== newHash) {
        window.history.pushState({ page: pageId }, '', newHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 【重要】：在切換頁面後，如果選單是開啟的 (只有手機版)，應立即關閉。
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('menu-open')) {
        mobileMenu.classList.remove('menu-open');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const dropdownBtn = document.getElementById('service-dropdown-btn');
    const dropdownItem = dropdownBtn ? dropdownBtn.closest('.dropdown') : null;
    
    // ------------------------------------------
    // 1. 漢堡選單邏輯 (手機版)
    // ------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        // 點擊漢堡按鈕：開啓/關閉側邊選單
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('menu-open');
        });
        
        // 點擊選單內的任何按鈕後，如果頁面是手機尺寸，則關閉選單
        mobileMenu.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', () => {
                // 檢查是否在手機螢幕尺寸內
                if (window.innerWidth <= 768) {
                    // showPage 函數本身會處理 mobileMenu.classList.remove('menu-open');
                    // 但為了確保漢堡選單按鈕的行為，這裡不需要額外處理
                }
            });
        });
    }

    // ------------------------------------------
    // 2. 桌面下拉選單邏輯 (min-width: 769px)
    // ------------------------------------------
    if (dropdownItem) {
        // 桌面版使用 CSS :hover 展開，但我們需要防止點擊主按鈕時頁面切換
        dropdownBtn.addEventListener('click', (event) => {
            // 阻止點擊主按鈕時發生任何頁面切換或選單切換，讓 CSS hover 接管
            if (window.innerWidth > 768) {
                 event.preventDefault(); 
                 event.stopPropagation();
            }
        });
        
        // 桌面版點擊頁面其他地方時關閉 (防止滑鼠離開選單後仍保持開啟)
        document.addEventListener('click', (event) => {
            if (window.innerWidth > 768 && !dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
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