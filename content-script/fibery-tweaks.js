console.log('[Fiberflow] Fibery tweaks content script loaded');

/***********************************************************
 * Apply Fibery Tweaks START                               *
 ***********************************************************/
// Helper function to flatten nested parameters into a dictionary with dot notation keys
function extractFiberyTweakCssVariables(parameters, prefix = '', result = {}) {
  Object.keys(parameters || {}).forEach((key) => {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (typeof parameters[key] === 'object' && parameters[key] !== null && !Array.isArray(parameters[key])) {
      // Recursively process nested objects
      extractFiberyTweakCssVariables(parameters[key], newKey, result);
    } else {
      // Store the variable name with the '--' prefix
      result[`--${newKey}`] = parameters[key];
    }
  });
  return result;
}

function replaceFiberyTweakCssVariables(cssContent, parameters) {
  // Extract and flatten all variables from the parameters object
  const variables = extractFiberyTweakCssVariables(parameters);

  // Replace CSS variable references (e.g., var(--variableName))
  return cssContent.replace(/var\((--[a-zA-Z0-9_.-]+)\)/g, (match, varName) => {
    // Look up the variable name (e.g., --variableName) in the flattened map
    // If found, return the replacement value, otherwise return the original match
    return variables.hasOwnProperty(varName) ? variables[varName] : match;
  });
}

async function applyFiberyTweakInstallmentCssFile(cssFile, fiberyTweakInstallment, fiberyTweakElements) {
  // Check if the style already exists by file ID
  var style = fiberyTweakElements.find((element) => element.getAttribute('data-fibery-tweak-file-id') === cssFile.id);

  if (!style) {
    style = document.createElement('style');
    document.head.appendChild(style);
  }

  style.textContent = replaceFiberyTweakCssVariables(cssFile.content, fiberyTweakInstallment.parameters);
  style.setAttribute('data-fibery-tweak-id', fiberyTweakInstallment.id);
  style.setAttribute('data-fibery-tweak-file-id', cssFile.id);
  style.setAttribute('data-fibery-tweak-filename', cssFile.name || fiberyTweakInstallment.name + '.css');
}

async function applyFiberyTweakInstallmentJsFile(jsFile, fiberyTweakInstallment, fiberyTweakElements) {
  // Check if the script already exists by file ID
  var script = fiberyTweakElements.find((element) => element.getAttribute('data-fibery-tweak-file-id') === jsFile.id);
  if (script) {
    script.remove();
  }

  script = document.createElement('script');
  document.head.appendChild(script);

  script.src = chrome.runtime.getURL('assets/tweaks/' + jsFile.name);
  script.setAttribute('data-fibery-tweak-id', fiberyTweakInstallment.id);
  script.setAttribute('data-fibery-tweak-file-id', jsFile.id);
  script.setAttribute('data-fibery-tweak-filename', jsFile.name || fiberyTweakInstallment.name + '.js');
  script.setAttribute('data-fibery-tweak-parameters', JSON.stringify(fiberyTweakInstallment.parameters));
}

async function applyFiberyTweakInstallment(fiberyTweakInstallment, fiberyTweakElements) {
  // CSS files
  for (const file of fiberyTweakInstallment.files) {
    if (file.type === 'css') {
      await applyFiberyTweakInstallmentCssFile(file, fiberyTweakInstallment, fiberyTweakElements);
    } else if (file.type === 'js') {
      await applyFiberyTweakInstallmentJsFile(file, fiberyTweakInstallment, fiberyTweakElements);
    }
  }
}
////////////////////////////////////////////////////////////
// Apply Fibery Tweaks END                                //
////////////////////////////////////////////////////////////

/***********************************************************
 * Load Fibery Tweaks START                                *
 ***********************************************************/
// Load fibery tweaks state from extension storage
async function loadFiberyTweaksStateFromStorage() {
  try {
    const result = await chrome.storage.local.get('fiberflow_fibery_tweaks');
    const state = result['fiberflow_fibery_tweaks'];

    // Also load workspace tweaks (might not exist)
    const workspaceName = window.location.hostname;
    const workspaceStateKey = `fiberflow_fibery_tweaks_workspace_${workspaceName}`;
    const workspaceState = await chrome.storage.local.get(workspaceStateKey);
    const workspaceTweaks = workspaceState[workspaceStateKey] || {};
    const fiberyTweakWorkspaceInstallments = workspaceTweaks.fiberyTweakWorkspaceInstallments || [];

    return {
      allTweaksDisabled: !!state?.allTweaksDisabled,
      fiberyTweakInstallments: state?.fiberyTweakInstallments || [],
      fiberyTweakWorkspaceInstallments: fiberyTweakWorkspaceInstallments,
    };
  } catch (err) {
    console.error('[Fiberflow] Error loading fibery tweaks state from storage', err);
    return {
      allTweaksDisabled: false,
      fiberyTweakInstallments: [],
      fiberyTweakWorkspaceInstallments: [],
    };
  }
}

