# Contributing to Fibery Tweaks

Thank you for your interest in contributing to Fibery Tweaks! This guide will walk you through the process of creating and submitting your own tweak.

## What is a Fibery Tweak?

A Fibery Tweak is a small customization that enhances the look, feel, or behavior of Fibery workspaces. Tweaks can include:

- CSS styling changes
- JavaScript functionality enhancements
- Custom icons for visual identification
- Configurable parameters for user customization

## Getting Started

### Prerequisites

- Fork this repository
- Clone your forked repository locally
- Basic knowledge of CSS and/or JavaScript
- Understanding of JSON schema format

### Repository Structure

Each tweak lives in its own directory under `fibery-tweaks/` with the following structure:

```
fibery-tweaks/
├── your-tweak-name/
│   ├── tweak.json         # Required: Tweak metadata and parameters
│   ├── README.md          # Required: Name and description
│   ├── style.css          # Optional: CSS styling
│   ├── index.js           # Optional: JavaScript functionality
│   ├── favicon.svg        # Required: Custom icon
│   └── screenshots/       # Optional: Screenshots directory
```

## Step-by-Step Contribution Process

### Step 1: Create Your Tweak Directory

1. Navigate to the `fibery-tweaks/` directory
2. Create a new directory with a descriptive, kebab-case name for your tweak:
   ```bash
   mkdir fibery-tweaks/your-tweak-name
   ```

### Step 2: Create the tweak.json (Required)

Every tweak must have a `tweak.json` file with the following structure:

```json
{
  "id": "12345678-1234-5678-9012-123456789012",
  "name": "Your Tweak Name",
  "author": "Your Name <your.email@example.com> (https://yourwebsite.com)",
  "description": "Brief description of what your tweak does",
  "version": "1.0.0",
  "keywords": ["keyword1", "keyword2"],
  "parameters": {},
  "parametersDef": {
    "id": "12345678-1234-5678-9012-123456789013",
    "type": "object",
    "properties": {}
  }
}
```

**Required Fields:**

- `id`: UUID v4 format (generate using online UUID generator)
- `name`: Human-readable name of your tweak
- `author`: Your name, email, and optional website
- `description`: Brief explanation of the tweak's functionality
- `version`: Semantic version (start with "1.0.0")
- `keywords`: Array of relevant keywords for categorization

**Optional Fields:**

- `parameters`: Default parameter values (empty object `{}` if no parameters)
- `parametersDef`: Parameter definitions for configurable tweaks

### Step 3: Add Parameters (If Configurable)

If your tweak needs user configuration, define parameters:

```json
{
  "parameters": {
    "width": 8,
    "color": "#ea8f90",
    "enabled": true
  },
  "parametersDef": {
    "id": "param-def-uuid",
    "type": "object",
    "properties": {
      "width": {
        "id": "width-param-uuid",
        "type": "number",
        "label": "Width",
        "position": 1
      },
      "color": {
        "id": "color-param-uuid",
        "type": "color",
        "label": "Color",
        "position": 2
      },
      "enabled": {
        "id": "enabled-param-uuid",
        "type": "boolean",
        "label": "Enable feature",
        "tooltip": "Toggle this feature on/off",
        "position": 3
      }
    }
  }
}
```

**Parameter Types:**

- `string`: Text input
- `number`: Numeric input
- `boolean`: Checkbox
- `color`: Color picker
- `enum`: Dropdown with options
- `array`: Array of items
- `object`: Nested object with properties
- `fibery-field`: Fibery field selector

**Parameter Definition Properties:**

- `id`: UUID v4 format (required)
- `type`: Parameter type (required)
- `label`: Display label for UI
- `tooltip`: Optional help text
- `position`: Order in UI
- `options`: Array of options (for enum type)
- `includeFieldTypes`: Field type restrictions (for fibery-field type)

### Step 4: Create the README.md (Required)

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

### Step 5: Add Your Styling (Optional)

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

### Step 6: Add JavaScript Functionality (Optional)

