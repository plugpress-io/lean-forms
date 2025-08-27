=== Lean Forms — Power-Ups for Contact Form 7 (Lite) ===
Contributors: yourname
Tags: contact-form-7, forms, form-styling, form-entries, cf7
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Integrates with Contact Form 7 (CF7). Not affiliated or endorsed. Collects form submissions, provides admin interface, and offers form styling blocks.

== Description ==

Lean Forms is a powerful WordPress plugin that extends Contact Form 7 with essential features for form management and styling. This plugin is not affiliated with or endorsed by Contact Form 7.

**Key Features:**

* **Form Entry Collection**: Automatically captures all Contact Form 7 submissions
* **Admin Dashboard**: Beautiful React-based interface using WordPress DataViews
* **Form Styler Block**: Customize form appearance with visual controls
* **Grid Layout System**: Responsive 12-column grid shortcodes for CF7 forms
* **CSV Export**: Export form entries with filtering (up to 500 rows in Lite)
* **Spam Detection**: Integrates with CF7's spam detection
* **Responsive Design**: Modern UI built with TailwindCSS

**What It Does:**

1. **Captures Form Submissions**: Hooks into CF7's submission process to save entries
2. **Admin Management**: View, filter, and manage form entries with a modern interface
3. **Form Styling**: Customize form appearance with the Form Styler block
4. **Grid Layouts**: Create responsive form layouts using [lfcf7-row] and [lfcf7-col] shortcodes
5. **Data Export**: Export filtered data to CSV for analysis
6. **Security**: Automatically strips sensitive information (passwords, credit cards, etc.)

**Perfect For:**
* Agencies managing multiple client forms
* Businesses needing form submission analytics
* Developers wanting to extend CF7 functionality
* Anyone needing better form management tools

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/lean-forms` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Settings->Lean Forms screen to configure the plugin
4. Make sure Contact Form 7 is installed and activated

== Grid Layout Usage ==

The plugin adds two shortcodes for creating responsive grid layouts in Contact Form 7:

**Row Container:**
```
[lfcf7-row gap:24]
  [lfcf7-col col:6 md:6]
    [text* your-name placeholder "Your name"]
  [/lfcf7-col]
  [lfcf7-col col:6 md:6]
    [email* your-email placeholder "Email"]
  [/lfcf7-col]
  [lfcf7-col col:12]
    [textarea your-message placeholder "Message"]
  [/lfcf7-col]
[/lfcf7-row]
[submit "Send"]
```

**Shortcode Attributes:**

* **[lfcf7-row]**: Creates a grid row container
  * `gap`: Spacing between columns in pixels (default: 16)
  * `class`: Additional CSS classes

* **[lfcf7-col]**: Creates a grid column
  * `col`: Base column width 1-12 (default: 12)
  * `sm`: Small breakpoint (≥640px) width 1-12
  * `md`: Medium breakpoint (≥768px) width 1-12
  * `lg`: Large breakpoint (≥1024px) width 1-12
  * `xl`: Extra large breakpoint (≥1280px) width 1-12
  * `class`: Additional CSS classes

**Tag Generators:**
Use the "Grid Row" and "Grid Column" buttons in the CF7 form editor to easily insert these shortcodes.

== Frequently Asked Questions ==

= Does this plugin work without Contact Form 7? =

No, this plugin requires Contact Form 7 to be installed and activated. It extends CF7's functionality rather than replacing it.

= Is my form data secure? =

Yes! The plugin automatically strips sensitive information like passwords, credit card numbers, and other sensitive data before saving entries.

= Can I export all my form entries? =

The Lite version allows exporting up to 500 rows at a time. For unlimited exports, consider upgrading to the Pro version.

= Does this affect my existing Contact Form 7 forms? =

No, this plugin works alongside CF7 without modifying your existing forms. It only captures submissions and provides additional management tools.

= Is this plugin affiliated with Contact Form 7? =

No, this plugin is not affiliated with or endorsed by Contact Form 7. It's an independent extension that works with CF7.

== Screenshots ==

1. Admin dashboard showing form entries
2. Form Styler block editor interface
3. Entry detail view with form data
4. CSV export functionality

== Changelog ==

= 1.0.0 =
* Initial release
* Form entry collection from Contact Form 7
* React-based admin interface
* Form Styler block
* CSV export functionality
* Spam detection integration

== Upgrade Notice ==

= 1.0.0 =
Initial release of Lean Forms plugin.
