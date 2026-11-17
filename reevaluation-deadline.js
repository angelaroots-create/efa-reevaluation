/* ============================================================
   Business-day deadline calculator.
   Holidays follow Ark. Code § 1-5-101(a)-(b): fixed-date holidays that fall
   on a Saturday are observed the Friday before; on a Sunday, the Monday after.
   (The employee birthday holiday in (a)(11) is individual and is not counted.)
   ============================================================ */
(function () {
  function ymd(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function nthWeekday(year, month, weekday, n) {           // month 0-11, weekday 0=Sun
    var d = new Date(year, month, 1);
    var offset = (weekday - d.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + 7 * (n - 1));
  }
  function lastWeekday(year, month, weekday) {
    var d = new Date(year, month + 1, 0);
    d.setDate(d.getDate() - ((d.getDay() - weekday + 7) % 7));
    return d;
  }
  function observed(d) {
    var o = new Date(d);
    if (o.getDay() === 6) o.setDate(o.getDate() - 1);
    else if (o.getDay() === 0) o.setDate(o.getDate() + 1);
    return o;
  }
  function holidaysForYear(y) {
    var list = [
      observed(new Date(y, 0, 1)),        // New Year's Day
      nthWeekday(y, 0, 1, 3),             // Dr. Martin Luther King Jr.'s Birthday
      nthWeekday(y, 1, 1, 3),             // George Washington's Birthday and Daisy Gatson Bates Day
      lastWeekday(y, 4, 1),               // Memorial Day
      observed(new Date(y, 6, 4)),        // Independence Day
      nthWeekday(y, 8, 1, 1),             // Labor Day
      observed(new Date(y, 10, 11)),      // Veterans Day
      nthWeekday(y, 10, 4, 4),            // Thanksgiving Day
      observed(new Date(y, 11, 25))       // Christmas Day
    ];
    // Christmas Eve. When its observed day lands on the same day as Christmas's observed day
    // (e.g., 2027: Dec 24 is Friday and Christmas on Saturday is observed Friday), the statute
    // does not say what happens. This moves Christmas Eve to the business day before.
    // CHECK the official state holiday calendar in those years and use extraClosures if it differs.
    var eve = observed(new Date(y, 11, 24));
    var xmas = list[list.length - 1];
    if (ymd(eve) === ymd(xmas)) {
      eve = new Date(xmas);
      do { eve.setDate(eve.getDate() - 1); } while (eve.getDay() === 0 || eve.getDay() === 6);
    }
    list.push(eve);
    return list.map(ymd);
  }
  var cache = {};
  function isHoliday(d) {
    var y = d.getFullYear();
    // Include neighboring years: New Year's Day on a Saturday is observed Dec 31 of the year before.
    if (!cache[y]) cache[y] = new Set(holidaysForYear(y - 1).concat(holidaysForYear(y), holidaysForYear(y + 1), window.EFA_CONFIG.extraClosures || []));
    return cache[y].has(ymd(d));
  }
  function isBusinessDay(d) {
    return d.getDay() !== 0 && d.getDay() !== 6 && !isHoliday(d);
  }
  // Day 1 is the first business day AFTER the notice date.
  function addBusinessDays(start, n) {
    var d = new Date(start);
    var count = 0;
    while (count < n) {
      d.setDate(d.getDate() + 1);
      if (isBusinessDay(d)) count++;
    }
    return d;
  }
  function businessDaysBetween(from, to) {       // business days after "from" up to and including "to"
    var d = new Date(from), count = 0;
    while (d < to) {
      d.setDate(d.getDate() + 1);
      if (isBusinessDay(d)) count++;
    }
    return count;
  }
  // Today's date in Arkansas (Central time), regardless of the visitor's computer clock zone.
  function todayCentral() {
    var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    var get = function (t) { return Number(parts.find(function (p) { return p.type === t; }).value); };
    return new Date(get("year"), get("month") - 1, get("day"));
  }
  function parseInputDate(value) {               // "YYYY-MM-DD" from <input type="date">
    if (!value) return null;
    var p = value.split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function longDate(d) {
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  window.EFA_DEADLINE = {
    addBusinessDays: addBusinessDays, businessDaysBetween: businessDaysBetween,
    todayCentral: todayCentral, parseInputDate: parseInputDate, longDate: longDate, ymd: ymd,
    holidaysForYear: holidaysForYear
  };
})();
