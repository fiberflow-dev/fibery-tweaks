# Contributing to Fibery Tweaks

Thank you for your interest in contributing to Fibery Tweaks! This guide will walk you through the process of creating and submitting your own tweak.

## What is a Fibery Tweak?

A Fibery Tweak is a small customization that enhances the look, feel, or behavior of Fibery workspaces. Tweaks can include:

- CSS styling changes
- JavaScript functionality enhancements
- Custom icons for visual identification

## Getting Started

### Prerequisites

- Fork this repository
- Clone your forked repository locally
- Basic knowledge of CSS and/or JavaScript

### Repository Structure

Each tweak lives in its own directory under `fibery-tweaks/` with the following structure:

```
fibery-tweaks/
├── your-tweak-name/
│   ├── README.md          # Required: Name and description
│   ├── style.css          # Optional: CSS styling
│   ├── index.js           # Optional: JavaScript functionality
│   └── favicon.svg        # Optional: Custom icon
```

## Step-by-Step Contribution Process

### Step 1: Create Your Tweak Directory

1. Navigate to the `fibery-tweaks/` directory
2. Create a new directory with a descriptive, kebab-case name for your tweak:
   ```bash
   mkdir fibery-tweaks/your-tweak-name
   ```

### Step 2: Create the README.md (Required)

Every tweak must have a `README.md` file with the following format:

```markdown
# Your Tweak Name

A brief description of what your tweak does and how it enhances the Fibery experience.
```

**Example:**

```markdown
# Better Button Styling

Improves the visual appearance of buttons with modern rounded corners and hover effects.
```

### Step 3: Add Your Styling (Optional)

If your tweak includes CSS styling, create a `style.css` file:

```css
/* Target specific Fibery elements */
.your-target-selector {
  /* Your custom styles */
  property: value;
}
```

**Best Practices:**

- Use specific CSS selectors to avoid conflicts
- Test your styles in different Fibery views
- Consider responsive design
- Use CSS custom properties when possible

**Example:**

```css
.calendar_panel .calendar_event .card-container-title-visible {
  flex-direction: column;
}

.calendar_panel .calendar_event .card_container {
  min-width: 0px;
  max-width: 100%;
  flex-wrap: wrap;
}
```

### Step 4: Add JavaScript Functionality (Optional)

If your tweak requires JavaScript functionality, create an `index.js` file:

```javascript
function yourTweakFunction() {
  const tweakId = document.currentScript.getAttribute("data-fibery-tweak-id");

  // Your tweak logic here
  // Access parameters if needed:
  // const parameters = JSON.parse(
  //   document.currentScript.getAttribute("data-fibery-tweak-parameters")
  // );

  // Your implementation
}

// Execute your function
yourTweakFunction();
```

**Best Practices:**

- Wrap your code in a function to avoid global scope pollution
- Use the provided `tweakId` for element identification
- Handle parameters if your tweak is configurable
- Test thoroughly in different Fibery contexts

### Step 5: Add a Custom Icon (Optional)

Create a `favicon.svg` file with your custom icon:

```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- Your SVG path here -->
</svg>
```

**Icon Guidelines:**

- Use SVG format for scalability
- Keep it simple and recognizable at small sizes
- Viewbox should typically be `0 0 24 24`

### Step 6: Test Your Tweak

Before submitting, test your tweak:

1. Install the Fiberflow Chrome extension
2. Load your tweak files locally
3. Test in multiple Fibery views and scenarios
4. Verify it doesn't conflict with other tweaks
5. Check browser console for any errors

### Step 7: Submit Your Contribution

1. **Commit your changes:**

   ```bash
   git add fibery-tweaks/your-tweak-name/
   git commit -m "Add: your-tweak-name tweak"
   ```

2. **Push to your fork:**

   ```bash
   git push origin main
   ```

3. **Create a Pull Request:**
   - Go to your forked repository on GitHub
   - Click "New Pull Request"
   - Provide a clear title and description
   - Include screenshots if your tweak has visual changes

## Common Patterns and Tips

### CSS Targeting

- Use specific class selectors from Fibery's interface
- Avoid overly broad selectors that might affect unintended elements
- Use browser dev tools to inspect and identify the right selectors

### JavaScript Integration

- Always check if elements exist before manipulating them
- Use event listeners for dynamic content
- Clean up after your tweak if needed

## Need Help?

- Check existing tweaks for examples and patterns
- Open an issue for questions or discussion
- Write me a private message in the [Fibery Community](https://community.fibery.io/u/derbenoo)
