function fiberflowAddViewNameToTabTitle() {
  function getTabTitle(url) {
    url = url || window.location.href;
    // Check if URL is a Fibery entity
    if (url.includes('#')) {
      // Extract view name from URL (before the first # and after the last /, dashes to spaces, remove trailing numbers)
      let viewName = url.split('#')[0].split('/').pop();
      viewName = viewName.replace(/-/g, ' ').trim();
      viewName = viewName.replace(/\d+$/, '');

      // Extract entity name from URL (last part after the last /, dashes to spaces, remove trailing numbers)
      let entityName = url.split('#')[1].split('/').pop();
      entityName = entityName.replace(/-/g, ' ').trim();
      entityName = entityName.replace(/\d+$/, '');

      if (!entityName) {
        return undefined;
      }

      const tabTitle = `${viewName} / ${entityName} | Fibery`;
      return tabTitle;
    }

    return undefined;
  }

  // Proxy document.title and intercept setter to update tab title
  const original = Object.getOwnPropertyDescriptor(Document.prototype, 'title');

  function hook_getter() {
    let title = original.get.call(this);
    return title;
  }

  function hook_setter(tabTitle) {
    const updatedTitle = getTabTitle() || tabTitle;
    return original.set.call(this, updatedTitle);
  }

  Object.defineProperty(Document.prototype, 'title', {
    get: hook_getter,
    set: hook_setter,
    enumerable: true,
    configurable: true,
  });
}

fiberflowAddViewNameToTabTitle();
