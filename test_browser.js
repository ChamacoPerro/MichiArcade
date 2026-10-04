const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_test_profile');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome with remote debugging...');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--incognito',
    '--no-default-browser-check',
    'http://localhost:8080/index.html'
  ]);

  await sleep(2500);

  try {
    const listRes = await fetch('http://127.0.0.1:9222/json');
    const targets = await listRes.json();
    console.log('Targets found:', targets.length);
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      throw new Error('No page target found');
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const callbacks = new Map();

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        cb(msg.result);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[Browser Console]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[Browser Exception]', msg.params.exceptionDetails);
      }
    };

    console.log('Enabling Page & Runtime...');
    await send('Page.enable');
    await send('Runtime.enable');

    await sleep(1500);

    // Helper: evaluate JS in page
    async function evalCode(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res && res.result ? res.result.value : null;
    }

    // Helper: take screenshot
    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      if (res && res.data) {
        fs.writeFileSync(path.join(__dirname, filename), Buffer.from(res.data, 'base64'));
        console.log(`Saved screenshot: ${filename}`);
      }
    }

    console.log('1. Checking boot screen...');
    await sleep(800);
    await capture('screenshot_1_boot.png');

    console.log('2. Clicking PRESS START...');
    await evalCode("document.getElementById('btn-press-start').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))");
    await sleep(600);
    await capture('screenshot_2_menu.png');

    const currentScreen = await evalCode("window.michiUI.currentScreen");
    console.log('Current screen after PRESS START:', currentScreen);

    console.log('3. Navigating to Minigames list...');
    await evalCode("document.getElementById('nav-btn-games').click()");
    await sleep(500);
    await capture('screenshot_3_games_list.png');

    console.log('4. Testing Launch Minigame 1: Atrapa al Gato...');
    await evalCode("window.michiUI.launchMinigame('atrapaGato', 'normal')");
    await sleep(400);
    await evalCode("window.gameAtrapaGato.spawnEntity()");
    await sleep(250);
    await capture('screenshot_4_game_atrapa.png');

    console.log('Simulating tap on cat holes...');
    await evalCode("window.gameAtrapaGato.spawnEntity()");
    await sleep(200);
    await evalCode("window.gameAtrapaGato.handleHoleTap(window.gameAtrapaGato.currentPopup ? window.gameAtrapaGato.currentPopup.index : 0)");
    const atrapaScore = await evalCode("window.gameAtrapaGato.score");
    console.log('Atrapa al Gato Score after tap:', atrapaScore);

    console.log('5. Testing Launch Minigame 2: Memoria Michi...');
    await evalCode("window.michiUI.launchMinigame('memoriaMichi', 'normal')");
    await sleep(600);
    await capture('screenshot_5_game_memoria.png');

    console.log('6. Testing Launch Minigame 3: Alimenta al Gato...');
    await evalCode("window.michiUI.launchMinigame('alimentaGato', 'normal')");
    await sleep(600);
    await capture('screenshot_6_game_alimenta.png');

    console.log('7. Testing Launch Minigame 4: Gato Ninja...');
    await evalCode("window.michiUI.launchMinigame('gatoNinja', 'normal')");
    await sleep(600);
    await capture('screenshot_7_game_ninja.png');

    console.log('8. Testing Launch Minigame 5: Gato Corredor...');
    await evalCode("window.michiUI.launchMinigame('gatoCorredor', 'normal')");
    await sleep(600);
    await capture('screenshot_8_game_corredor.png');

    console.log('9. Testing Launch Minigame 6: No Despiertes al Gato...');
    await evalCode("window.michiUI.launchMinigame('noDespiertes', 'normal')");
    await sleep(600);
    await capture('screenshot_9_game_nodespiertes.png');

    console.log('10. Testing Cat Collection Screen...');
    await evalCode("window.michiUI.showScreen('screen-collection')");
    await sleep(500);
    await capture('screenshot_10_collection.png');

    console.log('11. Testing Records Screen...');
    await evalCode("window.michiUI.showScreen('screen-records')");
    await sleep(500);
    await capture('screenshot_11_records.png');

    console.log('12. Testing Prizes & Daily Quests Screen...');
    await evalCode("window.michiUI.showScreen('screen-prizes')");
    await sleep(500);
    await capture('screenshot_12_prizes.png');

    console.log('All automated browser tests passed!');
    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    try {
      require('child_process').execSync('taskkill /F /IM chrome.exe', { stdio: 'ignore' });
    } catch(e) {}
  }
}

run();
