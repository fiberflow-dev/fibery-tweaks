function fiberflowCustomBranding() {
  const tweakId = document.currentScript.getAttribute('data-fibery-tweak-id');

  // Parse parameters
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters'));

  // Basic
  const basic = parameters.basic || {};
  const textColor = basic.textColor;
  const linkColor = basic.linkColor;
  const mainBackgroundColor = basic.mainBackgroundColor;
  const panelContentBackgroundColor = basic.panelContentBackgroundColor;

  // Font family
  const fontFamily = [
    (basic.fontFamily || '').trim(),
    'Inter Variable',
    'SF Pro Display',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI Variable Display',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Open Sans',
    'Helvetica Neue',
    'sans-serif',
  ]
    .filter(Boolean)
    .join(',');

  // Button
  const button = parameters.button || {};
  const buttonTextColor = button.textColor;
  const buttonBackgroundColor = button.backgroundColor;
  const buttonDestructiveTextColor = button.destructiveTextColor;
  const buttonDestructiveBackgroundColor = button.destructiveBackgroundColor;

  // Sidebar
  const sidebar = parameters.sidebar || {};
  const sidebarBackgroundColor = sidebar.backgroundColor;
  const sidebarTextColor = sidebar.textColor;
  const sidebarIconColor = sidebar.iconColor;

  // Custom
  const custom = parameters.custom || [];
  const customCssVariables = custom
    .map((item) => {
      if (item.variableName.startsWith('--')) {
        return `${item.variableName}: ${item.color};`;
      }
      return `--${item.variableName}: ${item.color};`;
    })
    .join('\n');

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(`style[data-fibery-tweak-id="${tweakId}"]`);
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-fibery-tweak-id', tweakId);
    style.setAttribute('data-fibery-tweak-filename', 'custom-branding.css');
    document.head.appendChild(style);
  }

  // Build CSS properties array conditionally
  const cssProperties = [];

  // Basic properties
  if (fontFamily) {
    cssProperties.push(`font-family: ${fontFamily} !important;`);
  }

  if (textColor) {
    cssProperties.push(`--fibery-color-textColor: ${textColor};`);
  }
  if (linkColor) {
    cssProperties.push(`--fibery-color-linkColor: ${linkColor};`);
  }
  if (mainBackgroundColor) {
    cssProperties.push(`--fibery-color-mainBg: ${mainBackgroundColor};`);
  }
  if (panelContentBackgroundColor) {
    cssProperties.push(`--fibery-color-panelBg: ${panelContentBackgroundColor};`);
    cssProperties.push(`--fibery-color-panelContentBg: ${panelContentBackgroundColor};`);
  }

  // Button properties
  if (buttonTextColor) {
    cssProperties.push(`--fibery-color-colorTextButtonSolidAccent: ${buttonTextColor};`);
  }
  if (buttonBackgroundColor) {
    cssProperties.push(`--fibery-color-colorBgButtonSolidAccentDefault: ${buttonBackgroundColor};`);
  }
  if (buttonDestructiveTextColor) {
    cssProperties.push(`--fibery-color-colorTextButtonSolidDestructive: ${buttonDestructiveTextColor};`);
  }
  if (buttonDestructiveBackgroundColor) {
    cssProperties.push(`--fibery-color-colorBgButtonSolidDestructiveDefault: ${buttonDestructiveBackgroundColor};`);
  }

  // Sidebar properties
  if (sidebarBackgroundColor) {
    cssProperties.push(`--fibery-color-menuBg: ${sidebarBackgroundColor};`);
    cssProperties.push(`--fibery-color-colorBgMenuItemHover: ${sidebarBackgroundColor};`);
    cssProperties.push(`--fibery-color-colorBgMenuItemSelected: ${sidebarBackgroundColor};`);
    cssProperties.push(`--fibery-color-colorBgMenuItemSelectedHover: ${sidebarBackgroundColor};`);
  }
  if (sidebarTextColor) {
    cssProperties.push(`--fibery-color-colorTextMenuItem: ${sidebarTextColor};`);
  }
  if (sidebarIconColor) {
    cssProperties.push(`--fibery-color-menuIconColor: ${sidebarIconColor};`);
  }

  // Custom properties (already filtered in customCssVariables)
  if (customCssVariables.trim()) {
    cssProperties.push(customCssVariables);
  }

  // Generate the final CSS
  style.textContent = `* {
  ${cssProperties.map((prop) => '  ' + prop).join('\n')}
}`;
}

fiberflowCustomBranding();
