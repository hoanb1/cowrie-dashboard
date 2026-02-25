const { chromium } = require('playwright');

(async () => {
  console.log('🔄 AUTOMATED RE-TESTING STARTED...');
  
  // Chạy trình duyệt với context mới để tránh cache
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache'
    ]
  });
  
  // Tạo context với authentication và bypass cache
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'Cowrie@2026!'
    },
    ignoreHTTPSErrors: true,
  });
  
  const page = await context.newPage();

  // Bypass cache cho tất cả requests
  await page.route('**/*', (route) => {
    const headers = route.request().headers();
    delete headers['if-modified-since'];
    delete headers['if-none-match'];
    delete headers['cache-control'];
    route.continue({ headers });
  });

  // Đăng ký sự kiện lắng nghe console log
  page.on('console', msg => {
    console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`[BROWSER ERROR] ${error.message}`);
  });

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
    console.log('🌐 Navigating to dashboard with cache bypass...');
    
    // Đi tới trang web với cache bypass
    await page.goto('http://192.168.1.19:3333', {
      waitUntil: 'networkidle',
      timeout: 10000
    });
    
    // Chờ thêm để đảm bảo tải hoàn toàn
    await page.waitForTimeout(5000);
    
    console.log('📊 TESTING DASHBOARD ELEMENTS...');
    
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
      
      if (countriesContent.includes('No countries data available')) {
        console.log('✅ Top Countries null handling: WORKING');
      } else if (countriesContent.trim().length > 0) {
        console.log('✅ Top Countries has data: WORKING');
      } else {
        console.log('❌ Top Countries: EMPTY');
      }
    }
    
    if (topOrganizations > 0) {
      const organizationsContent = await page.locator('#top-organizations').innerHTML();
      console.log(`🏢 Top Organizations content length: ${organizationsContent.length} chars`);
      console.log(`🏢 Top Organizations has content: ${organizationsContent.trim().length > 0 ? 'YES' : 'NO'}`);
      
      if (organizationsContent.includes('No organizations data available')) {
        console.log('✅ Top Organizations null handling: WORKING');
      } else if (organizationsContent.trim().length > 0) {
        console.log('✅ Top Organizations has data: WORKING');
      } else {
        console.log('❌ Top Organizations: EMPTY');
      }
    }
    
    console.log('🖱️ TESTING EXPORT BUTTONS...');
    
    // Test export buttons
    const exportButtons = [
      { name: 'Export Dashboard Statistics', selector: 'button:has-text("Export Dashboard Statistics")' },
      { name: 'Export Logs', selector: 'button:has-text("Export Logs")' },
      { name: 'Export Alerts', selector: 'button:has-text("Export Alerts")' }
    ];
    
    for (const button of exportButtons) {
      try {
        await page.locator(button.selector).click({ timeout: 3000 });
        console.log(`✅ ${button.name} button: CLICKED`);
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`❌ ${button.name} button: NOT FOUND - ${e.message}`);
      }
    }
    
    console.log('🔍 TESTING JAVASCRIPT FUNCTIONS...');
    
    // Test JavaScript functions directly
    await page.evaluate(() => {
      console.log('🧪 Testing JavaScript functions...');
      
      // Test updateTopCountries with null
      try {
        updateTopCountries(null);
        console.log('✅ updateTopCountries(null): HANDLED CORRECTLY');
      } catch (e) {
        console.log(`❌ updateTopCountries(null): ERROR - ${e.message}`);
      }
      
      // Test updateTopCountries with empty object
      try {
        updateTopCountries({});
        console.log('✅ updateTopCountries({}): HANDLED CORRECTLY');
      } catch (e) {
        console.log(`❌ updateTopCountries({}): ERROR - ${e.message}`);
      }
      
      // Test updateTopOrganizations with null
      try {
        updateTopOrganizations(null);
        console.log('✅ updateTopOrganizations(null): HANDLED CORRECTLY');
      } catch (e) {
        console.log(`❌ updateTopOrganizations(null): ERROR - ${e.message}`);
      }
      
      // Test updateTopOrganizations with empty object
      try {
        updateTopOrganizations({});
        console.log('✅ updateTopOrganizations({}): HANDLED CORRECTLY');
      } catch (e) {
        console.log(`❌ updateTopOrganizations({}): ERROR - ${e.message}`);
      }
      
      // Check WebSocket
      if (typeof window.io !== 'undefined') {
        console.log('✅ Socket.IO library: LOADED');
        if (window.socket) {
          console.log('✅ WebSocket connection: ESTABLISHED');
        } else {
          console.log('⚠️ WebSocket connection: NOT CONNECTED');
        }
      } else {
        console.log('❌ Socket.IO library: NOT LOADED');
      }
      
      // Check stats elements
      const totalConnections = document.getElementById('total-connections');
      const failedLogins = document.getElementById('failed-logins');
      const successfulLogins = document.getElementById('successful-logins');
      
      console.log(`📊 Stats Elements - Total Connections: ${totalConnections ? totalConnections.textContent : 'NOT FOUND'}`);
      console.log(`📊 Stats Elements - Failed Logins: ${failedLogins ? failedLogins.textContent : 'NOT FOUND'}`);
      console.log(`📊 Stats Elements - Successful Logins: ${successfulLogins ? successfulLogins.textContent : 'NOT FOUND'}`);
    });
    
    console.log('🔄 TESTING REAL-TIME UPDATES...');
    
    // Test real-time data loading
    await page.evaluate(async () => {
      try {
        console.log('🔄 Testing real-time data refresh...');
        await loadInitialData();
        console.log('✅ loadInitialData(): COMPLETED');
      } catch (e) {
        console.log(`❌ loadInitialData(): ERROR - ${e.message}`);
      }
    });
    
    await page.waitForTimeout(3000);
    
    // Check if data loaded after refresh
    const countriesContentAfter = await page.locator('#top-countries').innerHTML();
    const organizationsContentAfter = await page.locator('#top-organizations').innerHTML();
    
    console.log(`📊 AFTER REFRESH - Countries content: ${countriesContentAfter.length > 0 ? 'HAS DATA' : 'EMPTY'}`);
    console.log(`📊 AFTER REFRESH - Organizations content: ${organizationsContentAfter.length > 0 ? 'HAS DATA' : 'EMPTY'}`);
    
    console.log('🎯 FINAL VERIFICATION...');
    
    // Final verification
    const finalResults = await page.evaluate(() => {
      const countriesElement = document.getElementById('top-countries');
      const organizationsElement = document.getElementById('top-organizations');
      
      return {
        countriesExists: !!countriesElement,
        organizationsExists: !!organizationsElement,
        countriesHasContent: countriesElement ? countriesElement.innerHTML.trim().length > 0 : false,
        organizationsHasContent: organizationsElement ? organizationsElement.innerHTML.trim().length > 0 : false,
        countriesHTML: countriesElement ? countriesElement.innerHTML.substring(0, 100) : '',
        organizationsHTML: organizationsElement ? organizationsElement.innerHTML.substring(0, 100) : ''
      };
    });
    
    console.log('🏁 FINAL RESULTS:');
    console.log(`✅ Countries Element Exists: ${finalResults.countriesExists}`);
    console.log(`✅ Organizations Element Exists: ${finalResults.organizationsExists}`);
    console.log(`✅ Countries Has Content: ${finalResults.countriesHasContent}`);
    console.log(`✅ Organizations Has Content: ${finalResults.organizationsHasContent}`);
    
    if (finalResults.countriesHTML) {
      console.log(`🌍 Countries Sample: ${finalResults.countriesHTML}`);
    }
    
    if (finalResults.organizationsHTML) {
      console.log(`🏢 Organizations Sample: ${finalResults.organizationsHTML}`);
    }
    
    // Giữ trình duyệt mở để quan sát
    console.log('⏱️ Keeping browser open for 10 seconds for final observation...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
  }

  await context.close();
  await browser.close();
  console.log('🏁 AUTOMATED RE-TESTING COMPLETED!');
})();
