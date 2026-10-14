(() => {
  const viewer = document.querySelector('#striker');
  const activate = document.querySelector('#activate');
  const rotate = document.querySelector('#rotate');
  const reset = document.querySelector('#reset');
  const jumpBtn = document.querySelector('#jumpBtn');
  const kickBtn = document.querySelector('#kickBtn');
  const status = document.querySelector('#strikerStatus');
  const effect = document.querySelector('#effect');
  const support = document.querySelector('#arSupport');
  const progress = document.querySelector('#progress');
  const bar = progress ? progress.querySelector('span') : null;

  let isStrikeMode = false;
  let kickTimeout = null;
  let kickHoldTimeout = null;
  let jumpTimeout = null;

  if (viewer) {
    viewer.addEventListener('progress', (event) => {
      if (!bar || !progress) return;
      const percent = Math.round(event.detail.totalProgress * 100);
      bar.style.width = `${percent}%`;
      progress.setAttribute('aria-valuenow', String(percent));
      progress.classList.toggle('hide', percent >= 100);
    });

    viewer.addEventListener('load', () => {
      if (support) {
        support.textContent = viewer.canActivateAR
          ? 'AR ready • iPhone Safari uses Quick Look'
          : 'AR is unavailable here; the interactive 3D preview still works.';
      }
    });

    viewer.addEventListener('error', () => {
      if (support) {
        support.textContent = 'The 3D model could not load. Check your connection and refresh.';
      }
    });
  }

  function showEffect(text) {
    if (!effect) return;
    effect.textContent = text;
    effect.classList.remove('flash');
    requestAnimationFrame(() => effect.classList.add('flash'));
  }

  function triggerJump() {
    if (!viewer) return;
    clearTimeout(jumpTimeout);

    try {
      viewer.pause();
      viewer.animationName = 'jump';
      viewer.currentTime = 0;
      viewer.play({ repetitions: 1 });
    } catch (e) {
      console.warn('Animation notice:', e);
    }

    if (status) status.textContent = 'JUMPING';
    showEffect('🦘 LEAPING HEADER!');

    jumpTimeout = setTimeout(() => {
      if (status) status.textContent = isStrikeMode ? 'STRIKE MODE' : 'READY';
    }, 1000);
  }

  function triggerKick() {
    if (!viewer) return;
    clearTimeout(kickTimeout);
    clearTimeout(kickHoldTimeout);

    try {
      viewer.pause();
      viewer.animationName = 'kick';
      viewer.currentTime = 0;
      viewer.play({ repetitions: 1 });
    } catch (e) {
      console.warn('Animation notice:', e);
    }

    if (status) status.textContent = 'BALL KICKED • FLYING';
    showEffect('⚽ POWER STRIKE! BALL FLIES TO DISTANCE');

    // After 850ms, the ball lands at distance and holds for 2 full seconds
    kickHoldTimeout = setTimeout(() => {
      if (status) status.textContent = 'BALL AT DISTANCE (RESPAWNING IN 2S)';
    }, 850);

    // After 2.9s - 3.1s, the ball respawns back to the striker's foot
    kickTimeout = setTimeout(() => {
      if (status) status.textContent = isStrikeMode ? 'STRIKE MODE' : 'READY';
      showEffect('⚽ BALL RESPAWNED AT STRIKER\'S FOOT');
    }, 3100);
  }

  if (jumpBtn) jumpBtn.addEventListener('click', triggerJump);
  if (kickBtn) kickBtn.addEventListener('click', triggerKick);

  if (activate && viewer) {
    activate.addEventListener('click', () => {
      isStrikeMode = !isStrikeMode;
      viewer.src = isStrikeMode ? 'models/striker_strike.glb' : 'models/striker_ready.glb';
      viewer.setAttribute('ios-src', isStrikeMode ? 'models/striker_strike.usdz' : 'models/striker_ready.usdz');
      viewer.exposure = isStrikeMode ? 1.25 : 1;

      if (status) {
        status.textContent = isStrikeMode ? 'STRIKE MODE' : 'READY';
        status.classList.toggle('powered', isStrikeMode);
      }

      activate.textContent = isStrikeMode ? '↺ Return to Ready Stance' : '⚡ Match Strike Mode';
      activate.classList.toggle('strike-active', isStrikeMode);

      showEffect(isStrikeMode ? '⚡ STRIKE CHARGED • 100% POWER' : '⚽ STRIKER READY');
    });
  }

  if (rotate && viewer) {
    rotate.addEventListener('click', () => {
      viewer.autoRotate = !viewer.autoRotate;
      rotate.textContent = `Auto-rotate: ${viewer.autoRotate ? 'On' : 'Off'}`;
      rotate.setAttribute('aria-pressed', String(viewer.autoRotate));
    });
  }

  if (reset && viewer) {
    reset.addEventListener('click', () => {
      viewer.cameraOrbit = '0deg 75deg 105%';
      viewer.fieldOfView = '30deg';
      if (typeof viewer.jumpCameraToGoal === 'function') {
        viewer.jumpCameraToGoal();
      }
    });
  }
})();
