function fiberflowDisableEmbeddedViewActions() {
  const tweakId = document.currentScript.getAttribute('data-fibery-tweak-id');

  let styles = [];

  // Parse parameters
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters'));

  // Hide search
  if (parameters.hideSearch) {
    styles.push(`.use_fibery_embedded_view .embedded_view .search_on_view { display: none; }`);
  }

  // Hide items
  if (parameters.hideItems) {
    styles.push(`.use_fibery_embedded_view .embedded_view .list_view_toolbar > :nth-child(1) { display: none; }`);
  }

  // Hide fields
  if (parameters.hideFields) {
    styles.push(`.use_fibery_embedded_view .embedded_view .list_view_toolbar > :nth-child(2) { display: none; }`);
  }

  // Hide filters
  if (parameters.hideFilters) {
    styles.push(`.use_fibery_embedded_view .embedded_view .list_view_toolbar > :nth-child(3) { display: none; }`);
  }

  // Hide sort
  if (parameters.hideSort) {
    styles.push(`.use_fibery_embedded_view .embedded_view .list_view_toolbar > :nth-child(4) { display: none; }`);
  }

  // Hide colors
  if (parameters.hideColors) {
    styles.push(`.use_fibery_embedded_view .embedded_view .list_view_toolbar > :nth-child(5) { display: none; }`);
  }

  // Hide create
  if (parameters.hideCreate) {
    styles.push(`.use_fibery_embedded_view .embedded_view .list_actions .button_group{ display: none; }`);
  }

  // Hide expand
  if (parameters.hideExpand) {
    styles.push(`.use_fibery_embedded_view .embedded_view .h9uzorl > :first-child > :last-child { display: none; }`);
  }

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(`style[data-fibery-tweak-id="${tweakId}"]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-fibery-tweak-id', tweakId);
    style.setAttribute('data-fibery-tweak-filename', 'disable-embedded-view-actions.css');
    document.head.appendChild(style);
  }

  style.textContent = styles.join('\n');
}

fiberflowDisableEmbeddedViewActions();
