function fiberflowSetFieldBackgroundColor() {
  const tweakId = document.currentScript.getAttribute('data-fibery-tweak-id');
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters'));

  let styleContent = '';
  ((parameters || {}).fields || []).forEach((field) => {
    const fieldStyles = [];
    if (field.color) {
      fieldStyles.push(`  background-color: ${field.color} !important;\n  border-radius: 5px !important;`);
    }

    if (field.fontSize) {
      fieldStyles.push(`  font-size: ${field.fontSize}px !important;`);
    }

    if (field.fontWeight) {
      fieldStyles.push(`  font-weight: ${field.fontWeight} !important;`);
    }

    if (field.textAlign) {
      fieldStyles.push(`  text-align: ${field.textAlign} !important;`);
    }

    styleContent += `
[data-rbd-draggable-id="field:${field.fieldId}"] {
${fieldStyles.join('\n')}
}`;
  });

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(`style[data-fibery-tweak-id="${tweakId}"]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-fibery-tweak-id', tweakId);
    style.setAttribute('data-fibery-tweak-filename', 'set-field-background-color.css');
    document.head.appendChild(style);
  }

  style.textContent = styleContent;
}

fiberflowSetFieldBackgroundColor();
