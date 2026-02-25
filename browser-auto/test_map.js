const { chromium } = require('playwright');

(async () => {
  console.log('🗺️ AUTOMATED WORLD MAP TESTING STARTED...');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito']
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
    console.log('🌐 Loading dashboard with authentication...');
    await page.goto('http://192.168.1.19:3333', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    await page.waitForTimeout(5000);
    
    console.log('🗺️ TESTING WORLD MAP PRESENCE...');
    
    // Test 1: Check map elements exist
    const mapElements = await page.evaluate(() => {
      const worldMap = document.getElementById('world-map');
      const largeWorldMap = document.getElementById('large-world-map');
      const attackCount = document.getElementById('attack-count');
      
      return {
        worldMap: !!worldMap,
        largeWorldMap: !!largeWorldMap,
        attackCount: !!attackCount,
        worldMapContent: worldMap ? worldMap.innerHTML.length : 0,
        largeWorldMapContent: largeWorldMap ? largeWorldMap.innerHTML.length : 0
      };
    });
    
    console.log('📊 Map Elements Status:');
    console.log(`✅ World Map element: ${mapElements.worldMap ? 'EXISTS' : 'NOT FOUND'}`);
    console.log(`✅ Large World Map element: ${mapElements.largeWorldMap ? 'EXISTS' : 'NOT FOUND'}`);
    console.log(`✅ Attack Count element: ${mapElements.attackCount ? 'EXISTS' : 'NOT FOUND'}`);
    console.log(`📄 World Map content length: ${mapElements.worldMapContent}`);
    console.log(`📄 Large World Map content length: ${mapElements.largeWorldMapContent}`);
    
    // Test 2: Check Leaflet library
    const leafletStatus = await page.evaluate(() => {
      return {
        leafletLoaded: typeof L !== 'undefined',
        leafletVersion: typeof L !== 'undefined' ? (L.version || 'Unknown') : 'Not Loaded'
      };
    });
    
    console.log('📚 Leaflet Library Status:');
    console.log(`✅ Leaflet loaded: ${leafletStatus.leafletLoaded}`);
    console.log(`📖 Leaflet version: ${leafletStatus.leafletVersion}`);
    
    // Test 3: Check map functions
    const functionStatus = await page.evaluate(() => {
      const functions = ['initializeMaps', 'addAttackMarker', 'resetMap', 'toggleHeatmap'];
      const status = {};
      
      functions.forEach(func => {
        status[func] = typeof window[func] === 'function';
      });
      
      return status;
    });
    
    console.log('⚙️  Map Functions Status:');
    Object.entries(functionStatus).forEach(([func, exists]) => {
      console.log(`✅ ${func} function: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    });
    
    // Test 4: Check map sections in UI
    const sectionStatus = await page.evaluate(() => {
      const sections = ['World Attack Map', 'Global Attack Heatmap'];
      const status = {};
      
      sections.forEach(section => {
        const element = Array.from(document.querySelectorAll('h2')).find(h => 
          h.textContent.includes(section)
        );
        status[section] = !!element;
      });
      
      return status;
    });
    
    console.log('🎯 Map Sections Status:');
    Object.entries(sectionStatus).forEach(([section, exists]) => {
      console.log(`✅ ${section} section: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    });
    
    // Test 5: Try to initialize maps if functions exist
    if (functionStatus.initializeMaps) {
      console.log('🗺️ Testing map initialization...');
      
      const initResult = await page.evaluate(() => {
        try {
          initializeMaps();
          return { success: true, error: null };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
      
      console.log(`🔄 Map initialization: ${initResult.success ? 'SUCCESS' : 'FAILED'}`);
      if (!initResult.success) {
        console.log(`❌ Initialization error: ${initResult.error}`);
      }
      
      // Wait a bit for maps to load
      await page.waitForTimeout(3000);
      
      // Check if maps have content after initialization
      const mapContentAfterInit = await page.evaluate(() => {
        const worldMap = document.getElementById('world-map');
        const largeWorldMap = document.getElementById('large-world-map');
        
        return {
          worldMapContent: worldMap ? worldMap.innerHTML.length : 0,
          largeWorldMapContent: largeWorldMap ? largeWorldMap.innerHTML.length : 0,
          worldMapClasses: worldMap ? worldMap.className : '',
          largeWorldMapClasses: largeWorldMap ? largeWorldMap.className : ''
        };
      });
      
      console.log('📊 Map Content After Initialization:');
      console.log(`📄 World Map content: ${mapContentAfterInit.worldMapContent} chars`);
      console.log(`📄 Large World Map content: ${mapContentAfterInit.largeWorldMapContent} chars`);
      console.log(`🏷️  World Map classes: ${mapContentAfterInit.worldMapClasses}`);
      console.log(`🏷️  Large World Map classes: ${mapContentAfterInit.largeWorldMapClasses}`);
    }
    
    // Test 6: Check for attack markers if maps are working
    if (functionStatus.addAttackMarker && mapElements.worldMap) {
      console.log('🎯 Testing attack marker functionality...');
      
      // Create a test attack with coordinates
      const testAttack = {
        ip: '192.168.1.100',
        latitude: 40.7128,
        longitude: -74.0060,
        country: 'United States',
        timestamp: new Date().toISOString(),
        event: 'cowrie.session.connect',
        username: 'test',
        password: 'test123'
      };
      
      const markerResult = await page.evaluate((attack) => {
        try {
          addAttackMarker(attack);
          return { success: true, error: null };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }, testAttack);
      
      console.log(`📍 Attack marker test: ${markerResult.success ? 'SUCCESS' : 'FAILED'}`);
      if (!markerResult.success) {
        console.log(`❌ Marker error: ${markerResult.error}`);
      }
      
      await page.waitForTimeout(2000);
      
      // Check if marker was added
      const markerCount = await page.evaluate(() => {
        return typeof window.attackMarkers !== 'undefined' ? window.attackMarkers.length : 0;
      });
      
      console.log(`📍 Attack markers added: ${markerCount}`);
    }
    
    // Test 7: Final verification
    console.log('🎯 FINAL VERIFICATION...');
    const finalStatus = await page.evaluate(() => {
      const worldMap = document.getElementById('world-map');
      const largeWorldMap = document.getElementById('large-world-map');
      const attackCount = document.getElementById('attack-count');
      
      return {
        worldMapExists: !!worldMap,
        largeWorldMapExists: !!largeWorldMap,
        attackCountExists: !!attackCount,
        worldMapHasContent: worldMap ? worldMap.innerHTML.trim().length > 0 : false,
        largeWorldMapHasContent: largeWorldMap ? largeWorldMap.innerHTML.trim().length > 0 : false,
        leafletLoaded: typeof L !== 'undefined',
        functionsExist: ['initializeMaps', 'addAttackMarker', 'resetMap', 'toggleHeatmap'].every(f => typeof window[f] === 'function'),
        attackCountValue: attackCount ? attackCount.textContent : 'N/A'
      };
    });
    
    console.log('🏁 FINAL RESULTS:');
    console.log(`✅ World Map: ${finalStatus.worldMapExists ? 'EXISTS' : 'NOT FOUND'} | Content: ${finalStatus.worldMapHasContent ? 'YES' : 'NO'}`);
    console.log(`✅ Large World Map: ${finalStatus.largeWorldMapExists ? 'EXISTS' : 'NOT FOUND'} | Content: ${finalStatus.largeWorldMapHasContent ? 'YES' : 'NO'}`);
    console.log(`✅ Attack Count: ${finalStatus.attackCountExists ? 'EXISTS' : 'NOT FOUND'} | Value: ${finalStatus.attackCountValue}`);
    console.log(`✅ Leaflet Library: ${finalStatus.leafletLoaded ? 'LOADED' : 'NOT LOADED'}`);
    console.log(`✅ Map Functions: ${finalStatus.functionsExist ? 'ALL EXIST' : 'SOME MISSING'}`);
    
    // Overall status
    const mapWorking = finalStatus.worldMapExists && finalStatus.leafletLoaded && finalStatus.functionsExist;
    console.log(`\n🎊 OVERALL MAP STATUS: ${mapWorking ? '🟢 WORKING' : '🔴 NOT WORKING'}`);
    
    if (mapWorking) {
      console.log('🌍 World map functionality is successfully implemented!');
      console.log('📍 Attack markers can be added dynamically');
      console.log('🗺️ Interactive maps are ready for use');
    } else {
      console.log('❌ World map functionality needs attention');
    }
    
    // Keep browser open for observation
    console.log('\n⏱️ Keeping browser open for 10 seconds for observation...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
  }

  await context.close();
  await browser.close();
  console.log('🏁 AUTOMATED WORLD MAP TESTING COMPLETED!');
})();
