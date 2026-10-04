const { spawn, execSync } = require('child_process');

async function test() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--incognito',
    'http://localhost:8080/index.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const r = await fetch('http://127.0.0.1:9222/json');
    const targets = await r.json();
    const t = targets.find(x => x.type === 'page' && x.url.includes('localhost:8080'));
    const ws = new WebSocket(t.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise(res => {
      const curId = id++;
      const handler = (e) => {
        const m = JSON.parse(e.data);
        if (m.id === curId) { ws.removeEventListener('message', handler); res(m.result); }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    await new Promise(res => ws.onopen = res);
    await send('Runtime.enable');

    // Click press start and open Atrapa al Gato
    await send('Runtime.evaluate', { expression: "document.getElementById('btn-press-start').click();" });
    await new Promise(r => setTimeout(r, 400));
    await send('Runtime.evaluate', { expression: "window.michiUI.launchMinigame('atrapaGato', 'normal');" });
    await new Promise(r => setTimeout(r, 400));
    await send('Runtime.evaluate', { expression: "window.gameAtrapaGato.spawnEntity();" });
    await new Promise(r => setTimeout(r, 300));

    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const cur = window.gameAtrapaGato.currentPopup;
        if (!cur) return { error: 'no popup' };
        const hole = document.querySelector('.cat-hole[data-index="' + cur.index + '"]');
        const popup = document.getElementById('cat-popup-' + cur.index);
        const box = hole.querySelector('.cat-hole-box');
        const canvas = popup.querySelector('canvas');
        return {
          index: cur.index,
          type: cur.type,
          catId: cur.catId,
          holeRect: hole.getBoundingClientRect(),
          popupRect: popup.getBoundingClientRect(),
          boxRect: box.getBoundingClientRect(),
          canvasRect: canvas.getBoundingClientRect(),
          popupClasses: popup.className,
          popupComputed: {
            transform: getComputedStyle(popup).transform,
            zIndex: getComputedStyle(popup).zIndex,
            bottom: getComputedStyle(popup).bottom,
            top: getComputedStyle(popup).top,
            display: getComputedStyle(popup).display,
            visibility: getComputedStyle(popup).visibility,
            opacity: getComputedStyle(popup).opacity
          },
          boxComputed: {
            zIndex: getComputedStyle(box).zIndex,
            height: getComputedStyle(box).height
          }
        };
      })()`,
      returnByValue: true
    });

    console.log('POPUP INFO:', JSON.stringify(info.result.value, null, 2));

    // Also check Gato Ninja
    await send('Runtime.evaluate', { expression: "window.michiUI.launchMinigame('gatoNinja', 'normal');" });
    await new Promise(r => setTimeout(r, 400));
    const ninjaInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const c = document.getElementById('ninja-canvas');
        return {
          canvasW: c.width,
          canvasH: c.height,
          clientW: c.clientWidth,
          clientH: c.clientHeight,
          rect: c.getBoundingClientRect(),
          cat: window.gameGatoNinja.cat,
          groundY: window.gameGatoNinja.groundY,
          isPlaying: window.gameGatoNinja.isPlaying
        };
      })()`,
      returnByValue: true
    });
    console.log('NINJA INFO:', JSON.stringify(ninjaInfo.result.value, null, 2));

    // Also check Gato Corredor
    await send('Runtime.evaluate', { expression: "window.michiUI.launchMinigame('gatoCorredor', 'normal');" });
    await new Promise(r => setTimeout(r, 400));
    const corredorInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const c = document.getElementById('corredor-canvas');
        return {
          canvasW: c.width,
          canvasH: c.height,
          clientW: c.clientWidth,
          clientH: c.clientHeight,
          rect: c.getBoundingClientRect(),
          cat: window.gameGatoCorredor.cat,
          groundY: window.gameGatoCorredor.groundY,
          isPlaying: window.gameGatoCorredor.isPlaying
        };
      })()`,
      returnByValue: true
    });
    console.log('CORREDOR INFO:', JSON.stringify(corredorInfo.result.value, null, 2));

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    try { execSync('taskkill /F /IM chrome.exe'); } catch(e){}
  }
}

test();
