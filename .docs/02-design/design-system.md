# NaraNews — Design System

Source of truth for UI work. Published version (with live component previews): https://claude.ai/artifact/9FvKZVtJntq7VXVbjYY7EW. Values come from `extension/src/popup/Popup.css` and `extension/src/options/Options.css` (branch `knkk`, 2026-10-01).

## Surfaces

| Surface | Width | Notes |
|---|---|---|
| Email digest (mobile, F3) | 100%, max `email-width` 600px (prototype: 480px) | One column; every tappable thing ≥ `tap-target` 44px |
| Popup (web, F2) | `popup-width` 360px | Header → topic toolbar → list → footer |
| Settings (web, LR3/LR4) | `settings-width` 440px card | Sign in with emailed code, consent, email digest status |

## Colour tokens

| Token | Value | Use |
|---|---|---|
| `ink-900` | `#091329` | Header bar background (popup, setup, Settings). The darkest surface; white text and ink-on-dark text sit on it. |
| `ink-800` | `#14213d` | Default page text colour set on :root. |
| `ink-700` | `#17243a` | Headlines, field values, strong labels on white or surface-card. |
| `ink-600` | `#26334c` | Back button fill inside the ink-900 header. |
| `slate-600` | `#40506b` | Section kickers, field labels, source names, secondary button text. |
| `slate-500` | `#52627b` | Intro paragraphs (serif body) on white. |
| `slate-400` | `#68738a` | Muted meta text: timestamps, helper text, footer text. 4.6:1 on white; only 4.2:1 on surface-band, so keep it on white there or use slate-600. |
| `slate-300` | `#748096` | One-line summary under a headline and option sub-labels. 4.1:1 on white — below 4.5:1 for 12px text in the source; flagged, prefer slate-400 for new work. |
| `on-ink-muted` | `#aeb8ca` | Subtitle text inside the ink-900 header ("Thai headline digest"). 9:1 on ink-900. |
| `on-ink-icon` | `#c5cedc` | Icon buttons (refresh, settings) inside the ink-900 header. |
| `line-300` | `#b8bfca` | The · divider between meta items in a headline row. |
| `line-200` | `#d9e0eb` | Borders of fields, cards, topic options, toggle rows, secondary buttons. |
| `line-150` | `#dce2eb` | Inactive progress-step track. |
| `line-100` | `#e3e7ed` | Footer top border; Soon badge fill. |
| `line-50` | `#e8ebf0` | Divider between headline rows. |
| `toggle-off` | `#cdd4df` | Switch track when off. |
| `surface-page` | `#eef1f6` | Page background behind the popup and Settings card. |
| `surface-band` | `#edf0f5` | Toolbars and progress footers: the band above and below content. |
| `surface-muted` | `#f8f9fb` | Notice boxes, demo note, disabled (coming-soon) rows. |
| `surface-card` | `#ffffff` | The popup shell, Settings card, rows, fields, options. |
| `brand-red` | `#ec1c24` | Start of the NaraNews mark gradient (app icon, brand-mark tile). |
| `brand-orange` | `#ff631f` | End of the NaraNews mark gradient. |
| `action-red` | `#ea1e23` | Start of the action gradient on primary buttons, the send-code button and switches that are on. |
| `action-orange` | `#fb5b1d` | End of the action gradient. |
| `accent-red` | `#df252b` | Text links and link buttons ("Open full article", "Change"), selected topic text, status-on title. 4.6:1 on white. |
| `accent-red-strong` | `#f1262d` | Selected topic border and focused field border. |
| `source-dot` | `#e7272d` | The 6px dot before a source name in a headline row. |
| `progress-active` | `#f04a25` | Active progress-step bar. |
| `chip-text` | `#d6292e` | Topic chip text on chip-bg. 4.2:1 — slightly under 4.5:1 for 11px bold; flagged. |
| `chip-bg` | `#f9dfe0` | Topic chip fill; also the 3px focus ring around a focused field. |
| `tint-red` | `#fff7f7` | Selected topic option and status-on box fill. |
| `hover-row` | `#fff7f5` | Hover and keyboard-focus fill of a headline row. |
| `border-red-soft` | `#f4a4a5` | Status-on border, time-chip border. |
| `loader-track` | `#f5c6c7` | Spinner track; the moving arc uses accent-red. |
| `error-text` | `#b3151b` | Error message text on error-bg. 6:1. |
| `error-bg` | `#fdecec` | Error message fill. |
| `on-ink` | `#ffffff` | Text and marks on `ink-900` and on the action gradient (the code uses literal `#fff`). |

## Type

Families: `serif` = Georgia, "Times New Roman", serif · `sans` = Arial, Helvetica, sans-serif

