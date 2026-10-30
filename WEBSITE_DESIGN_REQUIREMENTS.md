# Website Design Requirements

## Navbar

### Main navigation order

1. **Logo**
   - Clicking the logo returns to the homepage.

2. **Services — Mega Menu**
   - Contains the exact categorized service structure defined in `ASHLAND_DENTAL_COMPLETE_MASTER_DATA.md`.
   - Includes a prominent **View All Services** link/button.
   - **View All Services** destination: `/services/`

3. **Service Areas — Mega Menu**
   - Contains the mapped service areas defined in `ASHLAND_DENTAL_COMPLETE_MASTER_DATA.md`.
   - Includes a prominent **View All Service Areas** link/button.
   - **View All Service Areas** destination: `/service-areas/`

4. **Pricing**
   - Destination: `/pricing/`

5. **Contact Us**
   - Destination: `/contact/`

6. **Resources — Dropdown/Menu**
   - **About** — `/about/`
   - **Team** — `/team/`
   - **Blog** — `/blog/`
   - **FAQ** — `/faq/`

7. **Phone Number Button**
   - Primary number: `(708) 755-1333`
   - Click action: `tel:+17087551333`

8. **Primary CTA Button**
   - Button label: **TBD**
   - Destination/action: **TBD**

## Implementation Notes

- Services and Service Areas must use full mega menus, not basic dropdowns.
- Both mega menus must include their respective View All buttons.
- Desktop and mobile navigation must preserve the same information hierarchy.
- Final styling, interaction, animation, responsive behavior, CTA label, and CTA destination will be implemented only after the design reference and remaining direction are provided.

## Homepage Reference and Motion Direction

### Primary reference

- Reference website: [LAVA dental](https://lavadental.lv/en)
- The homepage will closely follow the reference site's visual composition, section pacing, motion language, scroll choreography, interactivity, and mobile experience.
- We will not reuse the reference brand, copy, business data, or media. All visible content, services, service areas, pricing, reviews, team details, locations, and contact information will be Ashland Dental's.
- The navbar will follow the custom structure documented above, not the reference site's navigation.
- Additional website pages will be designed later using the homepage's approved visual and motion system.

### Homepage experience to reproduce

- Editorial split-screen hero with layered photography/video, oversized typography, staggered entrance animation, and a clear primary CTA.
- Scroll-scrubbed headline and copy reveals.
- Pinned sections and scroll-driven horizontal media tracks.
- Layered parallax images/video cards with overlapping depth and controlled scale changes.
- Large typography crossing or interacting with media layers.
- Circular/orbital step navigation where appropriate.
- Smooth dark-to-light and section-to-section visual transitions.
- Immersive video or media CTA panels.
- Asymmetric service-card layouts with numbered categories and interactive states.
- Staggered doctor/team grids, customer-review proof, pricing presentation, FAQ accordions, locations/contact, and a substantial footer.
- The reference may be improved where a clearer interaction, stronger hierarchy, or more polished animation benefits this clinic's content.

### Ashland Dental homepage content mapping

- Hero and primary conversion action.
- Practice positioning and patient experience.
- Exact categorized services.
- Service areas and service-plus-location coverage.
- Reviews, ratings, results, and other trust signals.
- Doctors and team.
- Customer-facing fixed, monthly, and yearly pricing.
- FAQ.
- Chicago Heights and Mokena location/contact details.

### Mobile requirements

- Mobile is a primary design target, not a reduced desktop layout.
- Preserve the reference's immersive motion, intentional image crops, overlapping media, staged hero entrance, scroll-linked reveals, and sticky navigation behavior.
- Use a full-height, large-type mobile navigation panel containing the complete custom information hierarchy.
- Recompose complex desktop sequences for touch screens while keeping the same narrative and visual impact.

### Required technology boundary

- **Astro** for pages, layouts, and components.
- **Tailwind CSS** for the styling system and responsive layout.
- **GSAP**, including ScrollTrigger where needed, for entrance animation, pinning, scrubbing, parallax, horizontal scroll, transitions, and menu motion.
- Do not add another frontend framework, animation library, slider library, smooth-scroll library, or 3D framework.
- If a 3D-like sequence is needed, deliver it with optimized pre-rendered media, an image sequence, video, CSS, or native Canvas controlled by GSAP rather than adding a 3D dependency.

### Asset direction

- Use original clinic assets wherever suitable.
- Generate missing custom imagery when required.
- Produce custom video or pre-rendered 3D-style media with Higgsfield when the approved design requires it and the connected account is available.
- Optimize all generated media for fast desktop and mobile delivery.

### Quality requirements

- Keep mobile animation quality high while controlling asset weight and runtime cost.
- Provide reduced-motion behavior for visitors who request it.
- Maintain semantic structure, keyboard access, readable contrast, and usable controls throughout the immersive experience.
- Homepage implementation and asset production remain pending until the design/content direction is approved.
