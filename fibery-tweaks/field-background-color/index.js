function fiberflowSetFieldBackgroundColor() {
  const tweakId = document.currentScript.getAttribute("data-fibery-tweak-id");
  const parameters = JSON.parse(
    document.currentScript.getAttribute("data-fibery-tweak-parameters")
  );

  let styleContent = "";
  ((parameters || {}).fields || []).forEach((field) => {
    styleContent += `
  [data-rbd-draggable-id="field:${field.fieldId}"] {
    background-color: ${field.color} !important;
    border-radius: 5px !important;
  }`;
  });

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(
    `style[data-fibery-tweak-id="${tweakId}"]`
  );
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("data-fibery-tweak-id", tweakId);
    style.setAttribute(
      "data-fibery-tweak-filename",
      "set-field-background-color.css"
    );
    document.head.appendChild(style);
  }

  style.textContent = styleContent;
}

fiberflowSetFieldBackgroundColor();
