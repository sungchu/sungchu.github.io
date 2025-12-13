function showPage(pageId) {
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
    
    // 【修正滾動】：將 window.scrollTo 移入 setTimeout 延遲執行
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50); 
    
    // 【收回邏輯】：子項目點擊後，強制關閉選單
    const targetIsSubmenuItem = targetButton && targetButton.closest('.submenu');
    if (targetIsSubmenuItem) {
        setTimeout(() => {
            document.querySelectorAll('.dropdown').forEach(item => {
                item.classList.remove('active-dropdown');
            });
        }, 100); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const dropdownBtn = document.getElementById('service-dropdown-btn');
    const dropdownItem = dropdownBtn ? dropdownBtn.closest('.dropdown') : null;

    if (dropdownItem) {
        // --- 1. 點擊/觸控主按鈕時：開啓選單 ---
        const toggleDropdown = (event) => {
            event.stopPropagation(); 
            if (event.type === 'touchstart') {
                event.preventDefault(); 
            }
            dropdownItem.classList.toggle('active-dropdown');
        };

        dropdownBtn.addEventListener('click', toggleDropdown);
        dropdownBtn.addEventListener('touchstart', toggleDropdown);


        // --- 2. 點擊頁面其他地方時：關閉選單 ---
        const closeDropdown = (event) => {
             // 確保只有在非下拉菜單本身被點擊時才關閉
            if (!dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
        };
        document.addEventListener('click', closeDropdown);
        document.addEventListener('touchstart', closeDropdown);


        // --- 3. 子選單項目點擊時：阻止冒泡 ---
        dropdownItem.querySelectorAll('.submenu .nav-button').forEach(button => {
            button.addEventListener('click', (event) => {
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