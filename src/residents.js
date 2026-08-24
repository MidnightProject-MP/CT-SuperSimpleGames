export const RESIDENT_TOUCHES = 3;

function completionFor(board) {
  return Boolean(board?.completed || board?.isComplete);
}

export function colorSplashResidentFor(board) {
  if (!completionFor(board)) return null;
  return { type: "butterfly", touches: RESIDENT_TOUCHES };
}

export function storyResidentFor({ scene, objectCount } = {}) {
  if (scene !== "garden" || !(objectCount >= 3)) return null;
  return { type: "snail", touches: RESIDENT_TOUCHES };
}

export function attachResident({ layer, resident, className, label, onTouch }) {
  let button = layer.querySelector(`.${className}[data-type="${resident.type}"]`);
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.type = resident.type;
    const art = document.createElement("span");
    art.className = "resident-art";
    art.setAttribute("aria-hidden", "true");
    art.append(document.createElement("i"), document.createElement("i"));
    button.setAttribute("aria-label", `${label}; touch to say hello`);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      onTouch?.(button);
    });
    button.append(art);
    layer.append(button);
  }
  return button;
}
