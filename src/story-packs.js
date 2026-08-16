export const STORY_VARIANT_COUNT = 5;

function cast(kind, label, plural, tone) {
  return Object.freeze({ kind, label, plural, tone, variants: STORY_VARIANT_COUNT });
}

function relationship(first, second, type, active, paused, reversed) {
  return Object.freeze({
    pair: Object.freeze([first, second]),
    type,
    message: active,
    states: Object.freeze([
      Object.freeze({ phase: "active", message: active }),
      Object.freeze({ phase: "paused", message: paused }),
      Object.freeze({ phase: "reversed", message: reversed })
    ])
  });
}

function pack(id, label, defaultKind, castItems, relationships) {
  return Object.freeze({
    id,
    label,
    defaultKind,
    cast: Object.freeze(castItems),
    relationships: Object.freeze(relationships)
  });
}

export const STORY_PACKS = Object.freeze([
  pack("garden", "Garden weather", "flower", [
    cast("flower", "flower", "Flowers", 523.25), cast("friend", "friend", "Friends", 440),
    cast("cloud", "cloud", "Clouds", 349.23), cast("sun", "sun", "Suns", 659.25)
  ], [
    relationship("sun", "cloud", "rainbow", "A rainbow appeared!", "The rainbow is resting.", "The rainbow bends the other way!"),
    relationship("cloud", "flower", "watered", "The flower grows in the rain!", "The raindrops are waiting.", "The flower curls up to rest."),
    relationship("sun", "flower", "warmed", "Warm sunshine!", "The sunshine pauses.", "The flower turns away to cool."),
    relationship("friend", "friend", "greeting", "The friends walk together!", "The friends wait together.", "The friends turn the other way!")
  ]),
  pack("town", "Town trip", "child", [
    cast("child", "child", "Children", 440), cast("car", "car", "Cars", 392),
    cast("bus", "bus", "Buses", 349.23), cast("home", "home", "Homes", 523.25)
  ], [
    relationship("child", "car", "riding", "Ready for a car ride!", "The car waits for its rider.", "The car turns back!"),
    relationship("child", "bus", "riding", "All aboard the bus!", "The bus waits at the stop.", "The bus takes the return trip!"),
    relationship("car", "home", "arrived", "The car stops at home!", "The car waits by the home.", "The car heads out again!"),
    relationship("bus", "home", "arrived", "The bus stops at home!", "The bus waits by the home.", "The bus starts the return trip!")
  ]),
  pack("castle", "Castle tale", "person", [
    cast("person", "person", "People", 392), cast("horse", "horse", "Horses", 349.23),
    cast("armor", "armor", "Armor", 523.25), cast("dragon", "dragon", "Dragons", 311.13)
  ], [
    relationship("person", "horse", "riding", "The person climbs onto the horse!", "Horse and rider take a rest.", "Horse and rider turn around!"),
    relationship("person", "armor", "armored", "The person puts on the armor!", "The shiny armor rests.", "The armor opens again!"),
    relationship("horse", "armor", "saddled", "The horse carries the shiny armor!", "The horse waits beside the armor.", "The horse circles the armor!"),
    relationship("dragon", "person", "meeting", "The person and dragon meet!", "The person and dragon wait.", "The person and dragon make a new plan!")
  ])
]);

export function validateStoryPack(value) {
  if (!value || typeof value.id !== "string" || typeof value.label !== "string") throw new TypeError("story pack needs an identity and label");
  if (!Array.isArray(value.cast) || value.cast.length !== 4) throw new RangeError("story pack cast must contain four families");
  const kinds = new Set(value.cast.map(({ kind }) => kind));
  if (kinds.size !== 4 || !kinds.has(value.defaultKind)) throw new RangeError("story pack cast identities or default are invalid");
  for (const item of value.cast) {
    if (!item.label || !item.plural || item.variants !== STORY_VARIANT_COUNT || !Number.isFinite(item.tone)) throw new TypeError("story cast presentation is incomplete");
  }
  if (!Array.isArray(value.relationships) || value.relationships.length < 3) throw new RangeError("story pack needs three relationships");
  for (const relation of value.relationships) {
    if (relation.pair.length !== 2 || relation.pair.some((kind) => !kinds.has(kind)) || !relation.type || !relation.message
      || !Array.isArray(relation.states) || relation.states.length !== 3
      || relation.states.some((state, index) => state.phase !== ["active", "paused", "reversed"][index] || !state.message)) {
      throw new RangeError("story relationship is incomplete");
    }
  }
  return value;
}

export function getStoryPack(id) {
  const value = STORY_PACKS.find((candidate) => candidate.id === id);
  if (!value) throw new RangeError(`unknown story pack: ${id}`);
  return validateStoryPack(value);
}

export function storyCastItem(pack, kind) {
  const item = pack.cast.find((candidate) => candidate.kind === kind);
  if (!item) throw new RangeError(`unknown ${pack.id} story kind: ${kind}`);
  return item;
}

export function storyRelationship(pack, firstKind, secondKind) {
  return pack.relationships.find(({ pair }) => (
    (pair[0] === firstKind && pair[1] === secondKind) || (pair[0] === secondKind && pair[1] === firstKind)
  )) || null;
}
