# EFA Expense Reevaluation pages

Two pages for families requesting a review of a denied EFA expense under 6 CAR § 35-113(a):

- `reevaluation.html`: individual expense reevaluation (screening, deadline check, link to the Google Form)
- `final-review.html`: final review (same steps, linked to the final review Google Form)

## Files

| File | What it does | Edit it when |
|---|---|---|
| `reevaluation-config.js` | Form links, documents email, office contact, number of business days, extra closure days | Any setting changes |
| `reevaluation-deadline.js` | Business-day deadline math; Arkansas state holidays (Ark. Code § 1-5-101) are calculated automatically each year | Rarely |
| `reevaluation-screening.js` | Shows and hides the steps and messages; builds the prefilled form link | Rarely |
| `reevaluation.css` | Colors and layout | Changing the look |

## Publish on GitHub Pages

1. On your computer, make a new folder (for example `efa-reevaluation`) and download all seven files into it.
2. In GitHub, create a new repository (for example `efa-reevaluation`) and upload the seven files to its main folder.
3. Go to **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two the pages are live at `https://<your-account>.github.io/efa-reevaluation/reevaluation.html` and `.../final-review.html`. Use these full addresses in links to families. The bare site address (ending in `/efa-reevaluation/`) shows "page not found" because there is no `index.html`.

## Yearly check

Holidays are calculated from the statute, so no yearly list is needed. Two cases to watch:

- **Governor-declared closures** (an extra day off): add the date to `extraClosures` in `reevaluation-config.js`.
- **Years when Christmas Eve and Christmas fall on the same observed day** (next in 2027 and 2028): the calculator moves Christmas Eve to the weekday before. Compare it with the official state holiday calendar for that year and add a correction to `extraClosures` if needed.

## If a form question is rebuilt

The deadline link prefills the denial-date question using its field ID (`denialDateEntryId` in `reevaluation-config.js`, currently `438540610` on both forms). If that question is deleted and recreated, open the form, choose **Get pre-filled link**, enter a date, copy the link, and use the number after `entry.` as the new ID.
