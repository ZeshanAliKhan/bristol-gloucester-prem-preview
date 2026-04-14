(function () {
  const yearNode = document.querySelector("[data-year]");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const eventTime = new Date("2026-04-17T19:45:00+01:00");
  const countdownNode = document.querySelector("[data-event-countdown]");
  if (countdownNode) {
    const diff = eventTime.getTime() - Date.now();
    if (diff <= 0) {
      countdownNode.textContent = "Scheduled kickoff time has passed. Check the live notes board.";
    } else {
      const totalHours = Math.floor(diff / 3600000);
      countdownNode.textContent = `${Math.floor(totalHours / 24)}d ${totalHours % 24}h until kickoff`;
    }
  }

  const liveRoot = document.querySelector("[data-live-root]");
  if (!liveRoot) {
    return;
  }

  const fallback = {
    match: "Bristol Bears vs Gloucester Rugby",
    competition: "Gallagher PREM, Round 13",
    status: "Scheduled",
    homeTeam: "Bristol Bears",
    awayTeam: "Gloucester Rugby",
    homeScore: null,
    awayScore: null,
    kickoffLocal: "2026-04-17T19:45:00+01:00",
    venue: "Ashton Gate, Bristol",
    notes: [
      "Kickoff is listed for Friday, April 17, 2026 at 7:45 PM BST.",
      "The match is scheduled at Ashton Gate in Bristol."
    ]
  };

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return escapeHTML(value);
    }
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  function scoreValue(value) {
    return value === null || value === undefined ? "-" : escapeHTML(value);
  }

  function render(data) {
    const notes = Array.isArray(data.notes) ? data.notes : [];
    liveRoot.innerHTML = `
      <div class="live-card">
        <p class="eyebrow">Live update board</p>
        <h2>${escapeHTML(data.match || fallback.match)}</h2>
        <div class="score-strip" aria-label="Current score">
          <span>${escapeHTML(data.homeTeam || fallback.homeTeam)}</span>
          <strong>${scoreValue(data.homeScore)} - ${scoreValue(data.awayScore)}</strong>
          <span>${escapeHTML(data.awayTeam || fallback.awayTeam)}</span>
        </div>
        <div class="info-table">
          <div><span>Status</span><strong>${escapeHTML(data.status || fallback.status)}</strong></div>
          <div><span>Competition</span><strong>${escapeHTML(data.competition || fallback.competition)}</strong></div>
          <div><span>Venue</span><strong>${escapeHTML(data.venue || fallback.venue)}</strong></div>
          <div><span>Kickoff</span><strong>${formatDate(data.kickoffLocal || fallback.kickoffLocal)}</strong></div>
        </div>
        <ul class="note-list">${notes.map((note) => `<li>${escapeHTML(note)}</li>`).join("")}</ul>
      </div>
    `;
  }

  fetch("../data/live-updates.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Live update data unavailable");
      }
      return response.json();
    })
    .then(render)
    .catch(() => render(fallback));
})();
