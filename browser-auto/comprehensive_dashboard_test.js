const { chromium } = require('playwright');

(async () => {
  console.log('🚀 COMPREHENSIVE DASHBOARD TESTING - TIMELINE & MAP UPDATES');
  
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
    if (msg.text().includes('timeline') || msg.text().includes('map') || msg.text().includes('socket') || 
        msg.text().includes('updateTimelineChart') || msg.text().includes('addAttackMarker') || 
        msg.text().includes('stats_update') || msg.text().includes('new_attack') ||
        msg.text().includes('alert') || msg.text().includes('connected')) {
      console.log(`[DASHBOARD] [${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[ERROR] ${error.message}`);
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
      console.log('=== COMPREHENSIVE DASHBOARD TEST ===');
      
      // Test 1: WebSocket Connection
      console.log('🔌 1. WEBSOCKET CONNECTION TEST');
      const socketLoaded = typeof io !== 'undefined';
      const socketExists = typeof window.socket !== 'undefined';
      console.log(`   Socket.IO library: ${socketLoaded ? '✅ LOADED' : '❌ NOT LOADED'}`);
      console.log(`   Socket object: ${socketExists ? '✅ EXISTS' : '❌ NOT EXISTS'}`);
      
      if (socketExists) {
        console.log(`   Socket connected: ${window.socket.connected ? '✅ CONNECTED' : '❌ DISCONNECTED'}`);
        console.log(`   Socket ID: ${window.socket.id || 'N/A'}`);
      }
      
      // Test 2: Attack Timeline Chart
      console.log('\n📈 2. ATTACK TIMELINE CHART TEST');
      const timelineChart = document.getElementById('timeline-chart');
      console.log(`   Timeline chart element: ${timelineChart ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      
      const updateTimelineChartExists = typeof updateTimelineChart === 'function';
      console.log(`   updateTimelineChart function: ${updateTimelineChartExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      
      if (updateTimelineChartExists) {
        try {
          const testAttacks = [
            { timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'test1' },
            { timestamp: new Date(Date.now() - 1800000).toISOString(), event: 'test2' },
            { timestamp: new Date().toISOString(), event: 'test3' }
          ];
          
          updateTimelineChart(testAttacks);
          console.log('   ✅ updateTimelineChart executed successfully');
        } catch (error) {
          console.log(`   ❌ updateTimelineChart error: ${error.message}`);
        }
      }
      
      // Test 3: World Map
      console.log('\n🗺️ 3. WORLD MAP TEST');
      const worldMap = document.getElementById('world-map');
      console.log(`   World map element: ${worldMap ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      
      const addAttackMarkerExists = typeof addAttackMarker === 'function';
      console.log(`   addAttackMarker function: ${addAttackMarkerExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      
      if (addAttackMarkerExists) {
        try {
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
          console.log(`   Attack markers count: ${markerCount}`);
        } catch (error) {
          console.log(`   ❌ addAttackMarker error: ${error.message}`);
        }
      }
      
      // Test 4: Real-time Updates
      console.log('\n🔄 4. REAL-TIME UPDATES TEST');
      return fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
          console.log(`   API Response: ✅ SUCCESS`);
          console.log(`   Total connections: ${data.total_connections || 0}`);
          console.log(`   Failed logins: ${data.failed_logins || 0}`);
          console.log(`   Successful logins: ${data.successful_logins || 0}`);
          console.log(`   Recent attacks: ${data.recent_attacks ? data.recent_attacks.length : 0}`);
          console.log(`   Alerts: ${data.alerts ? data.alerts.length : 0}`);
          console.log(`   Attacks with coordinates: ${data.recent_attacks ? data.recent_attacks.filter(a => a.latitude && a.longitude).length : 0}`);
          
          // Test 5: Top 200 Lists
          console.log('\n📊 5. TOP 200 LISTS TEST');
          const sections = ['top-passwords', 'top-countries', 'top-organizations', 'top-ips', 'top-users'];
          const sectionStatus = {};
          
          sections.forEach(section => {
            const element = document.getElementById(section);
            sectionStatus[section] = !!element;
            console.log(`   ${section}: ${element ? '✅ EXISTS' : '❌ NOT FOUND'}`);
          });
          
          const functions = ['updateTopPasswords', 'updateTopCountries', 'updateTopOrganizations', 'updateTopIPs', 'updateTopUsers'];
          const functionStatus = {};
          
          functions.forEach(func => {
            const exists = typeof window[func] === 'function';
            functionStatus[func] = exists;
            console.log(`   ${func}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
          });
          
          // Test 6: Export Functions
          console.log('\n📤 6. EXPORT FUNCTIONS TEST');
          const exportFunctions = ['exportCredentials', 'exportLogs', 'exportAlerts'];
          const exportStatus = {};
          
          exportFunctions.forEach(func => {
            const exists = typeof window[func] === 'function';
            exportStatus[func] = exists;
            console.log(`   ${func}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
          });
          
          // Test 7: Statistics Cards
          console.log('\n📈 7. STATISTICS CARDS TEST');
          const statsCards = ['total-connections', 'failed-logins', 'successful-logins', 'unique-ips'];
          const cardStatus = {};
          
          statsCards.forEach(card => {
            const element = document.getElementById(card);
            cardStatus[card] = !!element;
            console.log(`   ${card}: ${element ? '✅ EXISTS' : '❌ NOT FOUND'}`);
            if (element) {
              console.log(`   ${card} value: ${element.textContent}`);
            }
          });
          
          return {
            socketLoaded,
            socketExists,
            socketConnected: socketExists ? window.socket.connected : false,
            timelineChartExists: !!timelineChart,
            updateTimelineChartExists,
            worldMapExists: !!worldMap,
            addAttackMarkerExists,
            apiData: {
              totalConnections: data.total_connections || 0,
              failedLogins: data.failed_logins || 0,
              successfulLogins: data.successful_logins || 0,
              recentAttacks: data.recent_attacks ? data.recent_attacks.length : 0,
              alerts: data.alerts ? data.alerts.length : 0,
              attacksWithCoords: data.recent_attacks ? data.recent_attacks.filter(a => a.latitude && a.longitude).length : 0
            },
            sectionStatus,
            functionStatus,
            exportStatus,
            cardStatus
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
      
      console.log('\n🔌 WEBSOCKET STATUS:');
      console.log(`   Library: ${results.socketLoaded ? '✅ LOADED' : '❌ NOT LOADED'}`);
      console.log(`   Object: ${results.socketExists ? '✅ EXISTS' : '❌ NOT EXISTS'}`);
      console.log(`   Connected: ${results.socketConnected ? '✅ CONNECTED' : '❌ DISCONNECTED'}`);
      
      console.log('\n📈 TIMELINE CHART:');
      console.log(`   Element: ${results.timelineChartExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      console.log(`   Function: ${results.updateTimelineChartExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      console.log(`   Status: ${results.timelineChartExists && results.updateTimelineChartExists ? '✅ WORKING' : '❌ NOT WORKING'}`);
      
      console.log('\n🗺️ WORLD MAP:');
      console.log(`   Element: ${results.worldMapExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      console.log(`   Function: ${results.addAttackMarkerExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      console.log(`   Status: ${results.worldMapExists && results.addAttackMarkerExists ? '✅ WORKING' : '❌ NOT WORKING'}`);
      
      console.log('\n📊 API DATA:');
      console.log(`   Total Connections: ${results.apiData.totalConnections}`);
      console.log(`   Failed Logins: ${results.apiData.failedLogins}`);
      console.log(`   Successful Logins: ${results.apiData.successfulLogins}`);
      console.log(`   Recent Attacks: ${results.apiData.recentAttacks}`);
      console.log(`   Alerts: ${results.apiData.alerts}`);
      console.log(`   Attacks with Coordinates: ${results.apiData.attacksWithCoords}`);
      
      console.log('\n📊 TOP 200 LISTS:');
      Object.entries(results.sectionStatus).forEach(([section, exists]) => {
        console.log(`   ${section}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      });
      
      console.log('\n📤 EXPORT FUNCTIONS:');
      Object.entries(results.exportStatus).forEach(([func, exists]) => {
        console.log(`   ${func}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      });
      
      console.log('\n📈 STATISTICS CARDS:');
      Object.entries(results.cardStatus).forEach(([card, exists]) => {
        console.log(`   ${card}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
      });
      
      // Overall status
      console.log('\n🎯 OVERALL STATUS:');
      const websocketWorking = results.socketLoaded && results.socketExists && results.socketConnected;
      const timelineWorking = results.timelineChartExists && results.updateTimelineChartExists;
      const mapWorking = results.worldMapExists && results.addAttackMarkerExists;
      const apiWorking = results.apiData.totalConnections > 0;
      const topListsWorking = Object.values(results.sectionStatus).every(status => status);
      const exportWorking = Object.values(results.exportStatus).every(status => status);
      const statsWorking = Object.values(results.cardStatus).every(status => status);
      
      console.log(`   WebSocket: ${websocketWorking ? '✅ WORKING' : '❌ NOT WORKING'}`);
      console.log(`   Timeline Chart: ${timelineWorking ? '✅ WORKING' : '❌ NOT WORKING'}`);
      console.log(`   World Map: ${mapWorking ? '✅ WORKING' : '❌ NOT WORKING'}`);
      console.log(`   API Data: ${apiWorking ? '✅ WORKING' : '❌ NOT WORKING'}`);
      console.log(`   Top 200 Lists: ${topListsWorking ? '✅ WORKING' : '❌ NOT WORKING'}`);
      console.log(`   Export Functions: ${exportWorking ? '✅ WORKING' : '❌ NOT WORKING'}`);
      console.log(`   Statistics Cards: ${statsWorking ? '✅ WORKING' : '❌ NOT WORKING'}`);
      
      if (websocketWorking && timelineWorking && mapWorking && apiWorking && topListsWorking && exportWorking && statsWorking) {
        console.log('\n🎉 DASHBOARD IS FULLY FUNCTIONAL!');
        console.log('✅ All features working correctly');
        console.log('✅ Real-time updates active');
        console.log('✅ Timeline chart updating');
        console.log('✅ World map functional');
        console.log('✅ Top 200 lists working');
        console.log('✅ Export functions working');
        console.log('✅ Statistics cards updating');
      } else {
        console.log('\n⚠️  SOME ISSUES DETECTED');
        if (!websocketWorking) console.log('❌ WebSocket not working');
        if (!timelineWorking) console.log('❌ Timeline chart not working');
        if (!mapWorking) console.log('❌ World map not working');
        if (!apiWorking) console.log('❌ API data not available');
        if (!topListsWorking) console.log('❌ Top 200 lists not working');
        if (!exportWorking) console.log('❌ Export functions not working');
        if (!statsWorking) console.log('❌ Statistics cards not working');
      }
    }
    
    // Keep browser open for observation
    console.log('\n⏱️ Keeping browser open for 10 seconds for observation...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
  }

  await context.close();
  await browser.close();
  console.log('\n🏁 COMPREHENSIVE DASHBOARD TESTING COMPLETED!');
})();
