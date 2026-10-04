# 🐱 MICHICADE (ミチケード) — Retro 16-Bit Cat Arcade

**MICHICADE** es una web app arcade completamente jugable, protagonizada por gatos en estilo **pixel art moderno e inspiración 16-bit**. Diseñada para jugarse fluidamente tanto en teléfonos móviles (controles táctiles optimizados para una sola mano) como en PC y laptops con teclado y ratón.

---

## 🕹️ Características Principales

* **Estética Arcade Portátil:** Marco de máquina arcade con bisel CRT, scanlines retro (activables/desactivables), paleta oscura y botones arcade grandes.
* **Audio 100% Nativo Web Audio API:** Sin dependencias externas ni archivos de audio que puedan fallar sin conexión. Efectos retro de sintetizador (maullidos, saltos, monedas, fanfarrias) y música de fondo chiptune polifónica de 8/16-bit.
* **Sistema de Guardado Automático:** Todo el progreso (monedas, tickets, nivel, gatos desbloqueados, compañeros y récords) se guarda en `localStorage` con arquitectura modular para sincronización futura en la nube.
* **Preparado para Android / APK:** Sin APIs exclusivas de escritorio. Compatible con PWA (`manifest.json` incluido) y empaquetable en APK mediante **Capacitor**, **Cordova** o **Trusted Web Activities (TWA)**.

---

## 🐾 Protagonistas y Colección de Gatos

### Protagonistas (Disponibles desde el inicio)
1. **Gato 1 — Siamés:**
   * Cuerpo crema/marfil, orejas, antifaz facial, patitas y cola color chocolate oscuro.
   * Ojos azules zafiro penetrantes.
   * Animaciones: idle, alegría/salto, enojo, sorpresa y derrota.
2. **Gato 2 — Gato Gris:**
   * Pelaje gris pizarra, hocico blanco alrededor de la boca y parche blanco en el pecho.
   * Grandes ojos ámbar expresivos, personalidad torpe y cómica.
   * Animaciones: idle, alegría, sorpresa y derrota.

### Gatos Desbloqueables (Colección)
* **Don Bigotes** (Común): Caballero distinguido con bigote blanco estilo victoriano.
* **Michi Naranja** (Raro): Comparte una neurona con todos los gatos naranjas del universo.
* **Kevin** (Raro): Duerme 17 horas al día y todavía está cansado.
* **Michi Calicó** (Raro): Tres colores y tres veces más personalidad.
* **Pancho el Gordo** (Épico): Aerodinámico y de huesos grandes. Imparable al rodar.
* **Gato Ninja** (Épico): Cintillo rojo y sigilo entre las cajas de cartón.
* **Michi Hacker** (Épico): Visor cibernético; se echa en el teclado y borra bases de datos en producción.
* **Señor Ronroneo** (Legendario): Corona de oro; su ronroneo calibra la frecuencia del universo.
* **Michi Cósmico** (Mítico): Nebulosa púrpura y polvo de estrellas.
* **Michi Dorado** (Mítico - Recompensa Nivel 50): El amuleto definitivo de la fortuna arcade.

> *Interactividad:* En la pantalla de **Colección**, puedes inspeccionar a cualquier gato, tocar el botón **"Tocar Michi"** para escuchar maullidos y ver reacciones, y equiparlo como tu compañero activo para todos los juegos.

---

## 🎮 Los 6 Minijuegos Funcionales

### 1. Atrapa al Gato
* **Mecánica:** Los gatos se asoman aleatoriamente en una cuadrícula 3x3 de cajas de cartón.
* **Reflejos:** Toca antes de que se escondan. Puntos extra por velocidad (<350ms = ¡PERFECTO!).
* **Dificultad progresiva:**
  * Niveles 1-5: Asomadas lentas.
  * Niveles 6-10: Mayor velocidad.
  * Niveles 11-20: Aparecen calcetines y bombas trampa.
  * Niveles 21-30: Aparecen gatos de cartón falsos (señuelos).
  * Niveles 31-40: Cambios rápidos y dobles apariciones.
  * Niveles 41-50 / Extremo: Frenesí reflejo con vidas reducidas.

