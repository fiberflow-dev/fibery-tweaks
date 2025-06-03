var fiberflowFavicon = document.getElementById("favicon");

function fiberflowSetEntityIconAsTabFavicon() {
  // Check for entity emoji
  var entityEmoji = (
    document.querySelector(".object_panel .entity_emoji_picker span") || {}
  ).textContent;

  if (entityEmoji) {
    favicon.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${entityEmoji}</text></svg>`;
    return;
  }

  // Check for entity avatar
  const entityAvatar = (
    document.querySelector(".object_panel .content_header .avatar img") || {}
  ).src;
  if (entityAvatar) {
    favicon.href = entityAvatar;
    return;
  }

  // Check for page emoji
  var pageEmoji = (
    document.querySelector(".core_content .view_icon .emoji") || {}
  ).textContent;

  if (pageEmoji) {
    favicon.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${pageEmoji}</text></svg>`;
    return;
  }

  // Check for page icon
  const pageIcon = document.querySelector(
    ".core_content .view_icon_picker svg"
  );
  // <svg xmlns="http://www.w3.org/2000/svg" class="ifqe6sa w1ky65ja i5oobv2 app_icon_with_fallback Icon" viewBox="0 0 24 24" style="--fibery-icon-color: #4a4a4af2; --fibery-icon-container-size: 28px; --fibery-icon-size: 32px;"><use href="/images/app-icons/smile-beam.svg#smile-beam" class="app_icon_with_fallback"></use></svg>
  if (pageIcon) {
    const pageIconPath = pageIcon.querySelector("use").getAttribute("href");
    favicon.href = `${window.location.origin}${pageIconPath}`;
    return;
  }

  // Reset to default favicon
  favicon.href = "https://assets-temp.fibery.io/images/favicon.svg";
}

var fiberflowNavigateTimer = setTimeout(() => {
  fiberflowSetEntityIconAsTabFavicon();
}, 500);

// Check for emoji when the URL changes
window.navigation.addEventListener("navigate", () => {
  setTimeout(() => {
    // Wait until all fields are loaded, reset timer if navigating during timeout
    if (fiberflowNavigateTimer) {
      clearTimeout(fiberflowNavigateTimer);
    }

    fiberflowNavigateTimer = setTimeout(() => {
      fiberflowSetEntityIconAsTabFavicon();
    }, 500);
    fiberflowSetEntityIconAsTabFavicon();
  });
});
