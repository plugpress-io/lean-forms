import { __ } from "@wordpress/i18n";
import {
  GridIcon,
  EntriesIcon,
  SpamProtectionIcon,
  DiviModuleIcon,
  BricksElementIcon,
  WordpressBlockIcon,
  ElementorWidgetIcon,
  RatingFieldIcon,
  RangeSliderIcon,
  SignatureIcon,
  ColorPickerIcon,
  DividerIcon,
  MultiStepsIcon,
  ConditionalLogicIcon,
  MailchimpIcon,
  GoogleSheetsIcon,
  EmailOctopusIcon,
  AirtableIcon,
  DefaultIcon,
} from "../icons";

export const LITE_features = [
  {
    id: "grid",
    name: __("Grid Layout", "lean-forms"),
    type: "Lite",
    description: __(
      "Organize CF7 form fields using row and column shortcodes for flexible layouts.",
      "lean-forms",
    ),
    option: "lean_forms_enable_grid",
    icon: GridIcon,
    isPlanned: false,
  },
  {
    id: "entries",
    name: __("Form Entries", "lean-forms"),
    type: "Lite",
    description: __(
      "Store and manage all form submissions directly within your WordPress dashboard.",
      "lean-forms",
    ),
    option: "lean_forms_enable_entries",
    icon: EntriesIcon,
    isPlanned: false,
  },
  {
    id: "form_presets",
    name: __("Form Presets", "lean-forms"),
    type: "Lite",
    description: __(
      "Professional form styling with Classic and Modern presets. Customize colors and typography.",
      "lean-forms",
    ),
    option: "lean_forms_enable_form_presets",
    icon: DefaultIcon,
    isPlanned: false,
  },
  {
    id: "spam_protection",
    name: __("Spam Protection", "lean-forms"),
    type: "Lite",
    description: __(
      "Prevent spam with honeypot, hCaptcha, and advanced protection tools for your forms.",
      "lean-forms",
    ),
    option: "lean_forms_enable_spam_protection",
    icon: SpamProtectionIcon,
    isPlanned: false,
  },
  {
    id: "mailchimp",
    name: __("Mailchimp Integration", "lean-forms"),
    type: "Lite",
    description: __(
      "Add new contacts to your Mailchimp lists automatically from form submissions.",
      "lean-forms",
    ),
    category: "integrations",
    option: "lean_forms_enable_mailchimp",
    icon: MailchimpIcon,
    isPlanned: false,
    hasSettings: true, // Needs API key
  },
  {
    id: "divi_module",
    name: __("Divi Module", "lean-forms"),
    type: "Lite",
    description: __(
      "Style your forms visually with a native Divi module for seamless integration.",
      "lean-forms",
    ),
    option: "lean_forms_enable_divi",
    icon: DiviModuleIcon,
    isPlanned: false,
  },
  {
    id: "bricks_element",
    name: __("Bricks Element", "lean-forms"),
    type: "Lite",
    description: __(
      "Add and style forms easily using a native Bricks builder element for flexibility.",
      "lean-forms",
    ),
    option: "lean_forms_enable_bricks",
    icon: BricksElementIcon,
    isPlanned: false,
  },
  {
    id: "gutenberg_block",
    name: __("WordPress Block", "lean-forms"),
    type: "Lite",
    description: __(
      "Insert and customize forms with a native Gutenberg block for easy editing.",
      "lean-forms",
    ),
    option: "lean_forms_enable_block",
    icon: WordpressBlockIcon,
    isPlanned: false,
  },
  {
    id: "elementor_widget",
    name: __("Elementor Widget", "lean-forms"),
    type: "Lite",
    description: __(
      "Design and manage forms visually with a native Elementor widget integration.",
      "lean-forms",
    ),
    option: "lean_forms_enable_elementor",
    icon: ElementorWidgetIcon,
    isPlanned: false,
  },
];