| Style | Family | Size / line / weight | Use |
|---|---|---|---|
| `app-title` | sans | 17px / 20px / 700 | Header title. |
| `headline` | sans | 15px / 1.2 / 700 | The one-line headline in a row. Never more than two lines. |
| `label-strong` | sans | 14px / 18px / 700 | Buttons, topic option names, status titles. |
| `field` | sans | 15px / 20px / 400 | Text typed into a field. |
| `code-entry` | sans | 20px / 24px / 700 | The 6-digit sign-in code field (LR3). |
| `small` | sans | 12px / 1.35 / 400 | Summary line, header subtitle, helper text. |
| `caption` | sans | 11px / 14px / 400 | Footer, toolbar, selection count. |
| `meta` | sans | 10px / 12px / 400 | Source and category above a headline. Uppercase. |
| `intro` | serif | 14px / 1.75 / 400 | Explanatory paragraphs in setup and Settings. |
| `kicker` | serif | 11px / 14px / 400 | Section label above a group of controls. Uppercase. |

## Spacing

| Token | Value | Use |
|---|---|---|
| `space-1` | `4px` | Chip vertical padding, tight gaps. |
| `space-2` | `8px` | Chip horizontal padding, gaps between chips. |
| `space-3` | `10px` | Gap between topic options; header gap. |
| `space-4` | `12px` | Gap between stacked controls; field side padding. |
| `space-5` | `14px` | Settings form gap; notice padding. |
| `space-6` | `16px` | Popup side gutter: every row, toolbar and footer. |
| `space-7` | `20px` | Setup and Settings content padding. |

## Radius

| Token | Value | Use |
|---|---|---|
| `radius-bar` | `4px` | Progress bars. |
| `radius-mark` | `10px` | Brand-mark tile, error box. |
| `radius-control` | `11px` | Buttons, fields, back button. |
| `radius-chip` | `12px` | Topic chips, time chips, Soon badge, notice box. |
| `radius-row` | `15px` | Toggle rows, account row, status-on box. |
| `radius-card` | `16px` | Topic options, Settings card. |
| `radius-round` | `50%` | Source dot, switch knob, spinner. |

## Shadow

| Token | Value | Use |
|---|---|---|
| `shadow-shell` | `0 14px 30px rgba(27, 44, 74, 0.14)` | The popup shell and the Settings card — the only raised surfaces. |
| `shadow-focus` | `0 0 0 3px #f9dfe0` | Focus ring around a focused field (paired with accent-red-strong border). |

## Size

| Token | Value | Use |
|---|---|---|
| `popup-width` | `360px` | Fixed Chrome popup width (shrinks to 100% under 380px). |
| `settings-width` | `440px` | Max width of the Settings card in a full tab. |
| `email-width` | `600px` | Max width of the email digest; it is 100% wide on a phone. |
| `control-height` | `42px` | Minimum height of buttons and fields on web. |
| `tap-target` | `44px` | Minimum tap height on mobile (email digest rows and buttons). |

## Component rules

- **AppHeader:** `ink-900` bar with the brand mark (gradient tile, `radius-mark`), the title (`app-title`, `on-ink`) and a subtitle (`small`, `on-ink-muted`). Every icon button needs an `aria-label` and a 44px hit area.
- **HeadlineRow:** meta line (`source-dot`, source, category, time) → headline (`headline`, `ink-700`, at most 2 lines) → summary line (`small`). The whole row is ONE link to the source article. Rows are separated by `line-50`.
- **Button:** one **primary** (action gradient) per screen. Secondary buttons are outlined `line-200`, and link buttons use `accent-red`. Height is at least `control-height` on web and `tap-target` on mobile.
- **TextField:** label (`slate-600`, bold 12px), input with a `line-200` border and `radius-control`. Focus shows `accent-red-strong` plus `shadow-focus`. The sign-in code uses the `code-entry` style.
- **ToggleRow:** title and purpose line, with a switch on the right. A channel that is not built yet shows the `coming-soon` state with a Soon badge.
- **StatusMessage:** `status-on` (on, with consent date), `notice-box` (purpose text, LR1), `error-text` (what went wrong and what to do).
- **Consent:** a checkbox inside a `line-200` bordered label (`radius-row`, at least `tap-target` tall) whose whole area toggles it. The sentence says what the reader agrees to ("I agree to the Terms and Privacy Policy."). Links to the documents sit outside the label as separate 44px link buttons, so tapping a link never ticks the box. Ticking it records consent (LR4).
- **Footer:** the last band of a screen. On the popup it is `caption` text in `slate-400` above a `line-100` border, with one link button ("Settings"). In the email it uses a `surface-band` fill and must say where the email went, why, and how to stop it ("Turn off email digest"), as LR1 and LR4 require.
- **Red is for action only.** The action gradient is for things you press, and `accent-red` is for links and selected states. Separate things with borders; only the shell and card get `shadow-shell`.
- **Copy:** the reader's words. Buttons name the result ("Send code", "Turn on email digest").

## Known contrast flags

`slate-300` on white (4.1:1) and `chip-text` on `chip-bg` (4.2:1) are below 4.5:1 in the shipped code. Prefer `slate-400` and `accent-red` for new screens.
