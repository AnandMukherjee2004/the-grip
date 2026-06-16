(function () {
  var KEY = "theme";
  var preference = "dark";

  try {
    var stored = localStorage.getItem(KEY);
    if (stored === "dark" || stored === "light" || stored === "system") {
      preference = stored;
    } else {
      var legacy = localStorage.getItem("grip-theme");
      if (legacy === "dark" || legacy === "light") {
        preference = legacy;
        localStorage.setItem(KEY, legacy);
        localStorage.removeItem("grip-theme");
      }
    }
  } catch (e) {}

  function resolve(pref) {
    if (pref === "dark") return "dark";
    if (pref === "light") return "light";
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (e) {
      return "dark";
    }
  }

  var resolved = resolve(preference);
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-theme-preference", preference);
})();
