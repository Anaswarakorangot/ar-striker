(() => {
  const viewer = document.querySelector('#striker');
  const activate = document.querySelector('#activate');
  const rotate = document.querySelector('#rotate');
  const reset = document.querySelector('#reset');
  const status = document.querySelector('#strikerStatus');
  const effect = document.querySelector('#effect');
  const support = document.querySelector('#arSupport');
  const progress = document.querySelector('#progress');
  const bar = progress ? progress.querySelector('span') : null;
  let isStrikeMode = false;

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

      activate.textContent = isStrikeMode ? '↺ Return to Ready Stance' : '⚡ Activate Strike Pose';
      activate.classList.toggle('strike-active', isStrikeMode);

      if (effect) {
        effect.textContent = isStrikeMode ? '⚡ STRIKE CHARGED • 100% POWER' : '';
        effect.classList.remove('flash');
        requestAnimationFrame(() => effect.classList.add('flash'));
      }
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
