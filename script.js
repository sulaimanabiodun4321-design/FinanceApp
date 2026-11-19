const localTime = document.querySelector("#local-time");
const localDate = document.querySelector("#local-date");
const timezone = document.querySelector("#timezone");
const progressValue = document.querySelector("#progress-value");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
function updateClock() {
  const now = new Date();
  const [hours, minutes, seconds] = timeFormat.format(now).split(":");
  localTime.replaceChildren(
    document.createTextNode(`${hours}:${minutes}`),
    Object.assign(document.createElement("span"), {
      className: "seconds",
      textContent: `:${seconds}`,
    }),
  );
  localDate.textContent = dateFormat.format(now);
  timezone.textContent = new Intl.DateTimeFormat(undefined, {
    timeZoneName: "short",
  }).formatToParts(now).find((part) => part.type === "timeZoneName")?.value ?? "LOCAL";

  const elapsedSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const progress = Math.floor((elapsedSeconds / 86400) * 100);
  progressValue.textContent = `${progress}%`;
  progressBar.style.width = `${(elapsedSeconds / 86400) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(progress));

  document.querySelectorAll("[data-zone]").forEach((element) => {
    const zone = element.dataset.zone;
    const cityTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const cityDate = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const [cityHours, cityMinutes, citySeconds] = cityTime.format(now).split(":");
    element.replaceChildren(
      document.createTextNode(`${cityHours}:${cityMinutes}`),
      Object.assign(document.createElement("span"), {
        textContent: `:${citySeconds}`,
      }),
    );
    document.querySelector(`[data-date-zone="${zone}"]`).textContent = cityDate.format(now);
  });
}

updateClock();
window.setInterval(updateClock, 1000);
