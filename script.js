function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const buttons = document.querySelectorAll('.nav-button');
  
  // 1. 頁面和按鈕的激活/去激活邏輯 (保持不變)
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

  // 找到對應的按鈕並加上 active 類別 (保持不變)
  const targetButton = Array.from(buttons).find(btn => {
      const text = btn.textContent.toLowerCase().trim();
      // 這裡的判斷條件請確保與您的按鈕文字完全對應
      if (pageId === 'about' && text.includes('about')) return true;
      if (pageId === 'services' && text.includes('服務')) return true; // 簡化為包含關鍵字
      if (pageId === 'workshops' && text.includes('工作坊')) return true;
      if (pageId === 'courses' && text.includes('課程')) return true;
      if (pageId === 'booking' && text.includes('預約')) return true;
      if (pageId === 'testimonials' && text.includes('回饋')) return true;
      return false;
  });
  if (targetButton) {
    targetButton.classList.add('active');
  }
  
  // 2. ⚡ 關鍵改變：使用 History API 更新 URL 中的 Hash
  const newHash = '#' + pageId;
  // 只有當當前 Hash 與目標 Hash 不同時才 pushState
  if (window.location.hash !== newHash) {
      window.history.pushState({ page: pageId }, '', newHash);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 啟動時確保初始狀態正確
document.addEventListener('DOMContentLoaded', () => {
    let initialPage = 'about'; // 預設頁面

    // 1. 檢查 URL 中是否有 #hash
    if (window.location.hash) {
        // 取得 # 後面的內容，例如從 #services 得到 services
        const hashId = window.location.hash.substring(1); 
        
        // 確保 hashId 是您定義的有效頁面 ID 之一 (可選的驗證)
        const validPages = ['about', 'services', 'workshops', 'courses', 'booking', 'testimonials'];
        if (validPages.includes(hashId)) {
            initialPage = hashId;
        }
    }

    // 2. 呼叫 showPage 來初始化頁面和按鈕
    showPage(initialPage);
});


// 3. 監聽 URL Hash 改變事件 (處理瀏覽器的 上一頁/下一頁 按鈕)
// 當使用者點擊瀏覽器返回或前進鍵時，會觸發此事件。
window.addEventListener('hashchange', () => {
    let pageId = 'about'; // 預設頁面
    if (window.location.hash) {
        pageId = window.location.hash.substring(1);
    }
    
    // 重新呼叫 showPage，它會負責切換內容
    showPage(pageId);
});