### 2. Memoria Michi
* **Mecánica:** Juego de cartas boca abajo con ilustraciones pixel art de los michis y sus premios.
* **Etapas progresivas:**
  * Etapa 1: 4 cartas (2 parejas)
  * Etapa 2: 6 cartas (3 parejas)
  * Etapa 3: 8 cartas (4 parejas)
  * Etapa 4: 12 cartas (6 parejas)
  * Etapa 5: 16 cartas (8 parejas)
* **Retos:** Multiplicador de racha/combo por aciertos consecutivos y bonificación por tiempo restante.

### 3. Alimenta al Gato
* **Mecánica:** El gato seleccionado espera en la parte inferior mientras caen objetos desde arriba.
* **Comida Deliciosa (Tócala):** 🍗 Pollo, 🐟 Atún fresco, 🥛 Leche, 🥩 Salchicha.
* **Basura y Trampas (Evítalas):** 🧦 Calcetín sucio, 👟 Zapatilla, 📦 Caja vacía, 💣 Bomba de pelos, 🌶️ Ají picante.
* **Reacciones visuales cómicas:** Burbujas de diálogo y expresiones (`¡Ñam! ✨` con corazones vs `¡Blegh! ❌` con humo verde).

### 4. Gato Ninja
* **Mecánica:** Juego arcade de carrera continua a 60 FPS con física de salto y **doble salto**.
* **Obstáculos:** Cajas de madera, cactus espinosos, ovillos de lana y shurikens ninja giratorios.
* **Coleccionables:** Monedas flotantes y sushi rolls.
* **Controles:** Toque en pantalla / Barra espaciadora / Flecha Arriba / Botón A táctil.

### 5. Gato Corredor
* **Mecánica:** Side-scroller plataformero a través de **5 escenarios únicos**:
  1. Habitación acogedora
  2. Cocina con azulejos
  3. Calle urbana
  4. Parque verde
  5. Tejados nocturnos
* **Controles:** Salto y Deslizamiento (agacharse bajo obstáculos altos).
* **Power-ups:**
  * ⚡ **Catnip Zoomies:** Carrera invencible que destruye obstáculos por 6 segundos.
  * 🧲 **Imán de Peces:** Atrae todas las monedas cercanas automáticamente.
  * ⏰ **Slow-Mo:** Ralentiza el tiempo para esquivar con precisión.

### 6. No Despiertes al Gato
* **Mecánica:** Juego cómico de sigilo con un gato gigante durmiendo en un cojín de terciopelo.
* **Barra de Ruido (0% a 100%):** Si llega al 100%, el gato despierta enfurecido con ojos rojos y termina la partida. El ruido se disipa lentamente si el jugador espera con calma.
* **Fases de agitación:** Ronquido suave `Zzz...` (0-35%), orejas inquietas `Mrmmh...` (36-69%), ojos entreabiertos (70-99%) y despertar ruidoso (100%).
* **Misiones de sigilo:**
  * Atrapa 5 ratones de juguete sin tocar los cascabeles ruidosos.
  * Abre la lata de atún deteniendo la aguja en la zona verde silenciosa.
  * Roba el ovillo de lana con toques suaves y pausados.
  * Desconecta el despertador antes de que suene la alarma.

---

## 📈 Progresión (Niveles 1 al 50)

* **Nivel 1:** Novato Michi — Atrapa al Gato, Siamés y Gato Gris.
* **Nivel 2:** Desbloquea *Memoria Michi*.
* **Nivel 3:** Desbloquea *Alimenta al Gato*.
* **Nivel 4:** Desbloquea nuevo gato: *Don Bigotes*.
* **Nivel 5:** Desbloquea *Gato Ninja*.
* **Nivel 6:** Desbloquea *Modo Difícil* (Juegos 1-3).
* **Nivel 7:** Desbloquea gato: *Michi Naranja*.
* **Nivel 8:** Desbloquea *Gato Corredor*.
* **Nivel 10:** Desbloquea *No Despiertes al Gato* + Accesorio Lentes Pixel.
* **Nivel 12:** Desbloquea gato: *Kevin*.
* **Nivel 15:** Dificultad Difícil global.
* **Nivel 18:** Desbloquea gato: *Michi Calicó*.
* **Nivel 20:** Nuevo escenario: *Callejón Nocturno*.
* **Nivel 25:** Desbloquea gato: *Pancho el Gordo*.
* **Nivel 30:** Desbloquea gato especial: *Michi Hacker*.
* **Nivel 35:** Desbloquea gato: *Señor Ronroneo*.
* **Nivel 40:** Desbloquea *Modo Extremo* en todos los minijuegos.
* **Nivel 45:** Desbloquea gato mítico: *Michi Cósmico*.
* **Nivel 50:** **Recompensa Final:** *Michi Dorado* + Corona de Oro + Título *"Deidad Michi Arcade"*.