If your tweak requires JavaScript functionality, create an `index.js` file:

```javascript
function yourTweakFunction() {
  const tweakId = document.currentScript.getAttribute('data-fibery-tweak-id');

  // Access parameters if needed:
  const parameters = JSON.parse(document.currentScript.getAttribute('data-fibery-tweak-parameters') || '{}');

  // Your implementation using parameters
  const width = parameters.width || 8;
  const color = parameters.color || '#ea8f90';

  // Your tweak logic here
}

// Execute your function
yourTweakFunction();
```

**Best Practices:**

- Wrap your code in a function to avoid global scope pollution
- Use the provided `tweakId` for element identification
- Access parameters through the script attributes
- Test thoroughly in different Fibery contexts

### Step 7: Add a Custom Icon (Required)

Create a `favicon.svg` file with your custom icon:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="..." fill="#51616C"/>
</svg>
```

**Icon Guidelines:**

- Use SVG format for scalability
- Keep it simple and recognizable at small sizes
- Viewbox should be `0 0 24 24`
- Use `#51616C` as the default fill color

### Step 8: Validate Your tweak.json

Ensure your `tweak.json` follows the schema:

- All IDs must be valid UUIDs
- Parameter definitions must have required properties
- JSON syntax must be valid
- Required fields must be present

### Step 9: Test Your Tweak

Before submitting, test your tweak:

1. Install the Fiberflow Chrome extension
2. Load your tweak files locally
3. Test in multiple Fibery views and scenarios
4. Verify parameters work correctly (if applicable)
5. Check browser console for any errors

### Step 10: Submit Your Contribution

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

## Examples

### Simple CSS-only Tweak

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Hide Empty Collections",
  "author": "Fiberflow <fiberflow.io@gmail.com> (https://fiberflow.io)",
  "description": "Hide empty collections fields in the entity view.",
  "version": "1.0.0",
  "keywords": ["Collections", "Fields", "Entity View"],
  "parameters": {}
}
```

### Configurable JavaScript Tweak

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
  "name": "Better Timeline Today Marker",
  "author": "Fiberflow <fiberflow.io@gmail.com> (https://fiberflow.io)",
  "description": "Make the timeline today marker more visible.",
  "version": "1.0.0",
  "keywords": ["Timeline"],
  "parameters": {
    "width": 8,
    "color": "#ea8f90"
  },
  "parametersDef": {
    "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "type": "object",
    "properties": {
      "width": {
        "id": "d4e5f6a7-b8c9-0123-defa-456789012345",
        "type": "number",
        "label": "Indicator width",
        "position": 1
      },
      "color": {
        "id": "e5f6a7b8-c9d0-1234-efab-567890123456",
        "type": "color",
        "label": "Indicator color",
        "position": 2
      }
    }
  }
}
```

## Common Patterns and Tips

### UUID Generation

- Use an online UUID v4 generator for all IDs
- Each parameter definition needs a unique UUID
- Never reuse UUIDs across different tweaks

### Parameter Best Practices

- Keep parameter names descriptive
- Use appropriate types for each parameter
- Provide helpful tooltips for complex parameters
- Set sensible default values

### CSS Targeting

- Use specific class selectors from Fibery's interface
- Avoid overly broad selectors that might affect unintended elements
- Use browser dev tools to inspect and identify the right selectors

### JavaScript Integration

- Always check if elements exist before manipulating them
- Use event listeners for dynamic content
- Access parameters through the script attributes
- Clean up after your tweak if needed

## Schema Validation

Your `tweak.json` file is validated against our JSON schema. The schema enforces:

- UUID format for all IDs
- Required fields presence
- Correct parameter definition structure
- Valid parameter types and properties

## Need Help?

- Check existing tweaks for examples and patterns
- Review the `tweak-schema.json` file for the complete specification
- Open an issue for questions or discussion
- Write me a private message in the [Fibery Community](https://community.fibery.io/u/derbenoo)
