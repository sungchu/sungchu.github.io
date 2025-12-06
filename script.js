function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const buttons = document.querySelectorAll('.nav-button');
  
  pages.forEach(page => page.classList.remove('active'));
  buttons.forEach(button => button.classList.remove('active'));
  
  document.getElementById(pageId).classList.add('active');
  
  // 找到對應的按鈕並加上 active 類別
  const targetButton = Array.from(buttons).find(btn => {
      // 根據按鈕文字判斷
      const text = btn.textContent.toLowerCase().trim();
      if (pageId === 'about' && text.includes('about')) return true;
      if (pageId === 'services' && text.includes('療癒服務')) return true;
      if (pageId === 'workshops' && text.includes('療癒工作坊')) return true;
      if (pageId === 'courses' && text.includes('催眠證照課程')) return true;
      if (pageId === 'booking' && text.includes('預約須知')) return true;
      if (pageId === 'testimonials' && text.includes('個案回饋')) return true;
      return false;
  });
  if (targetButton) {
    targetButton.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 啟動時確保初始狀態正確
document.addEventListener('DOMContentLoaded', () => {
    // 預設啟動 'about' 頁面並激活對應按鈕
    const initialPage = 'about';
    document.getElementById(initialPage).classList.add('active');
    const initialButton = document.querySelector('.nav-button');
    if (initialButton) {
      // 確保只有第一個按鈕在初始化時被激活（即 "ABOUT US"）
      initialButton.classList.add('active');
    }
});