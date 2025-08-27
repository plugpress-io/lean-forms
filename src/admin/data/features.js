/**
 * Add-ons Data
 * Centralized add-on definitions
 */

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

export const LITE_ADDONS = [
  {
    id: "grid",
    title: __("Grid Layout", "lean-forms"),
    description: __(
      "Row/Column shortcodes for organizing CF7 form fields",
      "lean-forms",
    ),
    option: "lean_forms_enable_grid",
    icon: GridIcon,
  },
  {
    id: "entries",
    title: __("Form Entries", "lean-forms"),
    description: __(
      "Store and manage form submissions in WordPress",
      "lean-forms",
    ),
    option: "lean_forms_enable_entries",
    icon: EntriesIcon,
  },
  {
    id: "spam_protection",
    title: __("Spam Protection", "lean-forms"),
    description: __("Cloudflare Turnstile integration (Planned)", "lean-forms"),
    option: "lean_forms_enable_spam_protection",
    planned: true,
    icon: SpamProtectionIcon,
  },
  {
    id: "divi_module",
    title: __("Divi Visual Builder Module", "lean-forms"),
    description: __("Native Divi module for form styling", "lean-forms"),
    option: "lean_forms_enable_divi",
    planned: true,
    icon: DiviModuleIcon,
  },
  {
    id: "bricks_element",
    title: __("Bricks Visual Site Builder", "lean-forms"),
    description: __("Native Bricks form element", "lean-forms"),
    option: "lean_forms_enable_bricks",
    planned: true,
    icon: BricksElementIcon,
  },
  {
    id: "gutenberg_block",
    title: __("WordPress Block", "lean-forms"),
    description: __("Gutenberg block for form styling", "lean-forms"),
    option: "lean_forms_enable_block",
    planned: true,
    icon: WordpressBlockIcon,
  },
  {
    id: "elementor_widget",
    title: __("Elementor Widget", "lean-forms"),
    description: __("Native Elementor widget for forms", "lean-forms"),
    option: "lean_forms_enable_elementor",
    planned: true,
    icon: ElementorWidgetIcon,
  },
];

export const PRO_ADDONS = [
  // Advanced Fields - Individual toggles
  {
    id: "rating_field",
    title: __("Rating/Star Field", "lean-forms"),
    description: __("Add star rating inputs to your forms", "lean-forms"),
    category: "fields",
    option: "lean_forms_enable_rating_field",
    icon: RatingFieldIcon,
  },
  {
    id: "range_slider_field",
    title: __("Range Slider Field", "lean-forms"),
    description: __("Add range/slider inputs for numeric values", "lean-forms"),
    category: "fields",
    option: "lean_forms_enable_range_slider_field",
    icon: RangeSliderIcon,
  },
  {
    id: "signature_field",
    title: __("Signature Field", "lean-forms"),
    description: __("Capture digital signatures", "lean-forms"),
    category: "fields",
    option: "lean_forms_enable_signature_field",
    icon: SignatureIcon,
  },
  {
    id: "color_picker_field",
    title: __("Color Picker Field", "lean-forms"),
    description: __("Add color selection inputs", "lean-forms"),
    category: "fields",
    option: "lean_forms_enable_color_picker_field",
    icon: ColorPickerIcon,
  },
  {
    id: "divider_field",
    title: __("Divider Field", "lean-forms"),
    description: __("Add visual dividers and spacers", "lean-forms"),
    category: "fields",
    option: "lean_forms_enable_divider_field",
    icon: DividerIcon,
  },
  // Form Features
  {
    id: "multi_steps",
    title: __("Multi-Step Forms", "lean-forms"),
    description: __("Break long forms into multiple steps", "lean-forms"),
    category: "features",
    option: "lean_forms_enable_multi_steps",
    icon: MultiStepsIcon,
  },
  {
    id: "conditional_logic",
    title: __("Conditional Fields", "lean-forms"),
    description: __("Show/hide fields based on user input", "lean-forms"),
    category: "features",
    option: "lean_forms_enable_conditional_logic",
    icon: ConditionalLogicIcon,
  },
  // Integrations
  {
    id: "google_sheets",
    title: __("Google Sheets Integration", "lean-forms"),
    description: __("Sync form submissions to Google Sheets", "lean-forms"),
    category: "integrations",
    option: "lean_forms_enable_google_sheets",
    icon: GoogleSheetsIcon,
  },
  {
    id: "mailchimp",
    title: __("Mailchimp Integration", "lean-forms"),
    description: __("Add contacts to Mailchimp lists", "lean-forms"),
    category: "integrations",
    option: "lean_forms_enable_mailchimp",
    icon: MailchimpIcon,
  },
  {
    id: "emailoctopus",
    title: __("EmailOctopus Integration", "lean-forms"),
    description: __("Add contacts to EmailOctopus lists", "lean-forms"),
    category: "integrations",
    option: "lean_forms_enable_emailoctopus",
    icon: EmailOctopusIcon,
  },
  {
    id: "airtable",
    title: __("Airtable Integration", "lean-forms"),
    description: __("Push submissions to Airtable tables", "lean-forms"),
    category: "integrations",
    option: "lean_forms_enable_airtable",
    icon: AirtableIcon,
  },
];
