/**
 * Simple CF7 Tag Generator for Lean Forms
 */

(function ($) {
  "use strict";

  console.log("🚀 Lean Forms CF7 Editor script loaded");

  // Custom insertion function for wrapping tags
  function insertWrappingTag(tagType, attributes) {
    const $formEditor = $("#wpcf7-form");
    if (!$formEditor.length) {
      console.error("Form editor not found");
      return;
    }

    const editor = $formEditor[0];
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = $formEditor.val().substring(start, end);

    // Build opening tag
    let openTag = "[" + tagType;
    for (const [key, value] of Object.entries(attributes)) {
      if (value) {
        openTag += " " + key + ":" + value;
      }
    }
    openTag += "]";

    // Build closing tag
    const closeTag = "[/" + tagType + "]";

    // Insert with selected text wrapped
    const newContent =
      $formEditor.val().substring(0, start) +
      openTag +
      (selectedText || "") +
      closeTag +
      $formEditor.val().substring(end);

    $formEditor.val(newContent);

    // Position cursor after opening tag if no selection, or after closing tag if there was selection
    const newCursorPos = selectedText
      ? start + openTag.length + selectedText.length + closeTag.length
      : start + openTag.length;
    editor.setSelectionRange(newCursorPos, newCursorPos);

    $formEditor.trigger("change").focus();
    console.log(
      "✅ Successfully inserted:",
      openTag + (selectedText || "") + closeTag,
    );
  }

  $(document).ready(function () {
    console.log("Setting up CF7 tag generators");

    // Update tag preview when options change
    function updateTagPreview() {
      console.log("Updating tag previews...");

      // Update any visible tag inputs
      $('input.tag.code[name="lfcf7-row"]').each(function () {
        const $tagInput = $(this);
        const $dialog = $tagInput.closest(
          ".ui-dialog-content, .tag-generator-panel, .postbox",
        );

        if ($dialog.length) {
          const $gapInput = $dialog.find('input[name="gap"]');
          const $classInput = $dialog.find('input[name="class"]');

          if ($gapInput.length || $classInput.length) {
            function updateRowTag() {
              const gap = $gapInput.val() || "16";
              const className = $classInput.val() || "";
              let tag = "[lfcf7-row";
              if (gap !== "16") tag += " gap:" + gap;
              if (className) tag += " class:" + className;
              tag += "][/lfcf7-row]";
              $tagInput.val(tag);
              console.log("Row tag updated:", tag);
            }

            $gapInput
              .off("input.leanforms")
              .on("input.leanforms", updateRowTag);
            $classInput
              .off("input.leanforms")
              .on("input.leanforms", updateRowTag);
            updateRowTag();
          }
        }
      });

      // Update column tag inputs
      $('input.tag.code[name="lfcf7-col"]').each(function () {
        const $tagInput = $(this);
        const $dialog = $tagInput.closest(
          ".ui-dialog-content, .tag-generator-panel, .postbox",
        );

        if ($dialog.length) {
          const $colSelect = $dialog.find('select[name="col"]');
          const $smSelect = $dialog.find('select[name="sm"]');
          const $mdSelect = $dialog.find('select[name="md"]');
          const $lgSelect = $dialog.find('select[name="lg"]');
          const $xlSelect = $dialog.find('select[name="xl"]');
          const $classInput = $dialog.find('input[name="class"]');

          if ($colSelect.length) {
            function updateColTag() {
              const col = $colSelect.val() || "12";
              const sm = $smSelect.val() || "";
              const md = $mdSelect.val() || "";
              const lg = $lgSelect.val() || "";
              const xl = $xlSelect.val() || "";
              const className = $classInput.val() || "";

              let tag = "[lfcf7-col";
              tag += " col:" + col;
              if (sm) tag += " sm:" + sm;
              if (md) tag += " md:" + md;
              if (lg) tag += " lg:" + lg;
              if (xl) tag += " xl:" + xl;
              if (className) tag += " class:" + className;
              tag += "][/lfcf7-col]";

              $tagInput.val(tag);
              console.log("Column tag updated:", tag);
            }

            $colSelect
              .off("change.leanforms")
              .on("change.leanforms", updateColTag);
            $smSelect
              .off("change.leanforms")
              .on("change.leanforms", updateColTag);
            $mdSelect
              .off("change.leanforms")
              .on("change.leanforms", updateColTag);
            $lgSelect
              .off("change.leanforms")
              .on("change.leanforms", updateColTag);
            $xlSelect
              .off("change.leanforms")
              .on("change.leanforms", updateColTag);
            $classInput
              .off("input.leanforms")
              .on("input.leanforms", updateColTag);
            updateColTag();
          }
        }
      });
    }

    // Initial setup
    setTimeout(updateTagPreview, 100);

    // Re-run when CF7 editor loads
    $(document).on("wpcf7_editor_loaded", function () {
      console.log("CF7 editor loaded, updating tag generators");
      setTimeout(updateTagPreview, 100);
    });

    // Re-run when tag generator dialogs open
    $(document).on("click", "#tag-generator-list button", function () {
      console.log("Tag generator button clicked");
      setTimeout(updateTagPreview, 100);
    });

    // Intercept form changes to prevent CF7 from inserting after us
    let ourInsertInProgress = false;

    // Override the form editor's insertAtCursor function if it exists
    if (typeof window.insertAtCursor === "function") {
      const originalInsertAtCursor = window.insertAtCursor;
      window.insertAtCursor = function (element, value) {
        if (ourInsertInProgress) {
          console.log("🚫 Blocking CF7's insertAtCursor during our insertion");
          return;
        }
        return originalInsertAtCursor.call(this, element, value);
      };
    }

    // Handle our custom insertion with complete override
    $(document).on("click", ".insert-tag", function (e) {
      console.log("🔥 Insert button clicked!");

      const $button = $(this);
      const $dialog = $button.closest(
        ".ui-dialog-content, .tag-generator-panel, .postbox",
      );
      const $tagInput = $dialog.find("input.tag.code");

      if (!$tagInput.length) {
        console.log("No tag input found");
        return;
      }

      const tagName = $tagInput.attr("name");
      console.log("Tag name:", tagName);

      // Only handle our grid tags
      if (tagName === "lfcf7-row" || tagName === "lfcf7-col") {
        console.log("🎯 Handling GRID tag:", tagName);

        // Set flag to block CF7
        ourInsertInProgress = true;

        // Stop ALL event processing immediately
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (tagName === "lfcf7-row") {
          const gap = $dialog.find('input[name="gap"]').val() || "16";
          const className = $dialog.find('input[name="class"]').val() || "";
          const attributes = {};
          if (gap !== "16") attributes.gap = gap;
          if (className) attributes.class = className;

          console.log("📝 Inserting row with:", attributes);
          insertWrappingTag("lfcf7-row", attributes);
        } else if (tagName === "lfcf7-col") {
          const col = $dialog.find('select[name="col"]').val() || "12";
          const sm = $dialog.find('select[name="sm"]').val() || "";
          const md = $dialog.find('select[name="md"]').val() || "";
          const lg = $dialog.find('select[name="lg"]').val() || "";
          const xl = $dialog.find('select[name="xl"]').val() || "";
          const className = $dialog.find('input[name="class"]').val() || "";

          const attributes = {};
          attributes.col = col;
          if (sm) attributes.sm = sm;
          if (md) attributes.md = md;
          if (lg) attributes.lg = lg;
          if (xl) attributes.xl = xl;
          if (className) attributes.class = className;

          console.log("📝 Inserting column with:", attributes);
          insertWrappingTag("lfcf7-col", attributes);
        }

        // Close dialog and reset flag
        setTimeout(function () {
          ourInsertInProgress = false;
          if ($dialog.dialog) {
            $dialog.dialog("close");
          }
        }, 10);

        return false;
      }
    });

    // Monitor for any unwanted insertions
    const $formEditor = $("#wpcf7-form");
    if ($formEditor.length) {
      let lastContent = $formEditor.val();

      $formEditor.on("input", function () {
        const currentContent = $(this).val();
        if (!ourInsertInProgress && currentContent !== lastContent) {
          const diff = currentContent.replace(lastContent, "");
          if (diff.includes("[lfcf7-") && !diff.includes("[/lfcf7-")) {
            console.log("🚨 Detected unwanted CF7 insertion:", diff);
            // Could potentially clean this up here
          }
        }
        lastContent = currentContent;
      });
    }
  });

  console.log("✅ Lean Forms CF7 editor support loaded");
})(jQuery);
