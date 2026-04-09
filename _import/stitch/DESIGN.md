# Design System: The Ethereal Archive

## 1. Overview & Creative North Star
### Creative North Star: "The Digital Curator"
This design system is not a mere interface; it is a sacred inventory. It draws inspiration from the concept of a "Royal Library" or an "Ethereal Vault"—a place where digital artifacts are preserved in a space of timeless elegance. 

To move beyond the generic "card-on-grid" look, this system utilizes **intentional atmospheric depth**. We break the template by using wide-letter-spaced labels, asymmetrical content groupings, and high-contrast typography scales that feel more like a premium editorial spread than a standard web dashboard. The goal is to make the user feel like they are illuminating hidden knowledge as they interact with the screen.

---

## 2. Colors & Atmospheric Surface
The palette is rooted in the "Abyssal" spectrum—deep, warm obsidian and dark chocolate—illuminated by "Luminescent Gold" accents.

### The Palette
- **Primary / Primary Container:** `primary` (#ffd18f) and `primary_container` (#e9b362). These are your "Glow" tokens. Use them sparingly for highlights and active states.
- **Surface Foundations:** `surface` (#161212) serves as the primary ink of the background. For content layering, use `surface_container_low` (#1f1a1a) for base sections and `surface_container_highest` (#393333) for active, elevated elements.
- **Tertiary/Accents:** `tertiary_container` (#f5a9a6) provides a soft burgundy/amber warmth to interactive elements.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off large areas of the UI. Separation must be achieved through:
1.  **Tonal Shifts:** Placing a `surface_container_low` section against a `surface` background.
2.  **Glow Thresholds:** Defining an area with a soft outer glow or a subtle background gradient rather than a stroke.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of obsidian and stained glass. 
- **Base Level:** `surface`
- **Sectioning:** `surface_container_low`
- **Interactive Cards:** `surface_container`
- **Floating Modals/Focus:** `surface_bright` with a 20% opacity `surface_tint` overlay.

### The "Glass & Gradient" Rule
For main CTAs and premium card states, use a linear gradient transitioning from `primary` (#ffd18f) to `primary_container` (#e9b362) at a 135-degree angle. Floating menus should utilize a `backdrop-blur` (12px-16px) combined with a semi-transparent `surface_container_high` to create a "frosted obsidian" effect.

---

## 3. Typography
The typography strategy relies on the tension between the **Ancient (Serif)** and the **Functional (Sans-Serif)**.

*   **Display & Headlines (`notoSerif`):** High-contrast, decorative, and authoritative. Use `display-lg` for hero moments. These should always be in `on_surface` or `primary` to evoke the "Royal Archive" feel. Increase letter-spacing slightly for all-caps sub-headlines to add an editorial air.
*   **Body & Titles (`manrope`):** A clean, modern sans-serif that ensures readability against dark, textured backgrounds. 
*   **Labels (`manrope`):** Used for metadata and small UI cues. All labels should be set in `label-md` or `label-sm` with a character spacing of +0.05em to maintain a premium, curated aesthetic.

---

## 4. Elevation & Depth
Elevation in this system is "Radiant," not just "Shadowed."

*   **Tonal Layering:** Instead of drop shadows, use `surface_container` tiers. A `surface_container_lowest` card sitting on a `surface_container_low` background creates a natural, recessed depth.
*   **Ambient Shadows:** When an element must float, use a shadow with a 24px-32px blur, set to 6% opacity. The shadow color should be derived from the `surface_container_highest` (#393333) rather than pure black.
*   **The "Ghost Border":** If a container requires a border for accessibility (e.g., input fields), use the `outline_variant` (#4f4538) at **20% opacity**. Never use a 100% opaque border.
*   **The Signature Glow:** Active cards or buttons should feature a soft `box-shadow: 0 0 15px rgba(233, 179, 98, 0.3);`. This simulates the light of a candle or magic spark within the vault.

---

## 5. Components

### Buttons
*   **Primary:** A gradient fill (`primary` to `primary_container`). Text in `on_primary` (#442b00). Roundedness: `full` for a modern, pebble-like feel.
*   **Secondary:** Ghost style. No fill, `Ghost Border` (outline-variant at 30%), text in `primary`.
*   **Tertiary:** No border or fill. Text in `on_surface_variant`, transitioning to `primary` on hover.

### Cards
*   **Structure:** No visible borders. Background: `surface_container`. 
*   **Hover State:** Transition background to `surface_container_high` and add the "Signature Glow" (amber/gold) with a `0.25rem` (sm) corner radius.

### Input Fields
*   **Style:** Underlined or fully enclosed in `surface_container_lowest`. 
*   **Focus State:** The bottom border or ghost border glows with the `primary` token. Helper text should be in `on_surface_variant` using `label-sm`.

### Selection Chips
*   **Style:** Use `surface_container_highest` for unselected and `primary_container` for selected. 
*   **Interaction:** Soft haptic-like scaling (98%) on press to reinforce the physical "vault" feel.

---

## 6. Do's and Don'ts

### Do
*   **DO** use ample white space (specifically vertical spacing) to separate content sections instead of lines.
*   **DO** use `surface_tint` overlays (5-10%) on images to integrate them into the dark, warm atmosphere.
*   **DO** ensure all text meets WCAG AA contrast ratios, especially when using `primary` gold text on dark backgrounds.

### Don't
*   **DON'T** use pure white (#FFFFFF). Use `on_surface` (#eae0e0) for high-contrast text.
*   **DON'T** use harsh, 90-degree corners for containers. Stick to the `md` (0.375rem) or `lg` (0.5rem) roundedness scale to keep the vibe "elegant" rather than "industrial."
*   **DON'T** use standard blue for links or errors. Use `tertiary` for warm accents and `error` for critical alerts.