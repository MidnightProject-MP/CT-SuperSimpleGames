export function setupFreshStart({ onConfirm }) {
  if (typeof onConfirm !== "function") throw new TypeError("fresh start requires a confirmation action");
  const openButton = document.querySelector("#fresh-start");
  const dialog = document.querySelector("#fresh-dialog");
  const cancelButton = document.querySelector("#fresh-cancel");
  const confirmButton = document.querySelector("#fresh-confirm");
  if (!openButton || !dialog || !cancelButton || !confirmButton) throw new Error("fresh start controls are incomplete");

  function close() {
    dialog.hidden = true;
    openButton.setAttribute("aria-expanded", "false");
    openButton.focus({ preventScroll: true });
  }

  openButton.setAttribute("aria-expanded", "false");
  openButton.addEventListener("click", () => {
    dialog.hidden = false;
    openButton.setAttribute("aria-expanded", "true");
    cancelButton.focus({ preventScroll: true });
  });
  cancelButton.addEventListener("click", close);
  confirmButton.addEventListener("click", () => { onConfirm(); close(); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if (event.key !== "Tab") return;
    const next = event.shiftKey ? confirmButton : cancelButton;
    const edge = event.shiftKey ? cancelButton : confirmButton;
    if (document.activeElement === edge) { event.preventDefault(); next.focus(); }
  });
}
