// Form Builder Admin - Extensible Vanilla JS + Tabbed Architecture
(function () {
  "use strict";

  // ShadCN UI Components (extensible)
  const UI = {
    // Button component
    Button: (props) => {
      const button = document.createElement("button");
      button.className = `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
        props.variant === "outline"
          ? "border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
          : "bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
      }`;
      button.textContent = props.children;
      if (props.onClick) button.addEventListener("click", props.onClick);
      if (props.disabled) button.disabled = props.disabled;
      return button;
    },

    // Input component
    Input: (props) => {
      const input = document.createElement("input");
      input.className =
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
      input.type = props.type || "text";
      input.value = props.value || "";
      input.placeholder = props.placeholder || "";
      if (props.onChange) input.addEventListener("input", props.onChange);
      return input;
    },

    // Label component
    Label: (props) => {
      const label = document.createElement("label");
      label.className =
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
      label.textContent = props.children;
      if (props.htmlFor) label.htmlFor = props.htmlFor;
      return label;
    },

    // Select component
    Select: (props) => {
      const select = document.createElement("select");
      select.className =
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
      if (props.onChange) select.addEventListener("change", props.onChange);

      props.options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.selected) optionElement.selected = true;
        select.appendChild(optionElement);
      });

      return select;
    },

    // Tab components
    Tabs: {
      container: (props) => {
        const tabs = document.createElement("div");
        tabs.className = "w-full";
        if (props.children) {
          if (Array.isArray(props.children)) {
            props.children.forEach((child) => tabs.appendChild(child));
          } else {
            tabs.appendChild(props.children);
          }
        }
        return tabs;
      },
      list: (props) => {
        const list = document.createElement("div");
        list.className =
          "flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground";
        if (props.children) {
          if (Array.isArray(props.children)) {
            props.children.forEach((child) => list.appendChild(child));
          } else {
            list.appendChild(props.children);
          }
        }
        return list;
      },
      trigger: (props) => {
        const trigger = document.createElement("button");
        trigger.className = `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          props.active
            ? "bg-background text-foreground shadow-sm"
            : "hover:bg-background hover:text-foreground"
        }`;
        trigger.textContent = props.children;
        trigger.dataset.value = props.value;
        if (props.onClick) trigger.addEventListener("click", props.onClick);
        return trigger;
      },
      content: (props) => {
        const content = document.createElement("div");
        content.className =
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
        content.dataset.value = props.value;
        if (props.children) {
          if (Array.isArray(props.children)) {
            props.children.forEach((child) => content.appendChild(child));
          } else {
            content.appendChild(props.children);
          }
        }
        return content;
      },
    },

    // Card components
    Card: {
      container: (props) => {
        const card = document.createElement("div");
        card.className =
          "rounded-lg border bg-card text-card-foreground shadow-sm";
        if (props.children) {
          if (Array.isArray(props.children)) {
            props.children.forEach((child) => card.appendChild(child));
          } else {
            card.appendChild(props.children);
          }
        }
        return card;
      },
      header: (props) => {
        const header = document.createElement("div");
        header.className = "flex flex-col space-y-1.5 p-6";
        if (props.children) {
          if (Array.isArray(props.children)) {
            props.children.forEach((child) => header.appendChild(child));
          } else {
            header.appendChild(props.children);
          }
        }
        return header;
      },
      title: (props) => {
        const title = document.createElement("h3");
        title.className = "text-2xl font-semibold leading-none tracking-tight";
        title.textContent = props.children;
        return title;
      },
      description: (props) => {
        const desc = document.createElement("p");
        desc.className = "text-sm text-muted-foreground";
        desc.textContent = props.children;
        return desc;
      },
      content: (props) => {
        const content = document.createElement("div");
        content.className = "p-6 pt-0";
        if (props.children) {
          if (Array.isArray(props.children)) {
            props.children.forEach((child) => content.appendChild(child));
          } else {
            content.appendChild(props.children);
          }
        }
        return content;
      },
    },
  };

  // Tab Manager - Handles tab switching
  class TabManager {
    constructor(container) {
      this.container = container;
      this.activeTab = "styling";
      this.tabs = new Map();
      this.init();
    }

    init() {
      this.createTabs();
      this.bindEvents();
      this.showTab(this.activeTab);
    }

    createTabs() {
      // Create tab list
      const tabList = UI.Tabs.list({
        children: [
          UI.Tabs.trigger({
            value: "styling",
            children: "Styling",
            active: this.activeTab === "styling",
            onClick: () => this.showTab("styling"),
          }),
          UI.Tabs.trigger({
            value: "layout",
            children: "Layout",
            active: this.activeTab === "layout",
            onClick: () => this.showTab("layout"),
          }),
          UI.Tabs.trigger({
            value: "advanced",
            children: "Advanced",
            active: this.activeTab === "advanced",
            onClick: () => this.showTab("advanced"),
          }),
        ],
      });

      // Create tab contents
      const tabContents = document.createElement("div");
      tabContents.className = "mt-4";

      // Styling Tab
      const stylingContent = UI.Tabs.content({
        value: "styling",
        children: this.createStylingTab(),
      });

      // Layout Tab
      const layoutContent = UI.Tabs.content({
        value: "layout",
        children: this.createLayoutTab(),
      });

      // Advanced Tab
      const advancedContent = UI.Tabs.content({
        value: "advanced",
        children: this.createAdvancedTab(),
      });

      // Store tab references
      this.tabs.set("styling", stylingContent);
      this.tabs.set("layout", layoutContent);
      this.tabs.set("advanced", advancedContent);

      // Add to container
      this.container.appendChild(tabList);
      this.container.appendChild(tabContents);
      tabContents.appendChild(stylingContent);
      tabContents.appendChild(layoutContent);
      tabContents.appendChild(advancedContent);
    }

    showTab(tabName) {
      // Update active tab
      this.activeTab = tabName;

      // Update tab triggers
      this.container.querySelectorAll("[data-value]").forEach((trigger) => {
        if (trigger.dataset.value === tabName) {
          trigger.classList.add(
            "bg-background",
            "text-foreground",
            "shadow-sm",
          );
          trigger.classList.remove(
            "hover:bg-background",
            "hover:text-foreground",
          );
        } else {
          trigger.classList.remove(
            "bg-background",
            "text-foreground",
            "shadow-sm",
          );
          trigger.classList.add("hover:bg-background", "hover:text-foreground");
        }
      });

      // Show/hide tab contents
      this.tabs.forEach((content, name) => {
        if (name === tabName) {
          content.style.display = "block";
        } else {
          content.style.display = "none";
        }
      });
    }

    bindEvents() {
      // Add any additional event bindings here
    }

    // Tab content creators - can be extended
    createStylingTab() {
      return new StylingTab().render();
    }

    createLayoutTab() {
      return new LayoutTab().render();
    }

    createAdvancedTab() {
      return new AdvancedTab().render();
    }
  }

  // Styling Tab - Form Preset functionality
  class StylingTab {
    constructor() {
      this.preset = "classic";
      this.options = {};
      this.presets = window.leanFormsPreset?.presets || {};
    }

    render() {
      const container = document.createElement("div");
      container.className = "space-y-6";

      // Preset Selection
      container.appendChild(this.createPresetSection());

      // Custom Options
      container.appendChild(this.createCustomSection());

      // Preview
      container.appendChild(this.createPreviewSection());

      return container;
    }

    createPresetSection() {
      const section = document.createElement("div");
      section.className = "mb-6";

      const title = document.createElement("h4");
      title.className = "text-sm font-medium mb-3";
      title.textContent = "Style Preset";

      const select = UI.Select({
        options: Object.entries(this.presets).map(([key, preset]) => ({
          value: key,
          label: `${preset.name} - ${preset.description}`,
          selected: key === this.preset,
        })),
        onChange: (e) => this.handlePresetChange(e.target.value),
      });

      section.appendChild(title);
      section.appendChild(select);

      return section;
    }

    createCustomSection() {
      const section = document.createElement("div");
      section.className = "space-y-4";

      // Colors Section
      const colorsTitle = document.createElement("h4");
      colorsTitle.className = "text-sm font-medium mb-3";
      colorsTitle.textContent = "Customize Colors";

      const colorGrid = document.createElement("div");
      colorGrid.className = "grid grid-cols-2 gap-3";

      const colorFields = [
        {
          key: "primary_color",
          label: "Primary",
          value: this.options.primary_color || "#0073aa",
        },
        {
          key: "placeholder_color",
          label: "Placeholder",
          value: this.options.placeholder_color || "#666666",
        },
        {
          key: "button_color",
          label: "Button Text",
          value: this.options.button_color || "#ffffff",
        },
        {
          key: "primary_bg_color",
          label: "Primary BG",
          value: this.options.primary_bg_color || "#ffffff",
        },
        {
          key: "input_bg_color",
          label: "Input BG",
          value: this.options.input_bg_color || "#ffffff",
        },
        {
          key: "button_bg_color",
          label: "Button BG",
          value: this.options.button_bg_color || "#0073aa",
        },
      ];

      colorFields.forEach((field) => {
        const fieldContainer = document.createElement("div");
        fieldContainer.className = "space-y-2";

        const label = UI.Label({ children: field.label });
        const input = UI.Input({
          type: "color",
          value: field.value,
          onChange: (e) => this.handleOptionChange(field.key, e.target.value),
        });

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        colorGrid.appendChild(fieldContainer);
      });

      // Typography Section
      const typographyTitle = document.createElement("h4");
      typographyTitle.className = "text-sm font-medium mb-3 mt-6";
      typographyTitle.textContent = "Customize Typography";

      const typographyGrid = document.createElement("div");
      typographyGrid.className = "grid grid-cols-2 gap-3";

      const typographyFields = [
        {
          key: "label_font_size",
          label: "Label (px)",
          value: this.options.label_font_size || 14,
        },
        {
          key: "h1_font_size",
          label: "H1 (px)",
          value: this.options.h1_font_size || 24,
        },
        {
          key: "h2_font_size",
          label: "H2 (px)",
          value: this.options.h2_font_size || 20,
        },
        {
          key: "h3_font_size",
          label: "H3 (px)",
          value: this.options.h3_font_size || 18,
        },
        {
          key: "p_font_size",
          label: "Paragraph (px)",
          value: this.options.p_font_size || 16,
        },
      ];

      typographyFields.forEach((field) => {
        const fieldContainer = document.createElement("div");
        fieldContainer.className = "space-y-2";

        const label = UI.Label({ children: field.label });
        const input = UI.Input({
          type: "number",
          value: field.value,
          onChange: (e) =>
            this.handleOptionChange(field.key, parseInt(e.target.value)),
        });

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        typographyGrid.appendChild(fieldContainer);
      });

      section.appendChild(colorsTitle);
      section.appendChild(colorGrid);
      section.appendChild(typographyTitle);
      section.appendChild(typographyGrid);

      return section;
    }

    createPreviewSection() {
      const section = document.createElement("div");
      section.className = "mt-6 p-4 bg-gray-50 rounded-lg";

      const title = document.createElement("h4");
      title.className = "text-sm font-medium mb-3";
      title.textContent = "Current Preset";

      const presetName = document.createElement("p");
      presetName.className = "text-lg font-semibold text-blue-600";
      presetName.textContent = this.presets[this.preset]?.name || "Unknown";

      const presetDesc = document.createElement("p");
      presetDesc.className = "text-sm text-gray-600";
      presetDesc.textContent = this.presets[this.preset]?.description || "";

      section.appendChild(title);
      section.appendChild(presetName);
      section.appendChild(presetDesc);

      return section;
    }

    handlePresetChange(newPreset) {
      this.preset = newPreset;

      // Update options with preset defaults
      if (this.presets[newPreset]) {
        this.options = { ...this.presets[newPreset].defaults };
      }

      // Update hidden fields
      this.updateHiddenFields();

      // Re-render
      this.render();
    }

    handleOptionChange(key, value) {
      this.options[key] = value;
      this.updateHiddenFields();
    }

    updateHiddenFields() {
      // Create or update hidden fields for form submission
      const form = document.querySelector("#post");
      if (!form) return;

      // Update preset field
      let presetField = form.querySelector('input[name="lean_forms_preset"]');
      if (!presetField) {
        presetField = document.createElement("input");
        presetField.type = "hidden";
        presetField.name = "lean_forms_preset";
        form.appendChild(presetField);
      }
      presetField.value = this.preset;

      // Update custom options fields
      Object.entries(this.options).forEach(([key, value]) => {
        let optionField = form.querySelector(`input[name="lean_forms_${key}"]`);
        if (!optionField) {
          optionField = document.createElement("input");
          optionField.type = "hidden";
          optionField.name = `lean_forms_${key}`;
          form.appendChild(optionField);
        }
        optionField.value = value;
      });
    }
  }

  // Layout Tab - Future: Grid, spacing, layout options
  class LayoutTab {
    render() {
      const container = document.createElement("div");
      container.className = "space-y-6";

      const title = document.createElement("h4");
      title.className = "text-lg font-semibold";
      title.textContent = "Layout Options";

      const description = document.createElement("p");
      description.className = "text-sm text-gray-600";
      description.textContent =
        "Configure form layout, spacing, and grid options.";

      const comingSoon = document.createElement("div");
      comingSoon.className = "p-8 text-center text-gray-500";
      comingSoon.innerHTML = `
                <div class="text-4xl mb-4">🚧</div>
                <h3 class="text-lg font-medium mb-2">Coming Soon</h3>
                <p>Layout configuration options will be available in future updates.</p>
            `;

      container.appendChild(title);
      container.appendChild(description);
      container.appendChild(comingSoon);

      return container;
    }
  }

  // Advanced Tab - Future: Conditional logic, multi-steps, etc.
  class AdvancedTab {
    render() {
      const container = document.createElement("div");
      container.className = "space-y-6";

      const title = document.createElement("h4");
      title.className = "text-lg font-semibold";
      title.textContent = "Advanced Features";

      const description = document.createElement("p");
      description.className = "text-sm text-gray-600";
      description.textContent =
        "Configure conditional logic, multi-step forms, and advanced functionality.";

      const features = [
        {
          name: "Conditional Logic",
          description: "Show/hide fields based on conditions",
          icon: "🔀",
        },
        {
          name: "Multi-Step Forms",
          description: "Create multi-page form experiences",
          icon: "📋",
        },
        {
          name: "Field Validation",
          description: "Advanced validation rules",
          icon: "✅",
        },
        {
          name: "Form Actions",
          description: "Custom actions after submission",
          icon: "⚡",
        },
      ];

      const featuresGrid = document.createElement("div");
      featuresGrid.className = "grid grid-cols-2 gap-4";

      features.forEach((feature) => {
        const featureCard = document.createElement("div");
        featureCard.className = "p-4 border rounded-lg bg-gray-50";

        featureCard.innerHTML = `
                    <div class="text-2xl mb-2">${feature.icon}</div>
                    <h5 class="font-medium mb-1">${feature.name}</h5>
                    <p class="text-sm text-gray-600">${feature.description}</p>
                `;

        featuresGrid.appendChild(featureCard);
      });

      container.appendChild(title);
      container.appendChild(description);
      container.appendChild(featuresGrid);

      return container;
    }
  }

  // Main Form Builder App
  class FormBuilderApp {
    constructor(container) {
      this.container = container;
      this.init();
    }

    init() {
      // Initialize tab manager
      this.tabManager = new TabManager(this.container);
    }
  }

  // Initialize app when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("lean-forms-preset-app");
    if (container) {
      new FormBuilderApp(container);
    }
  });
})();