export const PRO_features = [
  // Advanced Fields - Individual toggles
  {
    id: "rating_field",
    name: __("Rating/Star Field", "lean-forms"),
    type: "Pro",
    description: __(
      "Add interactive star rating fields to your forms for user feedback collection.",
      "lean-forms",
    ),
    category: "fields",
    option: "lean_forms_enable_rating_field",
    icon: RatingFieldIcon,
    isPlanned: false,
  },
  {
    id: "divider_field",
    name: __("Divider Field", "lean-forms"),
    type: "Pro",
    description: __(
      "Add visual dividers and spacers to your forms for improved organization.",
      "lean-forms",
    ),
    category: "fields",
    option: "lean_forms_enable_divider_field",
    icon: DividerIcon,
    isPlanned: false,
  },
  {
    id: "range_slider_field",
    name: __("Range Slider Field", "lean-forms"),
    type: "Pro",
    description: __(
      "Add numeric range sliders to your forms for easy value selection by users.",
      "lean-forms",
    ),
    category: "fields",
    option: "lean_forms_enable_range_slider_field",
    icon: RangeSliderIcon,
    isPlanned: false,
  },
  {
    id: "signature_field",
    name: __("Signature Field", "lean-forms"),
    type: "Pro",
    description: __(
      "Allow users to provide digital signatures directly within your form fields.",
      "lean-forms",
    ),
    category: "fields",
    option: "lean_forms_enable_signature_field",
    icon: SignatureIcon,
    isPlanned: true,
  },
  {
    id: "color_picker_field",
    name: __("Color Picker Field", "lean-forms"),
    type: "Pro",
    description: __(
      "Let users select colors easily with a built-in color picker field for forms.",
      "lean-forms",
    ),
    category: "fields",
    option: "lean_forms_enable_color_picker_field",
    icon: ColorPickerIcon,
    isPlanned: true,
  },
  // Form Features
  {
    id: "multi_steps",
    name: __("Multi-Step Forms", "lean-forms"),
    type: "Pro",
    description: __(
      "Break long forms into multiple steps to improve user experience and completion.",
      "lean-forms",
    ),
    category: "features",
    option: "lean_forms_enable_multi_steps",
    icon: MultiStepsIcon,
    isPlanned: false,
  },
  {
    id: "conditional_logic",
    name: __("Conditional Fields", "lean-forms"),
    type: "Pro",
    description: __(
      "Show or hide form fields automatically based on user input and selections.",
      "lean-forms",
    ),
    category: "features",
    option: "lean_forms_enable_conditional_logic",
    icon: ConditionalLogicIcon,
    isPlanned: true,
  },
  // Integrations
  {
    id: "google_sheets",
    name: __("Google Sheets", "lean-forms"),
    type: "Pro",
    description: __(
      "Sync all form submissions automatically to your connected Google Sheets.",
      "lean-forms",
    ),
    category: "integrations",
    option: "lean_forms_enable_google_sheets",
    icon: GoogleSheetsIcon,
    isPlanned: false,
    hasSettings: true, // Needs API credentials
  },
  {
    id: "emailoctopus",
    name: __("EmailOctopus Integration", "lean-forms"),
    type: "Pro",
    description: __(
      "Add new contacts to your EmailOctopus lists automatically from submissions.",
      "lean-forms",
    ),
    category: "integrations",
    option: "lean_forms_enable_emailoctopus",
    icon: EmailOctopusIcon,
    isPlanned: false,
    hasSettings: true, // Needs API key
  },
  {
    id: "airtable",
    name: __("Airtable Integration", "lean-forms"),
    type: "Pro",
    description: __(
      "Send all form submissions directly to your Airtable tables for easy access.",
      "lean-forms",
    ),
    category: "integrations",
    option: "lean_forms_enable_airtable",
    icon: AirtableIcon,
    isPlanned: true,
    hasSettings: true, // Needs API key and base ID
  },
];
