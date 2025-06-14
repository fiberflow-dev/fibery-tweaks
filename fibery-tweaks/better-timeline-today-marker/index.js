function fiberflowBetterTimelineTodayMarker() {
  const tweakId = document.currentScript.getAttribute('data-fibery-tweak-id');

  // Parse parameters
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters'));

  // Width
  let width = parameters.width;
  if (!width || typeof width !== 'number') {
    width = 8;
  }

  // Color
  let color = parameters.color;
  if (!color || typeof color !== 'string') {
    color = '#ea8f90';
  }

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(`style[data-fibery-tweak-id="${tweakId}"]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-fibery-tweak-id', tweakId);
    style.setAttribute('data-fibery-tweak-filename', 'better-timeline-today-marker.css');
    document.head.appendChild(style);
  }

  style.textContent = `.marker_canvas > .timeline_content {
  width: ${width}px !important;
  z-index: 999 !important;
  background-color: ${color} !important;
  transform: translateX(-${width / 2}px) !important;
}`;
}

fiberflowBetterTimelineTodayMarker();
