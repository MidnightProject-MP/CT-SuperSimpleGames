import {
  createBloom,
  planGardenMerge,
  planBloomPull,
  nearestBloom,
  neighborDistanceForLayout,
  growBloom,
  MAX_BLOOMS
} from "../src/game.js";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampPositionLike(x, y, width, height, radius) {
  return {
    x: Math.min(Math.max(x, radius), Math.max(radius, width - radius)),
    y: Math.min(Math.max(y, radius), Math.max(radius, height - radius))
  };
}

const VIEWPORTS = [
  { name: "portrait 390x844", width: 390, height: 844 },
  { name: "landscape 640x360", width: 640, height: 360 }
];

const STRATEGIES = [
  { label: "pull18 (previous ship)      ", pull: 18, snap: false, gather: false, gatherR: 3.5 },
  { label: "multicolor pull60+snap+gather", pull: 60, snap: true, gather: true, gatherR: 3.5 }
];

const SEEDS = 120;
const MAX_TAPS = 600;
const RELOCATE = 0.12;
const ZONE_SPREAD = 0.24;

function simulate({ width, height }, { pull, snap, gather, gatherR }, seed) {
  const rand = mulberry32(seed);
  const reach = neighborDistanceForLayout(width, height);
  const spread = Math.min(width, height) * ZONE_SPREAD;
  const arrivals = { 1: null, 2: null, vanish: null };
  let blooms = [];
  let nextId = 0;
  let focusX = rand() * width;
  let focusY = rand() * height;
  let vanishes = 0;

  const markArrival = (bloom, taps) => {
    if (arrivals[bloom.tier] === null) arrivals[bloom.tier] = taps;
  };

  const cascade = (taps) => {
    for (;;) {
      const plan = planGardenMerge(blooms, reach, { width, height });
      if (!plan) break;
      const mergedIds = new Set(plan.ids);
      blooms = blooms.filter((bloom) => !mergedIds.has(bloom.id));
      let merged = plan.bloom;
      if (gather && merged.tier === 1) {
        const others = blooms.filter((bloom) => bloom.tier === 1);
        let nearest = null;
        let nearestGap = Infinity;
        for (const other of others) {
          const gap = Math.hypot(other.x - merged.x, other.y - merged.y);
          if (gap < nearestGap) {
            nearestGap = gap;
            nearest = other;
          }
        }
        if (nearest && nearestGap <= reach * gatherR && nearestGap > reach * 0.8) {
          const angle = Math.atan2(nearest.y - merged.y, nearest.x - merged.x);
          const targetGap = reach * 0.8;
          const travel = nearestGap - targetGap;
          const radius = merged.size * 0.43;
          merged = {
            ...merged,
            x: clampPositionLike(merged.x + Math.cos(angle) * travel, merged.y + Math.sin(angle) * travel, width, height, radius).x,
            y: clampPositionLike(merged.x + Math.cos(angle) * travel, merged.y + Math.sin(angle) * travel, width, height, radius).y
          };
        }
      }
      blooms.push(merged);
      markArrival(merged, taps);
    }
    for (;;) {
      const trees = blooms.filter((bloom) => bloom.tier === 2);
      let dissolved = false;
      for (let a = 0; a < trees.length && !dissolved; a += 1) {
        for (let b = a + 1; b < trees.length && !dissolved; b += 1) {
          for (let c = b + 1; c < trees.length && !dissolved; c += 1) {
            const group = [trees[a], trees[b], trees[c]];
            const close = group.every((one) => group.every((other) => one === other || Math.hypot(one.x - other.x, one.y - other.y) <= reach * 2));
            if (!close) continue;
            const ids = new Set(group.map(({ id }) => id));
            blooms = blooms.filter((bloom) => !ids.has(bloom.id));
            vanishes += 1;
            if (arrivals.vanish === null) arrivals.vanish = taps;
            dissolved = true;
          }
        }
      }
      if (!dissolved) break;
    }
  };

  const tend = (target, taps) => {
    const grown = growBloom(target, { width, height });
    const pulled = planBloomPull(grown, blooms, { step: pull, width, height }) ?? grown;
    blooms = blooms.map((bloom) => (bloom.id === target.id ? pulled : bloom));
    cascade(taps);
  };

  for (let taps = 1; taps <= MAX_TAPS; taps += 1) {
    if (rand() < RELOCATE) {
      focusX = rand() * width;
      focusY = rand() * height;
    }
    const x = Math.min(width, Math.max(0, focusX + (rand() - 0.5) * spread));
    const y = Math.min(height, Math.max(0, focusY + (rand() - 0.5) * spread));
    const hit = blooms.find((bloom) => Math.hypot(bloom.x - x, bloom.y - y) <= bloom.size * 0.5);

    if (hit) {
      tend(hit, taps);
    } else if (blooms.length < MAX_BLOOMS) {
      const fresh = createBloom(nextId, x, y, width, height);
      nextId += 1;
      let placed = fresh;
      if (snap) {
        const kin = blooms.filter((bloom) => Math.hypot(bloom.x - x, bloom.y - y) <= reach);
        if (kin.length >= 2) {
          const cx = (kin[0].x + kin[1].x) / 2;
          const cy = (kin[0].y + kin[1].y) / 2;
          placed = { ...fresh, ...clampPositionLike(cx, cy, width, height, fresh.size * 0.43) };
        }
      }
      blooms.push(placed);
      cascade(taps);
    } else {
      tend(nearestBloom(blooms, x, y), taps);
    }
  }

  return {
    tier1: arrivals[1],
    tier2: arrivals[2],
    vanish: arrivals.vanish,
    vanishes,
    endSize: blooms.length
  };
}

function percentile(sorted, p) {
  if (!sorted.length) return "n/a";
  return String(sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))]);
}

function arrivalStats(results, key) {
  return results.map(({ [key]: taps }) => taps).filter((taps) => taps !== null).sort((a, b) => a - b);
}

function summarize(label, results) {
  const t1 = arrivalStats(results, "tier1");
  const t2 = arrivalStats(results, "tier2");
  const vanish = arrivalStats(results, "vanish");
  const share = (sorted, limit) => `${Math.round((sorted.filter((taps) => taps <= limit).length / SEEDS) * 100)}%`;
  const vanishes = results.reduce((sum, run) => sum + run.vanishes, 0) / SEEDS;
  const endSize = results.reduce((sum, run) => sum + run.endSize, 0) / SEEDS;
  return [
    label.padEnd(22),
    `t1<=50 ${share(t1, 50).padStart(3)} med ${percentile(t1, 50).padStart(3)}`,
    `t2<=50 ${share(t2, 50).padStart(3)} <=100 ${share(t2, 100).padStart(3)} med ${percentile(t2, 50).padStart(3)}`,
    `vanish med ${percentile(vanish, 50).padStart(3)} n/run ${vanishes.toFixed(2)}`,
    `end ${endSize.toFixed(1)}`
  ].join(" | ");
}

console.log(`seeds=${SEEDS} maxTaps=${MAX_TAPS}`);
for (const viewport of VIEWPORTS) {
  console.log(`\n== ${viewport.name} ==`);
  for (const strategy of STRATEGIES) {
    const runs = [];
    for (let seed = 0; seed < SEEDS; seed += 1) runs.push(simulate(viewport, strategy, seed));
    console.log(summarize(strategy.label, runs));
  }
}


