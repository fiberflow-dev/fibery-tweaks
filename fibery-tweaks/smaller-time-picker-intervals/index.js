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
    const cursorPosition = inputElement.selectionStart;
    if (!cursorPosition) return;

    // Get the input value and find time pattern
    const dateStr = inputElement.value;
    const timeMatch = dateStr.match(/(\d{2}:\d{2})/);
    if (!timeMatch) {
      closeTimePickerMenu();
      return;
    }

    const timeStartIndex = timeMatch.index;
    if (!timeStartIndex) {
      closeTimePickerMenu();
      return;
    }
    const timeEndIndex = timeStartIndex + timeMatch[0].length;

    if (cursorPosition >= timeStartIndex && cursorPosition <= timeEndIndex) {
      // Open the time picker
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openTimePickerMenu(inputElement, timeStartIndex);
    } else {
      closeTimePickerMenu();
    }
  });

  function openTimePickerMenu(inputElement, timeStartIndex) {
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
    width: 120px;
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
              padding: 4px 8px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              background: white;
              border-radius: 4px;
              max-height: 300px;
              overflow-y: auto;
            }
            .time-slot {
              width: 100%;
              padding: 4px 8px;
              border: none;
              background: none;
              border-radius: 4px;
              cursor: pointer;
              text-align: left;
              font-size: 14px;
              line-height: 20px;
              display: block;
              margin: 1px 0;
            }
            .time-slot:hover {
              background: #f0f0f0;
            }
            .time-slot.current-time {
              background: #e3f2fd;
              color: #1976d2;
              font-weight: bold;
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

      // Get time from input field to highlight and scroll to
      const inputTime = inputElement.value.match(/(\d{2}:\d{2})/);
      let inputHours = 0;
      let inputMinutes = 0;

      if (inputTime) {
        [inputHours, inputMinutes] = inputTime[0].split(':').map(Number);
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
          handleTimeSlotClick(inputElement, timeSlot);
        });

        menu.appendChild(button);
      });

      // Adjust iframe height based on content
      const contentHeight = Math.min(300, menu.scrollHeight + 16); // 16px for padding
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

  function handleTimeSlotClick(inputElement, timeSlot) {
    closeTimePickerMenu();

    // Get current input value
    const currentValue = inputElement.value;

    // Replace the time portion with the selected time
    const timeMatch = currentValue.match(/(\d{2}:\d{2})/);
    if (timeMatch) {
      const newValue = currentValue.replace(/\d{2}:\d{2}/, timeSlot);

      // Refocus
      inputElement.focus();

      // Use React's way of setting input values
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(inputElement, newValue);

      // Create more comprehensive events that React will recognize
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });

      // Set the target property to make it look more like a real user event
      Object.defineProperty(inputEvent, 'target', {
        writable: false,
        value: inputElement,
      });

      Object.defineProperty(inputEvent, 'currentTarget', {
        writable: false,
        value: inputElement,
      });

      // Dispatch input event first (for real-time updates)
      inputElement.dispatchEvent(inputEvent);

      // Create and dispatch change event
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

      // Also try triggering a blur and focus to simulate user interaction
      inputElement.blur();
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  }
}

fiberflowSmallerTimePickerInterval();
