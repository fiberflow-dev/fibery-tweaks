function fiberflowHideEmptyCollections() {
  const tweakId = document.currentScript.getAttribute('data-fibery-tweak-id');
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters'));

  const collections = parameters.collections;

  // Create CSS rules for each collection
  let cssRules = [];

  if (collections && Array.isArray(collections)) {
    collections.forEach((fieldIdOrFieldIds) => {
      const fieldIds = Array.isArray(fieldIdOrFieldIds) ? fieldIdOrFieldIds : [fieldIdOrFieldIds];

      fieldIds.forEach((fieldId) => {
        // Hide collections that don't have any list_item children
        cssRules.push(`div[data-rbd-draggable-id="field:${fieldId}"]:not(:has(.list_item)) {
          display: none !important;
        }`);
      });
    });
  }

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(`style[data-fibery-tweak-id="${tweakId}"]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-fibery-tweak-id', tweakId);
    style.setAttribute('data-fibery-tweak-filename', 'hide-empty-collections.css');
    document.head.appendChild(style);
  }

  style.textContent = cssRules.join('\n\n');
}

fiberflowHideEmptyCollections();
