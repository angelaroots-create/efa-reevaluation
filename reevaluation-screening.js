/* ============================================================
   Shared screening logic for both pages.
   Each page sets data-form="reevaluation" or data-form="final" on <body>.
   ============================================================ */
(function () {
  var C = window.EFA_CONFIG, D = window.EFA_DEADLINE;
  var page = document.body.getAttribute("data-form");
  var subjectPrefix = page === "final" ? "Final review documents - Order " : "Reevaluation documents - Order ";

  function $(id) { return document.getElementById(id); }
  function show(id, on) { var el = $(id); if (el) el.hidden = !on; }

  // Fill in email and office contact everywhere they appear.
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.textContent = C.documentsEmail;
    a.href = "mailto:" + C.documentsEmail + "?subject=" + encodeURIComponent(subjectPrefix);
  });
  document.querySelectorAll("[data-contact]").forEach(function (el) {
    if (C.officeContactHref) {
      var a = document.createElement("a");
      a.href = C.officeContactHref; a.textContent = C.officeContactText;
      el.replaceChildren(a);
    } else {
      el.textContent = C.officeContactText;
    }
  });
  document.querySelectorAll("[data-days]").forEach(function (el) { el.textContent = C.businessDays; });

  // ---- Step 1: reason picker (reevaluation page only) ----
  var reasons = document.querySelectorAll("input[name=reason]");
  reasons.forEach(function (r) {
    r.addEventListener("change", function () {
      var v = r.value;
      show("msg-listed", v === "listed");
      show("msg-technical", v === "technical");
      show("step-date", v === "eligibility");
      if (v !== "eligibility") resetDate();
    });
  });
  var proceedListed = $("proceed-listed");
  if (proceedListed) proceedListed.addEventListener("click", function (e) {
    e.preventDefault();
    show("step-date", true);
    $("denial-date").focus();
  });

  // ---- Step 1 (final review page): confirm a reevaluation denial exists ----
  var priors = document.querySelectorAll("input[name=prior]");
  priors.forEach(function (r) {
    r.addEventListener("change", function () {
      show("msg-noprior", r.value === "no");
      show("step-date", r.value === "yes");
      if (r.value !== "yes") resetDate();
    });
  });

  // ---- Date step ----
  var dateInput = $("denial-date");
  function resetDate() {
    if (!dateInput) return;
    dateInput.value = "";
    show("result-open", false); show("result-closed", false); show("result-future", false);
  }
  if (dateInput) {
    var today = D.todayCentral();
    dateInput.max = D.ymd(today);
    dateInput.addEventListener("change", function () {
      var notice = D.parseInputDate(dateInput.value);
      show("result-open", false); show("result-closed", false); show("result-future", false);
      if (!notice) return;
      if (notice > today) { show("result-future", true); return; }
      var deadline = D.addBusinessDays(notice, C.businessDays);
      if (today <= deadline) {
        var left = D.businessDaysBetween(today, deadline);
        $("deadline-date").textContent = D.longDate(deadline);
        $("days-left").textContent = left === 0 ? "Today is the last day" :
          left + " business day" + (left === 1 ? "" : "s") + " left after today";
        var base = page === "final" ? C.finalReviewFormUrl : C.reevaluationFormUrl;
        $("form-link").href = base + "?usp=pp_url&entry." + C.denialDateEntryId + "=" + dateInput.value;
        show("result-open", true);
      } else {
        $("closed-notice").textContent = D.longDate(notice);
        $("closed-deadline").textContent = D.longDate(deadline);
        show("result-closed", true);
      }
    });
  }
})();
