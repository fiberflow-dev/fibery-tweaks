function fiberflowMaximumRelationViewHeight() {
  const tweakId = document.currentScript.getAttribute('data-fibery-tweak-id');
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters'));

  // Map dropdown labels to actual CSS class names
  const viewTypeToClass = {
    Table: 'grid',
    Board: 'board',
    List: 'list',
    Timeline: 'timeline',
    Gantt: 'gantt',
    Calendar: 'calendar',
    Report: 'report',
    Feed: 'feed',
    Map: 'map',
  };

  let styleContent = '';
  ((parameters || {}).fields || []).forEach((field) => {
    if (field.maxHeight) {
      const viewType = field.viewType;
      const fieldId = field.fieldId;

      let selector = '.object_panel '; // Make sure this only applies to the entity view

      // Start with field constraint if specified
      if (fieldId) {
        selector += `[data-rbd-draggable-id="field:${fieldId}"] `;
      }

      // Add relation views container
      selector += '.relation_views ';

      // Add view type constraint if specified
      if (viewType && viewTypeToClass[viewType]) {
        const cssClass = viewTypeToClass[viewType];
        selector += `.${cssClass}_view`;
      } else {
        // Remove trailing space if no view type specified
        selector = selector.trim();
      }

      styleContent += `
${selector} {
  max-height: ${field.maxHeight}px !important;
  overflow-y: auto !important;
}`;
    }
  });

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(`style[data-fibery-tweak-id="${tweakId}"]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-fibery-tweak-id', tweakId);
    style.setAttribute('data-fibery-tweak-filename', 'maximum-relation-view-height.css');
    document.head.appendChild(style);
  }

  style.textContent = styleContent;
}

fiberflowMaximumRelationViewHeight();