---

## 🪙 Economía y Recompensas (Sin Microtransacciones)

* 🪙 **Monedas:** Se consiguen jugando partidas, logrando combos y recogiendo premios en los runners.
* 🎟️ **Tickets:** Se consiguen completando Misiones Diarias y desbloqueando Logros.
* 🕹️ **Garra de Premios (Claw Machine):** Gasta 35 monedas o 2 tickets para que la garra mecánica extraiga una cápsula sorpresa con monedas, tickets o gatos desbloqueables.

---

## 📁 Estructura del Proyecto

```
michicade/
├── index.html              # Punto de entrada y contenedor arcade principal
├── manifest.json           # Manifiesto PWA para instalación web y Android
├── assets/                 # Iconos pixel art generados (192x192 y 512x512)
├── styles/
│   ├── arcade.css          # Bisel de máquina arcade, efectos CRT y layout responsivo
│   ├── ui.css              # HUD, menús, colección, garra de premios y modales
│   └── games.css           # Estilos de tableros, lienzos y controles táctiles
├── js/
│   ├── main.js             # Secuencia de encendido "Press Start" e inicialización
│   ├── sprites.js          # Motor de renderizado de sprites 16-bit para gatos e ítems
│   ├── audio.js            # Sintetizador Web Audio API para SFX y música chiptune
│   ├── storage.js          # Manejador de persistencia con localStorage
│   ├── progression.js      # Árbol de niveles 1 al 50 y recompensas
│   ├── achievements.js     # Logros con notificaciones toast en tiempo real
│   ├── quests.js           # Desafíos diarios y reclamo de recompensas
│   ├── ui.js               # Enrutador de pantallas y modales
│   └── games/
│       ├── atrapa-gato.js  # Minijuego 1: Atrapa al Gato
│       ├── memoria-michi.js# Minijuego 2: Memoria Michi
│       ├── alimenta-gato.js# Minijuego 3: Alimenta al Gato
│       ├── gato-ninja.js   # Minijuego 4: Gato Ninja
│       ├── gato-corredor.js# Minijuego 5: Gato Corredor
│       └── no-despiertes.js# Minijuego 6: No Despiertes al Gato
└── README.md
```

---

## 🚀 Cómo Ejecutar Localmente

### Opción 1: Servidor Python
```bash
cd C:\Users\kenne\.gemini\antigravity\scratch\michicade
python -m http.server 8080
```
Abre en tu navegador: `http://localhost:8080`

### Opción 2: Node.js (npx serve)
```bash
cd C:\Users\kenne\.gemini\antigravity\scratch\michicade
npx serve .
```

### Opción 3: Abrir directamente en el navegador
Puedes hacer doble clic en `index.html` en tu explorador de archivos. Todo funcionará sin errores de CORS ya que los sprites y sonidos son generados proceduralmente sin dependencias externas.

---

## 📱 Cómo Convertir a APK para Android

La aplicación está lista para convertirse en APK sin modificar el código:

### Vía Capacitor (Recomendado):
1. Instala Capacitor:
   ```bash
   npm init -y
   npm i --save @capacitor/core @capacitor/cli @capacitor/android
   npx cap init Michicade com.michicade.arcade --web-dir .
   npx cap add android
   npx cap copy
   ```
2. Abre Android Studio y compila el APK:
   ```bash
   npx cap open android
   ```

### Vía PWA / TWA (Bubblewrap CLI):
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=http://tu-dominio/manifest.json
bubblewrap build
```
Generará directamente el archivo `.apk` firmado para instalar en cualquier dispositivo Android.
