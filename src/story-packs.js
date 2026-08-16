export const STORY_VARIANT_COUNT = 5;

function cast(kind, label, plural, tone) {
  return Object.freeze({ kind, label, plural, tone, variants: STORY_VARIANT_COUNT });
}

function relationship(first, second, type, message) {
  return Object.freeze({ pair: Object.freeze([first, second]), type, message });
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
    relationship("sun", "cloud", "rainbow", "A rainbow appeared!"),
    relationship("cloud", "flower", "watered", "The flower drank the rain!"),
    relationship("sun", "flower", "warmed", "Warm sunshine!"),
    relationship("friend", "friend", "greeting", "Hello, friend!")
  ]),
  pack("town", "Town trip", "child", [
    cast("child", "child", "Children", 440), cast("car", "car", "Cars", 392),
    cast("bus", "bus", "Buses", 349.23), cast("home", "home", "Homes", 523.25)
  ], [
    relationship("child", "car", "riding", "Ready for a car ride!"),
    relationship("child", "bus", "riding", "All aboard the bus!"),
    relationship("car", "home", "arrived", "The car arrived home!"),
    relationship("bus", "home", "arrived", "The bus reached home!")
  ]),
  pack("castle", "Castle tale", "dragon", [
    cast("dragon", "dragon", "Dragons", 311.13), cast("knight", "knight", "Knights", 392),
    cast("royal", "royal friend", "Royal friends", 523.25), cast("castle", "castle", "Castles", 349.23)
  ], [
    relationship("dragon", "castle", "glowing", "The dragon warms the castle!"),
    relationship("knight", "royal", "greeting", "The friends greet!"),
    relationship("royal", "castle", "arrived", "Welcome to the castle!"),
    relationship("dragon", "knight", "meeting", "Dragon and knight meet!")
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
    if (relation.pair.length !== 2 || relation.pair.some((kind) => !kinds.has(kind)) || !relation.type || !relation.message) {
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
