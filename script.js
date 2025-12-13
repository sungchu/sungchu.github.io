function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    const buttons = document.querySelectorAll('.nav-button');
    
    // ... (showPage 內容保持不變，只負責切換頁面和按鈕 active 狀態)
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
    
    // 【重要】：子項目點擊後，強制關閉選單，解決手機上不收回的問題
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
        
        // 【核心修正】：同時監聽 'click' 和 'touchstart'，確保行動裝置響應
        const toggleDropdown = (event) => {
            event.stopPropagation(); 
            // 只有當事件類型為 touchstart 時，才阻止瀏覽器默認的 click 行為，避免雙重觸發
            if (event.type === 'touchstart') {
                event.preventDefault(); 
            }
            
            // 每次點擊/觸控都切換狀態
            dropdownItem.classList.toggle('active-dropdown');
        };

        dropdownBtn.addEventListener('click', toggleDropdown);
        dropdownBtn.addEventListener('touchstart', toggleDropdown);


        // --- 2. 點擊頁面其他地方時：關閉選單 ---
        document.addEventListener('click', (event) => {
            if (!dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
        });
        document.addEventListener('touchstart', (event) => {
             // 如果點擊目標不在下拉容器內，則移除 active-dropdown
             if (!dropdownItem.contains(event.target)) {
                dropdownItem.classList.remove('active-dropdown');
            }
        });

        // --- 3. 子選單項目點擊時：阻止冒泡，確保不會誤觸主按鈕的 toggle ---
        dropdownItem.querySelectorAll('.submenu .nav-button').forEach(button => {
            // 只需阻止點擊事件冒泡，因為 showPage 處理了頁面切換和選單收回
            button.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        });
    }

    // 初始化頁面 (保持不變)
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