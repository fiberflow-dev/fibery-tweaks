function fiberflowCustomBranding() {
  const tweakId = document.currentScript.getAttribute("data-fibery-tweak-id");

  // Parse parameters
  const parameters = JSON.parse(
    document.currentScript.getAttribute("data-fibery-tweak-parameters")
  );

  // Basic
  const basic = parameters.basic || {};
  const textColor = basic.textColor;
  const linkColor = basic.linkColor;
  const mainBackgroundColor = basic.mainBackgroundColor;
  const panelContentBackgroundColor = basic.panelContentBackgroundColor;

  // Font family
  const fontFamily = [
    (basic.fontFamily || "").trim(),
    "Inter Variable",
    "SF Pro Display",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI Variable Display",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Open Sans",
    "Helvetica Neue",
    "sans-serif",
  ]
    .filter(Boolean)
    .join(",");

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
      if (item.variableName.startsWith("--")) {
        return `${item.variableName}: ${item.color};`;
      }
      return `--${item.variableName}: ${item.color};`;
    })
    .join("\n");

  // Update content of this fibery tweaks css style tag
  var style = document.querySelector(
    `style[data-fibery-tweak-id="${tweakId}"]`
  );
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("data-fibery-tweak-id", tweakId);
    style.setAttribute("data-fibery-tweak-filename", "custom-branding.css");
    document.head.appendChild(style);
  }

  style.textContent = `* {
    /* Basic */
    font-family: ${fontFamily} !important;
    --fibery-color-textColor: ${textColor};
    --fibery-color-linkColor: ${linkColor};
    --fibery-color-mainBg: ${mainBackgroundColor};
    --fibery-color-panelBg: ${panelContentBackgroundColor};
    --fibery-color-panelContentBg: ${panelContentBackgroundColor};
  
  
    /* Button */
    --fibery-color-colorTextButtonSolidAccent: ${buttonTextColor};
    --fibery-color-colorBgButtonSolidAccentDefault: ${buttonBackgroundColor};
    --fibery-color-colorTextButtonSolidDestructive: ${buttonDestructiveTextColor};
    --fibery-color-colorBgButtonSolidDestructiveDefault: ${buttonDestructiveBackgroundColor};
  
    /* Sidebar */
    --fibery-color-menuBg: ${sidebarBackgroundColor};
    --fibery-color-colorTextMenuItem: ${sidebarTextColor};
    --fibery-color-menuIconColor: ${sidebarIconColor};
    --fibery-color-colorBgMenuItemHover: ${sidebarBackgroundColor};
    --fibery-color-colorBgMenuItemSelected: ${sidebarBackgroundColor};
    --fibery-color-colorBgMenuItemSelectedHover: ${sidebarBackgroundColor};
  
    /* Custom */
    ${customCssVariables}
  }`;
}

fiberflowCustomBranding();
