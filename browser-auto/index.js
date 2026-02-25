const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting Playwright automated browser testing...');
  
  // Chạy trình duyệt với authentication context ngay từ đầu
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Tạo context với authentication
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'Cowrie@2026!'
    }
  });
  
  const page = await context.newPage();

  // Đăng ký sự kiện lắng nghe console log
  page.on('console', msg => {
    console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
  });

  // Đăng ký sự kiện lỗi
  page.on('pageerror', error => {
    console.log(`[BROWSER ERROR] ${error.message}`);
  });

  // Đăng ký sự kiện request/response
  page.on('request', request => {
    if (request.url().includes('/api/export') || request.url().includes('/api/stats')) {
      console.log(`[API REQUEST] ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/export') || response.url().includes('/api/stats')) {
      console.log(`[API RESPONSE] ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('🌐 Navigating to dashboard with authentication...');
    // Đi tới trang web với authentication
    await page.goto('http://192.168.1.19:3333');
    
    // Chờ trang tải hoàn toàn
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('� Testing dashboard elements...');
    
    // Kiểm tra Top Countries section
    const topCountries = await page.locator('#top-countries').count();
    console.log(`🌍 Top Countries section found: ${topCountries > 0 ? 'YES' : 'NO'}`);
    
    // Kiểm tra Top Organizations section
    const topOrganizations = await page.locator('#top-organizations').count();
    console.log(`🏢 Top Organizations section found: ${topOrganizations > 0 ? 'YES' : 'NO'}`);
    
    // Lấy nội dung của các section
    if (topCountries > 0) {
      const countriesContent = await page.locator('#top-countries').innerHTML();
      console.log(`🌍 Top Countries content length: ${countriesContent.length} chars`);
      console.log(`🌍 Top Countries has content: ${countriesContent.trim().length > 0 ? 'YES' : 'NO'}`);
    }
    
    if (topOrganizations > 0) {
      const organizationsContent = await page.locator('#top-organizations').innerHTML();
      console.log(`🏢 Top Organizations content length: ${organizationsContent.length} chars`);
      console.log(`🏢 Top Organizations has content: ${organizationsContent.trim().length > 0 ? 'YES' : 'NO'}`);
    }
    
    // Thực hiện một số tương tác tự động
    console.log('🖱️ Simulating user interactions...');
    
    // Click vào nút Export Statistics
    try {
      await page.locator('button:has-text("Export Dashboard Statistics")').click();
      console.log('✅ Export Statistics button clicked');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('❌ Export Statistics button not found or not clickable:', e.message);
    }
    
    // Click vào nút Export Logs
    try {
      await page.locator('button:has-text("Export Logs")').click();
      console.log('✅ Export Logs button clicked');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('❌ Export Logs button not found or not clickable:', e.message);
    }
    
    // Click vào nút Export Alerts
    try {
      await page.locator('button:has-text("Export Alerts")').click();
      console.log('✅ Export Alerts button clicked');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('❌ Export Alerts button not found or not clickable:', e.message);
    }
    
    // Chạy script trong console để kiểm tra dữ liệu
    await page.evaluate(() => {
      console.log('🔍 Checking dashboard data...');
      
      // Kiểm tra các element có tồn tại không
      const countriesElement = document.getElementById('top-countries');
      const organizationsElement = document.getElementById('top-organizations');
      
      console.log(`Top Countries element: ${countriesElement ? 'EXISTS' : 'NOT FOUND'}`);
      console.log(`Top Organizations element: ${organizationsElement ? 'EXISTS' : 'NOT FOUND'}`);
      
      if (countriesElement) {
        const countriesHTML = countriesElement.innerHTML;
        console.log(`Top Countries content length: ${countriesHTML.length}`);
        console.log(`Top Countries has content: ${countriesHTML.trim().length > 0 ? 'YES' : 'EMPTY'}`);
        
        if (countriesHTML.trim().length > 0) {
          console.log(`Top Countries sample: ${countriesHTML.substring(0, 100)}...`);
        }
      }
      
      if (organizationsElement) {
        const organizationsHTML = organizationsElement.innerHTML;
        console.log(`Top Organizations content length: ${organizationsHTML.length}`);
        console.log(`Top Organizations has content: ${organizationsHTML.trim().length > 0 ? 'YES' : 'EMPTY'}`);
        
        if (organizationsHTML.trim().length > 0) {
          console.log(`Top Organizations sample: ${organizationsHTML.substring(0, 100)}...`);
        }
      }
      
      // Kiểm tra WebSocket connection
      if (typeof window.io !== 'undefined') {
        console.log('Socket.IO library: LOADED');
        if (window.socket) {
          console.log('WebSocket connection: ESTABLISHED');
        } else {
          console.log('WebSocket connection: NOT CONNECTED');
        }
      } else {
        console.log('Socket.IO library: NOT LOADED');
      }
      
      // Kiểm tra các stats elements
      const totalConnections = document.getElementById('total-connections');
      const failedLogins = document.getElementById('failed-logins');
      const successfulLogins = document.getElementById('successful-logins');
      
      console.log(`Total Connections element: ${totalConnections ? 'EXISTS' : 'NOT FOUND'}`);
      console.log(`Failed Logins element: ${failedLogins ? 'EXISTS' : 'NOT FOUND'}`);
      console.log(`Successful Logins element: ${successfulLogins ? 'EXISTS' : 'NOT FOUND'}`);
      
      if (totalConnections) {
        console.log(`Total Connections value: ${totalConnections.textContent}`);
      }
      if (failedLogins) {
        console.log(`Failed Logins value: ${failedLogins.textContent}`);
      }
      if (successfulLogins) {
        console.log(`Successful Logins value: ${successfulLogins.textContent}`);
      }
      
      // Tạo một số log để test
      console.log('🎯 Automated browser test completed successfully!');
      console.error('This is a test error message');
      console.warn('This is a test warning message');
    });

    // Giữ trình duyệt mở trong 15 giây để quan sát
    console.log('⏱️ Keeping browser open for 15 seconds for observation...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
  }

  await context.close();
  await browser.close();
  console.log('🏁 Playwright testing completed!');
})();