async function loadFiberyTweakWorkspaceInstallmentsFromServer() {
  const workspaceName = window.location.hostname;
  const subdomain = workspaceName.split('.')[0];
  const baseUrl = `https://${subdomain}.fiberflow.local`;
  // const baseUrl = `https://${subdomain}.fiberflow.io`;

  const response = await fetch(`${baseUrl}/api/getFiberyTweakInstallments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workspaceNames: [workspaceName],
    }),
  });
  const data = await response.json();
  const fiberyTweakInstallments = data.fiberyTweakInstallments;

  // Store workspace-specific fibery tweak installments
  const workspaceStateKey = `fiberflow_fibery_tweaks_workspace_${workspaceName}`;
  await chrome.storage.local.set({
    [workspaceStateKey]: {
      fiberyTweakWorkspaceInstallments: fiberyTweakInstallments || [],
    },
  });

  // Refresh tweaks after loading from server
  await synchronizeFiberyTweakInstallments();
}
////////////////////////////////////////////////////////////
// Load Fibery Tweaks END                                  //
////////////////////////////////////////////////////////////

/***********************************************************
 * Synchronize Fibery Tweaks START                        *
 ***********************************************************/
function isFiberyTweakInstallmentActive(fiberyTweakInstallment) {
  // Check if enabled
  if (fiberyTweakInstallment.disabled) {
    return false;
  }

  // Check if conditions are met

  return true;
}

async function synchronizeFiberyTweakInstallments() {
  const state = await loadFiberyTweaksStateFromStorage();

  // Get all fibery tweak DOM elements
  const fiberyTweakElements = Array.from(document.querySelectorAll('[data-fibery-tweak-id]'));

  const activeGlobalFiberyTweakInstallments = state.fiberyTweakInstallments.filter((fiberyTweakInstallment) => {
    return !state.allTweaksDisabled && isFiberyTweakInstallmentActive(fiberyTweakInstallment);
  });

  const activeFiberyTweakWorkspaceInstallments = state.fiberyTweakWorkspaceInstallments.filter(
    (fiberyTweakInstallment) => {
      return !state.allTweaksDisabled && isFiberyTweakInstallmentActive(fiberyTweakInstallment);
    },
  );

  // Workspace tweak installments override global tweak installments with the same listingId
  const activeFiberyTweakInstallments = [
    ...activeFiberyTweakWorkspaceInstallments,
    ...activeGlobalFiberyTweakInstallments,
  ]
    //  Remove duplicates
    .filter(
      (fiberyTweakInstallment, index, self) =>
        !fiberyTweakInstallment.listingId ||
        index === self.findIndex((t) => t.listingId === fiberyTweakInstallment.listingId),
    );

  // Install active tweaks
  for (const fiberyTweakInstallment of activeFiberyTweakInstallments.sort((a, b) => {
    return a.id.localeCompare(b.id);
  })) {
    await applyFiberyTweakInstallment(fiberyTweakInstallment, fiberyTweakElements);
  }

  // Remove inactive tweaks from the page
  for (const fiberyTweakElement of fiberyTweakElements) {
    if (
      !activeFiberyTweakInstallments.some(
        (installment) => installment.id === fiberyTweakElement.getAttribute('data-fibery-tweak-id'),
      )
    ) {
      fiberyTweakElement.remove();
    }
  }
}

/***********************************************************
 * Synchronize Fibery Tweaks END                           *
 ***********************************************************/

/***********************************************************
 * Initialize Fibery Tweaks START                          *
 ***********************************************************/
async function initializeFiberyTweaks() {
  // Register chrome storage change listener
  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    await synchronizeFiberyTweakInstallments();
  });

  // Initialize fibery tweaks
  await synchronizeFiberyTweakInstallments();
  await loadFiberyTweakWorkspaceInstallmentsFromServer();
}

initializeFiberyTweaks();

////////////////////////////////////////////////////////////
// Initialize Fibery Tweaks END                           //
////////////////////////////////////////////////////////////
