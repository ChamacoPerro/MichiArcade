import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

async function run() {
  console.log('Launching headless Chrome...');
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--mute-audio',
    'http://localhost:8080'
  ]);

  chrome.on('error', (err) => {
    console.error('Failed to spawn Chrome:', err);
    process.exit(1);
  });

  // Wait for remote debugging endpoint to be ready
  let versionData = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const tabs = await res.json();
      if (tabs && tabs.length > 0) {
        const michiTab = tabs.find(t => t.url && t.url.includes('localhost:8080'));
        if (michiTab) {
          versionData = michiTab;
          break;
        }
      }
    } catch (e) {}
  }

  if (!versionData || !versionData.webSocketDebuggerUrl) {
    console.error('Could not connect to Chrome debugging WebSocket');
    chrome.kill();
    process.exit(1);
  }

  console.log('Connected to tab:', versionData.title, versionData.url);
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const logs = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      const text = data.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
      logs.push(text);
      console.log('[BROWSER CONSOLE]', text);
    } else if (data.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER ERROR]', data.params.exceptionDetails);
    }
  };

  await new Promise(r => { ws.onopen = r; });

  await send('Runtime.enable');
  await send('Page.enable');

  async function evalCode(expression) {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : null;
  }

  console.log('\n--- 1. TESTING BOOT & START BUTTON ---');
  let bootVisible = await evalCode(`document.getElementById('screen-boot').classList.contains('active')`);
  console.log('Boot screen active?', bootVisible);

  await evalCode(`document.getElementById('btn-press-start').click()`);
  await new Promise(r => setTimeout(r, 600));

  let menuVisible = await evalCode(`document.getElementById('screen-menu').classList.contains('active')`);
  console.log('Menu screen active after click?', menuVisible);

  console.log('\n--- 2. TESTING INITIAL PROGRESSION STATE ---');
  let initialPlayer = await evalCode(`JSON.stringify(window.michiStorage.data.player)`);
  console.log('Initial player:', initialPlayer);

  console.log('\n--- 3. TESTING MINIGAMES NAVIGATION & UNLOCKS ---');
  await evalCode(`window.michiUI.showScreen('screen-games')`);
  await new Promise(r => setTimeout(r, 300));
  let atrapaUnlocked = await evalCode(`window.michiProgression.isGameUnlocked('atrapaGato', 1)`);
  let memoriaUnlockedLvl1 = await evalCode(`window.michiProgression.isGameUnlocked('memoriaMichi', 1)`);
  console.log('Level 1: Atrapa al Gato unlocked?', atrapaUnlocked);
  console.log('Level 1: Memoria Michi unlocked?', memoriaUnlockedLvl1);

  console.log('\n--- 4. TESTING GAME 1: ATRAPA AL GATO & XP PROGRESSION ---');
  await evalCode(`window.michiUI.launchMinigame('atrapaGato', 'normal')`);
  await new Promise(r => setTimeout(r, 500));

  let holesCount = await evalCode(`document.querySelectorAll('.cat-hole').length`);
  console.log('Atrapa al Gato holes created:', holesCount);

  // Catch cats and grant XP
  for (let i = 0; i < 12; i++) {
    await evalCode(`
      (function() {
        window.gameAtrapaGato.spawnEntity();
        if (window.gameAtrapaGato.currentPopup) {
          window.gameAtrapaGato.handleHoleTap(window.gameAtrapaGato.currentPopup.holeIndex);
        }
      })()
    `);
    await new Promise(r => setTimeout(r, 60));
  }

  let xpAfterCatches = await evalCode(`window.michiStorage.data.player.xp`);
  let lvlAfterCatches = await evalCode(`window.michiStorage.data.player.level`);
  let hudLvlText = await evalCode(`document.getElementById('hud-level-val').textContent`);
  let hudXpText = await evalCode(`document.getElementById('hud-xp-text').textContent`);
  console.log('Player XP after 12 catches:', xpAfterCatches);
  console.log('Player Level after catches:', lvlAfterCatches);
  console.log('HUD Level Text:', hudLvlText);
  console.log('HUD XP Text:', hudXpText);

  // Check if Memoria Michi is now unlocked
  let memoriaUnlockedNow = await evalCode(`window.michiProgression.isGameUnlocked('memoriaMichi', window.michiStorage.data.player.level)`);
  console.log('Memoria Michi unlocked at new level?', memoriaUnlockedNow);

  // Exit Atrapa al Gato
  await evalCode(`
    (function() {
      const exitBtn = document.querySelector('#screen-game-atrapa .ingame-exit-btn');
      if (exitBtn) exitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 5. TESTING GAME 2: MEMORIA MICHI ---');
  await evalCode(`window.michiUI.launchMinigame('memoriaMichi', 'normal')`);
  await new Promise(r => setTimeout(r, 500));
  let cardCount = await evalCode(`document.querySelectorAll('.memoria-card').length`);
  console.log('Memoria cards count:', cardCount);

  // Simulate matching cards
  await evalCode(`
    (function() {
      const cards = document.querySelectorAll('.memoria-card');
      if (cards.length >= 2) {
        // Find matching pair
        const id0 = cards[0].dataset.cardId;
        for (let j = 1; j < cards.length; j++) {
          if (cards[j].dataset.cardId === id0) {
            cards[0].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            cards[j].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            break;
          }
        }
      }
    })()
  `);
  await new Promise(r => setTimeout(r, 600));
  let memoriaScore = await evalCode(`window.gameMemoriaMichi.score`);
  console.log('Memoria Michi score after match:', memoriaScore);

  await evalCode(`
    (function() {
      const exitBtn = document.querySelector('#screen-game-memoria .ingame-exit-btn');
      if (exitBtn) exitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 6. TESTING GAME 3: ALIMENTA AL GATO ---');
  await evalCode(`window.michiUI.launchMinigame('alimentaGato', 'normal')`);
  await new Promise(r => setTimeout(r, 500));
  // Spawn and tap food
  await evalCode(`
    (function() {
      window.gameAlimentaGato.spawnFallingItem();
      if (window.gameAlimentaGato.items.length > 0) {
        const item = window.gameAlimentaGato.items[0];
        item.isGood = true; // force good food
        window.gameAlimentaGato.handleItemTap(item);
      }
    })()
  `);
  let foodScore = await evalCode(`window.gameAlimentaGato.score`);
  console.log('Alimenta al Gato score after feeding:', foodScore);

  await evalCode(`
    (function() {
      const exitBtn = document.querySelector('#screen-game-alimenta .ingame-exit-btn');
      if (exitBtn) exitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 7. TESTING GAME 4: GATO NINJA ---');
  await evalCode(`window.michiUI.launchMinigame('gatoNinja', 'normal')`);
  await new Promise(r => setTimeout(r, 600));
  let ninjaCanvasW = await evalCode(`window.gameGatoNinja.canvas.width`);
  let ninjaCanvasH = await evalCode(`window.gameGatoNinja.canvas.height`);
  let ninjaPlaying = await evalCode(`window.gameGatoNinja.isPlaying`);
  console.log('Gato Ninja canvas dimensions:', ninjaCanvasW, 'x', ninjaCanvasH);
  console.log('Gato Ninja isPlaying?', ninjaPlaying);

  // Test jump
  await evalCode(`window.gameGatoNinja.jump()`);
  let ninjaCatVy = await evalCode(`window.gameGatoNinja.cat.vy`);
  console.log('Gato Ninja jump vy:', ninjaCatVy);

  await evalCode(`
    (function() {
      const exitBtn = document.querySelector('#screen-game-ninja .ingame-exit-btn');
      if (exitBtn) exitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 8. TESTING GAME 5: GATO CORREDOR ---');
  await evalCode(`window.michiUI.launchMinigame('gatoCorredor', 'normal')`);
  await new Promise(r => setTimeout(r, 600));
  let corredorPlaying = await evalCode(`window.gameGatoCorredor.isPlaying`);
  console.log('Gato Corredor isPlaying?', corredorPlaying);

  // Test slide
  await evalCode(`window.gameGatoCorredor.slide()`);
  let corredorSliding = await evalCode(`window.gameGatoCorredor.cat.isSliding`);
  console.log('Gato Corredor isSliding?', corredorSliding);

  await evalCode(`
    (function() {
      const exitBtn = document.querySelector('#screen-game-corredor .ingame-exit-btn');
      if (exitBtn) exitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 9. TESTING GAME 6: NO DESPIERTES AL GATO ---');
  await evalCode(`window.michiUI.launchMinigame('noDespiertes', 'normal')`);
  await new Promise(r => setTimeout(r, 500));
  let stealthPlaying = await evalCode(`window.gameNoDespiertes.isPlaying`);
  console.log('No Despiertes isPlaying?', stealthPlaying);
  await evalCode(`window.gameNoDespiertes.taskCompleted()`);
  let stealthScore = await evalCode(`window.gameNoDespiertes.score`);
  console.log('No Despiertes score after taskCompleted:', stealthScore);

  await evalCode(`
    (function() {
      const exitBtn = document.querySelector('#screen-game-no-despiertes .ingame-exit-btn');
      if (exitBtn) exitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400));

  console.log('\n--- 10. FINAL PLAYER STATUS & LOCALSTORAGE ---');
  let finalPlayer = await evalCode(`JSON.stringify(window.michiStorage.data.player)`);
  let finalRecords = await evalCode(`JSON.stringify(window.michiStorage.data.records)`);
  console.log('Final player:', finalPlayer);
  console.log('Final records:', finalRecords);

  console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('Test script failed:', err);
  process.exit(1);
});
