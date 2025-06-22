function fiberflowSmallerTimePickerInterval() {
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters'));

  // Parse what time interval the user wishes (default to 30 minutes if not specified)
  let intervalMinutes = 30;
  if (parameters.timeslot) {
    const match = parameters.timeslot.match(/(\d+)/);
    if (match) {
      intervalMinutes = parseInt(match[1]);
    }
  }

  // Check if the user has clicked on a date so that a date picker has been opened.
  const popupContainer = document.getElementById('popup-container');

  popupContainer.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (!event.target.classList.contains('date_range_input') && !event.target.classList.contains('single_date_input')) {
      return;
    }

    // Check if the cursor is inside the time portion
    const inputElement = event.target;
    let cursorPosition = inputElement.selectionStart;

    // If entire input is selected (common behavior), calculate actual click position
    if (cursorPosition === 0 && inputElement.selectionEnd === inputElement.value.length) {
      // Use browser's built-in APIs to get accurate cursor position from mouse coordinates
      if (document.caretPositionFromPoint) {
        const caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);
        if (caretPosition && caretPosition.offsetNode === inputElement) {
          cursorPosition = caretPosition.offset;
        }
      } else if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        if (range && range.startContainer === inputElement) {
          cursorPosition = range.startOffset;
        }
      } else {
        // Fallback: create a temporary element to measure text width accurately
        const tempSpan = document.createElement('span');
        const inputStyles = window.getComputedStyle(inputElement);
        tempSpan.style.font = inputStyles.font;
        tempSpan.style.fontSize = inputStyles.fontSize;
        tempSpan.style.fontFamily = inputStyles.fontFamily;
        tempSpan.style.fontWeight = inputStyles.fontWeight;
        tempSpan.style.letterSpacing = inputStyles.letterSpacing;
        tempSpan.style.position = 'absolute';
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.whiteSpace = 'pre';
        document.body.appendChild(tempSpan);

        const inputRect = inputElement.getBoundingClientRect();
        const clickX = event.clientX - inputRect.left;
        const paddingLeft = parseFloat(inputStyles.paddingLeft) || 0;
        const targetWidth = clickX - paddingLeft;

        // Binary search to find the character position
        let left = 0;
        let right = inputElement.value.length;

        while (left < right) {
          const mid = Math.floor((left + right) / 2);
          tempSpan.textContent = inputElement.value.substring(0, mid);
          const width = tempSpan.getBoundingClientRect().width;

          if (width < targetWidth) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }

        cursorPosition = left;
        document.body.removeChild(tempSpan);
      }

      // Ensure cursorPosition is within bounds
      cursorPosition = Math.max(0, Math.min(cursorPosition, inputElement.value.length));
    }

    if (cursorPosition < 0) return;

    // Get the input value and find all time patterns
    const dateStr = inputElement.value;
    const timeRegex = /(\d{2}:\d{2})/g;
    const timeMatches = [];
    let match;

    while ((match = timeRegex.exec(dateStr)) !== null) {
      timeMatches.push({
        value: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    if (timeMatches.length === 0) {
      closeTimePickerMenu();
      return;
    }

    // Find which time portion the cursor is in
    let targetTimeMatch = null;
    for (const timeMatch of timeMatches) {
      if (cursorPosition >= timeMatch.startIndex && cursorPosition <= timeMatch.endIndex) {
        targetTimeMatch = timeMatch;
        break;
      }
    }

    if (targetTimeMatch) {
      // Open the time picker
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openTimePickerMenu(inputElement, targetTimeMatch.startIndex, targetTimeMatch.endIndex);
    } else {
      closeTimePickerMenu();
    }
  });

  function openTimePickerMenu(inputElement, timeStartIndex, timeEndIndex) {
    // Close existing menu if any
    closeTimePickerMenu();

    // Generate time slots based on interval
    const timeSlots = generateTimeSlots(intervalMinutes);

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.id = 'fiberflow-time-picker-container';
    iframeContainer.style.cssText = `
    position: absolute;
    z-index: 100000;
    border: none;
    background: transparent;
    pointer-events: auto;
    box-shadow: var(--fibery-color-shadowPopup);
    border-radius: 4px;
    overflow: hidden;
  `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'fiberflow-time-picker-iframe';
    iframe.style.cssText = `
    width: 100px;
    height: 300px;
    border: none;
    background: transparent;
  `;

    // Position the container relative to the input and time portion
    const inputRect = inputElement.getBoundingClientRect();
    const charWidth = 8; // Approximate character width
    iframeContainer.style.left = `${inputRect.left + timeStartIndex * charWidth}px`;
    iframeContainer.style.top = `${inputRect.bottom + 2}px`;

    // Add iframe to container
    iframeContainer.appendChild(iframe);

    // Add container to document
    const popContainer = document.getElementById('popup-container');
    popContainer.appendChild(iframeContainer);

    // Wait for iframe to load and then populate it
    iframe.onload = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Set up iframe document
      iframeDoc.open();
      iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              padding-left: 6px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              background: white;
              border-radius: 4px;
              width: 100%;
              height: 100%;
              overflow-y: auto;
              overflow-x: hidden;
              box-sizing: border-box;
            }
            .time-slot {
              width: 100%;
              height: 32px;
              padding: 0 8px;
              border: none;
              background: none;
              border-radius: 4px;
              cursor: pointer;
              text-align: left;
              font-size: 14px;
              line-height: 32px;
              display: block;
              box-sizing: border-box;
              transition: background-color 50ms ease-in-out;
            }
            .time-slot:hover {
              background: #f0f0f0;
            }
            .time-slot.current-time {
              background: #e3f2fd;
            }
            .time-slot.current-time:hover {
              background: #bbdefb;
            }
            /* Scrollbar styling */
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #ffffff;
            }
            ::-webkit-scrollbar-thumb {
              background: #cccccc;
              border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #999999;
            }
          </style>
        </head>
        <body>
          <div id="time-picker-menu"></div>
        </body>
      </html>
    `);
      iframeDoc.close();

      const menu = iframeDoc.getElementById('time-picker-menu');

      // Get time from the specific portion that was clicked to highlight and scroll to
      const currentTimeString = inputElement.value.substring(timeStartIndex, timeEndIndex);
      let inputHours = 0;
      let inputMinutes = 0;

      if (currentTimeString && currentTimeString.match(/\d{2}:\d{2}/)) {
        [inputHours, inputMinutes] = currentTimeString.split(':').map(Number);
      }

      const inputTotalMinutes = inputHours * 60 + inputMinutes;

      // Find the closest time slot to current time
      let closestTimeSlot = null;
      let closestTimeDiff = Infinity;

      timeSlots.forEach((timeSlot) => {
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const slotTotalMinutes = hours * 60 + minutes;
        const diff = Math.abs(slotTotalMinutes - inputTotalMinutes);

        if (diff < closestTimeDiff) {
          closestTimeDiff = diff;
          closestTimeSlot = timeSlot;
        }
      });

      let currentTimeButton = null;

      // Create time slot buttons in the iframe
      timeSlots.forEach((timeSlot) => {
        const button = iframeDoc.createElement('button');
        button.textContent = timeSlot;
        button.className = 'time-slot';

        // Highlight current time slot
        if (timeSlot === closestTimeSlot) {
          button.classList.add('current-time');
          currentTimeButton = button;
        }

        // Prevent focus loss on mousedown
        button.addEventListener('mousedown', (event) => {
          event.preventDefault();
        });

        // Click handler - this will be isolated within the iframe
        button.addEventListener('click', () => {
          handleTimeSlotClick(inputElement, timeSlot, timeStartIndex, timeEndIndex);
        });

        menu.appendChild(button);
      });

      // Adjust iframe height based on content
      const contentHeight = Math.min(300, menu.scrollHeight);
      iframe.style.height = `${contentHeight}px`;

      // Scroll to current time after a brief delay to ensure content is rendered
      if (currentTimeButton) {
        currentTimeButton.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    };

    // Set iframe src to trigger onload
    iframe.src = 'about:blank';

    // Close menu when clicking outside the iframe container, pressing Escape, or input loses focus
    setTimeout(() => {
      const handleOutsideClick = (event) => {
        if (!iframeContainer.contains(event.target)) {
          closeTimePickerMenu();
          cleanup();
        }
      };

      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          closeTimePickerMenu();
          cleanup();
        }
      };

      const handleInputBlur = (event) => {
        // Small delay to allow time for clicking on time slots
        setTimeout(() => {
          if (document.getElementById('fiberflow-time-picker-container')) {
            closeTimePickerMenu();
            cleanup();
          }
        }, 150);
      };

      const cleanup = () => {
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscapeKey);
        inputElement.removeEventListener('blur', handleInputBlur);
      };

      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
      inputElement.addEventListener('blur', handleInputBlur);
    }, 100);
  }

  function closeTimePickerMenu() {
    const existingContainer = document.getElementById('fiberflow-time-picker-container');
    if (existingContainer) {
      existingContainer.remove();
    }
  }

  function generateTimeSlots(intervalMinutes) {
    const slots = [];
    const totalMinutes = 24 * 60; // 24 hours

    for (let minutes = 0; minutes < totalMinutes; minutes += intervalMinutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeSlot = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      slots.push(timeSlot);
    }

    return slots;
  }

  function handleTimeSlotClick(inputElement, timeSlot, timeStartIndex, timeEndIndex) {
    closeTimePickerMenu();

    // Focus the input element first
    inputElement.focus();

    // Select the time portion that needs to be replaced
    inputElement.setSelectionRange(timeStartIndex, timeEndIndex);

    // Simulate typing the new time slot character by character
    simulateTyping(inputElement, timeSlot);
  }

  function simulateTyping(inputElement, text) {
    // Get the current selection to replace it
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
    const currentValue = inputElement.value;

    // Replace the selected portion
    const newValue = currentValue.substring(0, selectionStart) + text + currentValue.substring(selectionEnd);

    // Try to access React's internal value setter directly
    const reactDescriptor = Object.getOwnPropertyDescriptor(inputElement, 'value');
    const prototypeDescriptor =
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(inputElement), 'value') ||
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

    // Set the value using React's internal mechanisms
    if (prototypeDescriptor && prototypeDescriptor.set) {
      prototypeDescriptor.set.call(inputElement, newValue);
    } else {
      inputElement.value = newValue;
    }

    // Set cursor position after the inserted text
    const newCursorPosition = selectionStart + text.length;
    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);

    // Create a more sophisticated input event that React will recognize
    const nativeInputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    // Set up the event to look like a real user input
    Object.defineProperty(nativeInputEvent, 'target', {
      writable: false,
      value: inputElement,
    });

    Object.defineProperty(nativeInputEvent, 'currentTarget', {
      writable: false,
      value: inputElement,
    });

    Object.defineProperty(nativeInputEvent, 'nativeEvent', {
      writable: false,
      value: nativeInputEvent,
    });

    // Trigger input event
    inputElement.dispatchEvent(nativeInputEvent);

    // Also create a synthetic React event
    const syntheticEvent = {
      target: inputElement,
      currentTarget: inputElement,
      type: 'input',
      nativeEvent: nativeInputEvent,
      preventDefault: () => {},
      stopPropagation: () => {},
      persist: () => {},
    };

    // Try to find React event listeners and call them directly
    for (const key of Object.keys(inputElement)) {
      if (key.startsWith('__reactEventHandlers') || key.startsWith('__reactProps')) {
        const handlers = inputElement[key];
        if (handlers && handlers.onChange) {
          try {
            handlers.onChange(syntheticEvent);
          } catch (e) {
            console.log('Direct onChange call failed:', e);
          }
        }
        if (handlers && handlers.onInput) {
          try {
            handlers.onInput(syntheticEvent);
          } catch (e) {
            console.log('Direct onInput call failed:', e);
          }
        }
      }
    }

    // Final attempt: Create change event
    const changeEvent = new Event('change', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(changeEvent, 'target', {
      writable: false,
      value: inputElement,
    });

    Object.defineProperty(changeEvent, 'currentTarget', {
      writable: false,
      value: inputElement,
    });

    inputElement.dispatchEvent(changeEvent);

    // Force React to re-render by triggering focus/blur cycle
    inputElement.blur();
    setTimeout(() => {
      inputElement.focus();

      // Dispatch one more input event after focus
      const finalInputEvent = new Event('input', { bubbles: true });
      Object.defineProperty(finalInputEvent, 'target', { value: inputElement });
      inputElement.dispatchEvent(finalInputEvent);
    }, 0);
  }
}

fiberflowSmallerTimePickerInterval();
