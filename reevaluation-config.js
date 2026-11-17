/* ============================================================
   EFA REEVALUATION SITE: SETTINGS
   This is the only file most updates will need.
   ============================================================ */
window.EFA_CONFIG = {
  // Google Form "viewform" addresses (the long form of the forms.gle links).
  reevaluationFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdcyV5N5NDQL6EEzHjt52AVqiCkV6gxT8c-QjSmvlAW7Rcitg/viewform",
  finalReviewFormUrl:  "https://docs.google.com/forms/d/e/1FAIpQLSdRJy1gISKrM6UxX_Q9b9pxjtnpIdcHYYKqvCbyT9cQ99FTYQ/viewform",

  // Field ID of the denial-date question. Both forms currently use the same ID.
  // If you rebuild that question, get the new ID from "Get pre-filled link" in Google Forms.
  denialDateEntryId: "438540610",

  // Mailbox for supporting documents.
  documentsEmail: "efareview@ade.arkansas.gov",

  // Where families go with questions (shown in "contact the EFA program office" messages).
  // Replace with the office email, phone, or contact page.
  officeContactText: "[EFA program office contact]",
  officeContactHref: "",   // e.g. "mailto:office@example.gov" or a web address; leave "" for plain text

  // Number of business days families have to submit.
  businessDays: 15,

  // Extra state closure days declared by the Governor (not in Ark. Code § 1-5-101).
  // Format "YYYY-MM-DD". Regular state holidays are calculated automatically.
  extraClosures: [
    // "2026-12-26",
  ]
};
