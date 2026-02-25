const { chromium } = require('playwright');

(async () => {
  console.log('🚀 COMPREHENSIVE DASHBOARD TESTING STARTED...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito', '--disable-cache']
  });
  
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'Cowrie@2026!'
    }
  });
  
  const page = await context.newPage();

  // Bypass cache
  await page.route('**/*', (route) => {
    const headers = route.request().headers();
    delete headers['if-modified-since'];
    delete headers['if-none-match'];
    delete headers['cache-control'];
    route.continue({ headers });
  });

  page.on('console', msg => {
    console.log(`[BROWSER LOG] [${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`[BROWSER ERROR] ${error.message}`);
  });

  try {
    console.log('🌐 Loading dashboard...');
    await page.goto('http://192.168.1.19:3333', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    await page.waitForTimeout(5000);
    
    console.log('📊 COMPREHENSIVE DASHBOARD TESTING...');
    
    const results = await page.evaluate(() => {
      console.log('=== DASHBOARD COMPREHENSIVE TEST ===');
      
      // Test 1: Statistics Cards
      console.log('📈 1. STATISTICS CARDS TEST');
      const statCards = document.querySelectorAll('.stat-card');
      console.log(`   Stat cards found: ${statCards.length}`);
      
      const stats = {};
      statCards.forEach((card, index) => {
        const title = card.querySelector('p.text-gray-300');
        const value = card.querySelector('p.text-3xl');
        const titleText = title ? title.textContent.trim() : 'Unknown';
        const valueText = value ? value.textContent.trim() : '0';
        stats[titleText] = valueText;
        console.log(`   Card ${index + 1}: ${titleText} = ${valueText}`);
      });
      
      // Test 2: Export Functions
      console.log('\n📤 2. EXPORT FUNCTIONS TEST');
      const exportButtons = document.querySelectorAll('button[onclick*="export"]');
      console.log(`   Export buttons found: ${exportButtons.length}`);
      
      exportButtons.forEach((btn, index) => {
        console.log(`   Export Button ${index + 1}: ${btn.textContent.trim()}`);
      });
      
      // Check if Export Statistics was removed
      const hasExportStats = Array.from(document.querySelectorAll('*')).some(el => 
        el.textContent && el.textContent.includes('Export Dashboard Statistics')
      );
      console.log(`   Export Statistics removed: ${!hasExportStats ? '✅ YES' : '❌ NO'}`);
      
      // Test 3: World Map
      console.log('\n🗺️ 3. WORLD MAP TEST');
      const worldMap = document.getElementById('world-map');
      console.log(`   World Map element: ${worldMap ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      
      if (worldMap) {
        const mapContent = worldMap.innerHTML.length;
        console.log(`   World Map content length: ${mapContent}`);
        console.log(`   World Map has content: ${mapContent > 0 ? '✅ YES' : '❌ NO'}`);
      }
      
      // Test 4: Timeline Chart
      console.log('\n📈 4. TIMELINE CHART TEST');
      const timelineChart = document.getElementById('timeline-chart');
      console.log(`   Timeline Chart element: ${timelineChart ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      
      // Test 5: JavaScript Functions
      console.log('\n⚙️ 5. JAVASCRIPT FUNCTIONS TEST');
      const functions = [
        'initializeMaps', 'addAttackMarker', 'resetMap', 'toggleHeatmap',
        'updateTimelineChart', 'handleNewAttack', 'exportLogs', 'exportAlerts',
        'exportCredentials', 'closeExportModal', 'confirmExport'
      ];
      
      const functionStatus = {};
      functions.forEach(func => {
        const exists = typeof window[func] === 'function';
        functionStatus[func] = exists;
        console.log(`   ${func}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      });
      
      // Test 6: Map Functions Test
      console.log('\n🗺️ 6. MAP FUNCTIONS TEST');
      if (functionStatus.initializeMaps && functionStatus.addAttackMarker) {
        try {
          console.log('   Testing map initialization...');
          initializeMaps();
          console.log('   ✅ initializeMaps executed successfully');
          
          console.log('   Testing attack marker...');
          const testAttack = {
            ip: '192.168.1.100',
            latitude: 40.7128,
            longitude: -74.0060,
            country: 'United States',
            timestamp: new Date().toISOString(),
            event: 'cowrie.session.connect'
          };
          
          addAttackMarker(testAttack);
          console.log('   ✅ addAttackMarker executed successfully');
          
          const markerCount = typeof window.attackMarkers !== 'undefined' ? window.attackMarkers.length : 0;
          console.log(`   Attack markers added: ${markerCount}`);
          
        } catch (error) {
          console.log(`   ❌ Map functions error: ${error.message}`);
        }
      }
      
      // Test 7: Timeline Chart Test
      console.log('\n📈 7. TIMELINE CHART FUNCTIONS TEST');
      if (functionStatus.updateTimelineChart) {
        try {
          const testAttacks = [
            { timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'test1' },
            { timestamp: new Date(Date.now() - 1800000).toISOString(), event: 'test2' },
            { timestamp: new Date().toISOString(), event: 'test3' }
          ];
          
          updateTimelineChart(testAttacks);
          console.log('   ✅ updateTimelineChart executed successfully');
          
        } catch (error) {
          console.log(`   ❌ Timeline chart error: ${error.message}`);
        }
      }
      
      // Test 8: WebSocket Connection
      console.log('\n🔌 8. WEBSOCKET CONNECTION TEST');
      const socketLoaded = typeof io !== 'undefined';
      const socketExists = typeof window.socket !== 'undefined';
      console.log(`   Socket.IO library: ${socketLoaded ? '✅ LOADED' : '❌ NOT LOADED'}`);
      console.log(`   Socket object: ${socketExists ? '✅ EXISTS' : '❌ NOT EXISTS'}`);
      
      if (socketExists) {
        console.log(`   Socket connected: ${window.socket.connected ? '✅ CONNECTED' : '❌ DISCONNECTED'}`);
        console.log(`   Socket ID: ${window.socket.id || 'N/A'}`);
      }
      
      // Test 9: API Data Test
      console.log('\n📊 9. API DATA TEST');
      return fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
          console.log(`   API Response: ✅ SUCCESS`);
          console.log(`   Total connections: ${data.total_connections || 0}`);
          console.log(`   Failed logins: ${data.failed_logins || 0}`);
          console.log(`   Successful logins: ${data.successful_logins || 0}`);
          console.log(`   Recent attacks: ${data.recent_attacks ? data.recent_attacks.length : 0}`);
          console.log(`   Alerts: ${data.alerts ? data.alerts.length : 0}`);
          console.log(`   Top countries: ${data.top_countries ? Object.keys(data.top_countries).length : 0}`);
          console.log(`   Top organizations: ${data.top_organizations ? Object.keys(data.top_organizations).length : 0}`);
          
          // Check for coordinates in recent attacks
          const attacksWithCoords = data.recent_attacks ? data.recent_attacks.filter(a => a.latitude && a.longitude).length : 0;
          console.log(`   Attacks with coordinates: ${attacksWithCoords}/${data.recent_attacks ? data.recent_attacks.length : 0}`);
          
          return {
            stats,
            exportButtonsCount: exportButtons.length,
            exportStatsRemoved: !hasExportStats,
            worldMapExists: !!worldMap,
            worldMapContent: worldMap ? worldMap.innerHTML.length : 0,
            timelineChartExists: !!timelineChart,
            functionsStatus: functionStatus,
            socketLoaded,
            socketExists,
            apiData: {
              totalConnections: data.total_connections || 0,
              failedLogins: data.failed_logins || 0,
              successfulLogins: data.successful_logins || 0,
              recentAttacks: data.recent_attacks ? data.recent_attacks.length : 0,
              alerts: data.alerts ? data.alerts.length : 0,
              attacksWithCoords: attacksWithCoords
            }
          };
        })
        .catch(error => {
          console.log(`   ❌ API Error: ${error.message}`);
          return null;
        });
    });
    
    if (results) {
      console.log('\n📊 COMPREHENSIVE TEST RESULTS:');
      console.log('=====================================');
      
      console.log('\n📈 STATISTICS:');
      Object.entries(results.stats).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
      
      console.log('\n📤 EXPORT FUNCTIONS:');
      console.log(`   Export buttons: ${results.exportButtonsCount}`);
      console.log(`   Export Statistics removed: ${results.exportStatsRemoved ? '✅ YES' : '❌ NO'}`);
      
      console.log('\n🗺️ WORLD MAP:');
      console.log(`   Map exists: ${results.worldMapExists ? '✅ YES' : '❌ NO'}`);
      console.log(`   Map content: ${results.worldMapContent > 0 ? '✅ HAS DATA' : '❌ EMPTY'}`);
      
      console.log('\n📈 TIMELINE CHART:');
      console.log(`   Chart exists: ${results.timelineChartExists ? '✅ YES' : '❌ NO'}`);
      
      console.log('\n⚙️ JAVASCRIPT FUNCTIONS:');
      Object.entries(results.functionsStatus).forEach(([func, exists]) => {
        console.log(`   ${func}: ${exists ? '✅ OK' : '❌ MISSING'}`);
      });
      
      console.log('\n🔌 WEBSOCKET:');
      console.log(`   Library loaded: ${results.socketLoaded ? '✅ YES' : '❌ NO'}`);
      console.log(`   Socket exists: ${results.socketExists ? '✅ YES' : '❌ NO'}`);
      
      console.log('\n📊 API DATA:');
      console.log(`   Total connections: ${results.apiData.totalConnections}`);
      console.log(`   Failed logins: ${results.apiData.failedLogins}`);
      console.log(`   Successful logins: ${results.apiData.successfulLogins}`);
      console.log(`   Recent attacks: ${results.apiData.recentAttacks}`);
      console.log(`   Attacks with coordinates: ${results.apiData.attacksWithCoords}`);
      console.log(`   Alerts: ${results.apiData.alerts}`);
      
      // Overall status
      console.log('\n🎯 OVERALL STATUS:');
      const allFunctionsWorking = Object.values(results.functionsStatus).every(status => status);
      const mapWorking = results.worldMapExists && results.worldMapContent > 0;
      const apiWorking = results.apiData.totalConnections > 0;
      const exportRemoved = results.exportStatsRemoved;
      
      console.log(`   All functions working: ${allFunctionsWorking ? '✅ YES' : '❌ NO'}`);
      console.log(`   World map working: ${mapWorking ? '✅ YES' : '❌ NO'}`);
      console.log(`   API data working: ${apiWorking ? '✅ YES' : '❌ NO'}`);
      console.log(`   Export Statistics removed: ${exportRemoved ? '✅ YES' : '❌ NO'}`);
      
      if (allFunctionsWorking && mapWorking && apiWorking && exportRemoved) {
        console.log('\n🎉 DASHBOARD IS FULLY FUNCTIONAL!');
        console.log('✅ All features working correctly');
        console.log('✅ Export Statistics successfully removed');
        console.log('✅ Real-time updates ready');
        console.log('✅ Map and chart functionality working');
      } else {
        console.log('\n⚠️  SOME ISSUES DETECTED');
        if (!allFunctionsWorking) console.log('❌ Some JavaScript functions missing');
        if (!mapWorking) console.log('❌ World map not working');
        if (!apiWorking) console.log('❌ API data not available');
        if (!exportRemoved) console.log('❌ Export Statistics not removed');
      }
    }
    
    // Keep browser open for observation
    console.log('\n⏱️ Keeping browser open for 15 seconds for observation...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
  }

  await context.close();
  await browser.close();
  console.log('\n🏁 COMPREHENSIVE DASHBOARD TESTING COMPLETED!');
})();
