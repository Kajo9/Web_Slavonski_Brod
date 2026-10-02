(function () {
  var exhibit = document.querySelector('[data-tambure-exhibit]');

  if (!exhibit) {
    return;
  }

  var stage = exhibit.querySelector('[data-tambure-stage]');
  var dropZone = exhibit.querySelector('[data-drop-zone]');
  var attachedInstrument = exhibit.querySelector('[data-attached-instrument]');
  var playHint = exhibit.querySelector('[data-play-hint]');
  var muteButton = exhibit.querySelector('[data-mute]');
  var volumeSlider = exhibit.querySelector('[data-volume]');
  var instrumentOptions = Array.prototype.slice.call(exhibit.querySelectorAll('[data-instrument]'));
  var audioContext = null;
  var masterGain = null;
  var muted = false;
  var volume = Number(volumeSlider.value) / 100;
  var dragState = null;
  var rotationState = null;
  var rotation = 0;
  var activeInstrumentId = null;
  var ignoreInstrumentClickUntil = 0;
  var lastNoteTime = 0;
  var effectTimer = null;
  var activeSamples = {};

  // Replace each null with a short audio-file path when instrument recordings are available.
  var instrumentAudio = {
    tambura: { samples: [null, null, null, null, null, null, null, null], frequencies: [196, 220, 247, 262, 294, 330, 349, 392], waveform: 'triangle' },
    celo: { samples: [null, null, null, null, null, null, null, null], frequencies: [130, 147, 165, 175, 196, 220, 247, 262], waveform: 'sine' },
    bugarija: { samples: [null, null, null, null, null, null, null, null], frequencies: [220, 247, 262, 294, 330, 349, 392, 440], waveform: 'triangle' },
    brac: { samples: [null, null, null, null, null, null, null, null], frequencies: [165, 185, 208, 220, 247, 277, 311, 330], waveform: 'sine' }
  };

  function createAudioContext() {
    var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContextConstructor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = muted ? 0 : volume;
      masterGain.connect(audioContext.destination);
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(function () {});
    }

    return audioContext;
  }

  function showPlayingResponse() {
    window.clearTimeout(effectTimer);
    stage.classList.remove('is-playing');
    void stage.offsetWidth;
    stage.classList.add('is-playing');
    effectTimer = window.setTimeout(function () {
      stage.classList.remove('is-playing');
    }, 950);
  }

  function playNote(instrumentId, noteIndex) {
    var profile = instrumentAudio[instrumentId];
    var samplePath;
    var sample;
    var context;
    var oscillator;
    var envelope;
    var now;

    if (!profile) {
      return;
    }

    showPlayingResponse();

    if (muted || Date.now() - lastNoteTime < 75) {
      return;
    }

    lastNoteTime = Date.now();
    noteIndex = ((noteIndex % profile.frequencies.length) + profile.frequencies.length) % profile.frequencies.length;
    samplePath = profile.samples[noteIndex];

    if (samplePath) {
      if (activeSamples[instrumentId]) {
        activeSamples[instrumentId].pause();
      }

      sample = new Audio(samplePath);
      sample.volume = volume;
      activeSamples[instrumentId] = sample;
      sample.play().catch(function () {});
      return;
    }

    context = createAudioContext();

    if (!context) {
      return;
    }

    oscillator = context.createOscillator();
    envelope = context.createGain();
    now = context.currentTime;
    oscillator.type = profile.waveform;
    oscillator.frequency.setValueAtTime(profile.frequencies[noteIndex], now);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.16, now + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    oscillator.connect(envelope);
    envelope.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 0.44);
  }

  function attachInstrument(instrumentId) {
    var option = exhibit.querySelector('[data-instrument="' + instrumentId + '"]');
    var icon;

    if (!option) {
      return;
    }

    icon = option.querySelector('svg').cloneNode(true);
    icon.classList.add('attached-instrument-art');
    attachedInstrument.replaceChildren(icon);
    attachedInstrument.hidden = false;
    attachedInstrument.setAttribute('data-instrument', instrumentId);
    attachedInstrument.setAttribute('aria-label', 'Zakrenite instrument: ' + option.textContent.trim());
    activeInstrumentId = instrumentId;
    rotation = 0;
    attachedInstrument.style.setProperty('--instrument-angle', '0deg');
    stage.classList.add('has-instrument');
    playHint.textContent = 'Svirajte! Zakrenite instrument za različite tonove.';

    instrumentOptions.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button === option));
    });
  }

  function pointInside(element, x, y) {
    var bounds = element.getBoundingClientRect();
    return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
  }

  function updateDragPreview(event) {
    if (!dragState.preview) {
      dragState.preview = dragState.option.cloneNode(true);
      dragState.preview.removeAttribute('data-instrument');
      dragState.preview.removeAttribute('aria-pressed');
      dragState.preview.removeAttribute('type');
      dragState.preview.className = 'instrument-drag-preview';
      dragState.preview.setAttribute('aria-hidden', 'true');
      exhibit.appendChild(dragState.preview);
    }

    dragState.preview.style.left = event.clientX + 'px';
    dragState.preview.style.top = event.clientY + 'px';
  }

  exhibit.addEventListener('pointerdown', function (event) {
    var option = event.target.closest('[data-instrument]');

    if (!option || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    dragState = {
      option: option,
      instrumentId: option.getAttribute('data-instrument'),
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      isDragging: false,
      preview: null
    };
  });

  window.addEventListener('pointermove', function (event) {
    var currentAngle;
    var delta;
    var sector;

    if (dragState && event.pointerId === dragState.pointerId) {
      if (!dragState.isDragging && Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY) > 7) {
        dragState.isDragging = true;
        dragState.option.classList.add('is-dragging');
      }

      if (dragState.isDragging) {
        event.preventDefault();
        updateDragPreview(event);
        dropZone.classList.toggle('is-over', pointInside(dropZone, event.clientX, event.clientY));
      }
    }

    if (rotationState && event.pointerId === rotationState.pointerId) {
      event.preventDefault();
      currentAngle = Math.atan2(event.clientY - rotationState.centerY, event.clientX - rotationState.centerX) * 180 / Math.PI;
      delta = currentAngle - rotationState.lastAngle;

      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      if (Math.abs(delta) > 0.5) {
        rotationState.didRotate = true;
      }

      rotation += delta;
      rotationState.lastAngle = currentAngle;
      attachedInstrument.style.setProperty('--instrument-angle', rotation + 'deg');
      sector = Math.floor((((currentAngle + 180) % 360) + 360) % 360 / 45);

      if (sector !== rotationState.lastSector) {
        rotationState.lastSector = sector;
        playNote(activeInstrumentId, sector);
      }
    }
  }, { passive: false });

  window.addEventListener('pointerup', function (event) {
    if (dragState && event.pointerId === dragState.pointerId) {
      if (dragState.isDragging && pointInside(dropZone, event.clientX, event.clientY)) {
        attachInstrument(dragState.instrumentId);
      }

      if (dragState.isDragging) {
        dragState.option.dataset.ignoreClickUntil = String(Date.now() + 300);
      }

      dragState.option.classList.remove('is-dragging');
      dropZone.classList.remove('is-over');

      if (dragState.preview) {
        dragState.preview.remove();
      }

      dragState = null;
    }

    if (rotationState && event.pointerId === rotationState.pointerId) {
      if (rotationState.didRotate) {
        ignoreInstrumentClickUntil = Date.now() + 180;
      }

      rotationState = null;
    }
  });

  window.addEventListener('pointercancel', function () {
    if (dragState) {
      dragState.option.classList.remove('is-dragging');
      dropZone.classList.remove('is-over');
      if (dragState.preview) dragState.preview.remove();
      dragState = null;
    }
    rotationState = null;
  });

  instrumentOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      if (Date.now() < Number(option.dataset.ignoreClickUntil || 0)) {
        return;
      }
      attachInstrument(option.getAttribute('data-instrument'));
    });
  });

  attachedInstrument.addEventListener('pointerdown', function (event) {
    var bounds;
    var initialAngle;

    if (attachedInstrument.hidden || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    event.preventDefault();
    bounds = attachedInstrument.getBoundingClientRect();
    initialAngle = Math.atan2(event.clientY - (bounds.top + bounds.height / 2), event.clientX - (bounds.left + bounds.width / 2)) * 180 / Math.PI;
    rotationState = {
      pointerId: event.pointerId,
      centerX: bounds.left + bounds.width / 2,
      centerY: bounds.top + bounds.height / 2,
      lastAngle: initialAngle,
      lastSector: Math.floor((((initialAngle + 180) % 360) + 360) % 360 / 45),
      didRotate: false
    };
  });

  attachedInstrument.addEventListener('click', function () {
    var sector;

    if (Date.now() < ignoreInstrumentClickUntil || !activeInstrumentId) {
      return;
    }

    sector = Math.floor((((rotation % 360) + 360) % 360) / 45);
    playNote(activeInstrumentId, sector);
  });

  attachedInstrument.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      rotation += event.key === 'ArrowRight' ? 20 : -20;
      attachedInstrument.style.setProperty('--instrument-angle', rotation + 'deg');
      playNote(activeInstrumentId, Math.floor((((rotation % 360) + 360) % 360) / 45));
    }
  });

  muteButton.addEventListener('click', function () {
    var icon = muteButton.querySelector('i');
    muted = !muted;
    muteButton.setAttribute('aria-pressed', String(muted));
    muteButton.setAttribute('aria-label', muted ? 'Uključi zvuk' : 'Isključi zvuk');
    muteButton.title = muted ? 'Uključi zvuk' : 'Isključi zvuk';
    icon.className = muted ? 'fa fa-volume-off' : 'fa fa-volume-up';

    if (masterGain) {
      masterGain.gain.setTargetAtTime(muted ? 0 : volume, audioContext.currentTime, 0.03);
    }

    Object.keys(activeSamples).forEach(function (instrumentId) {
      activeSamples[instrumentId].volume = muted ? 0 : volume;
    });
  });

  volumeSlider.addEventListener('input', function () {
    volume = Number(volumeSlider.value) / 100;

    if (masterGain) {
      masterGain.gain.setTargetAtTime(muted ? 0 : volume, audioContext.currentTime, 0.03);
    }

    Object.keys(activeSamples).forEach(function (instrumentId) {
      activeSamples[instrumentId].volume = muted ? 0 : volume;
    });
  });
})();