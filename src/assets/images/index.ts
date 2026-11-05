/**
 * The eight photos from the design (uploaded assets on the canvas).
 * Comment = the alt text the design uses for it.
 */
export const images = {
  /** 1179×640 · "Top-down bowl of yogurt with muesli, berries and dates" — Welcome hero, grocery hero */
  muesliBowlHero: require('./muesli-bowl-hero.jpg'),
  /** 951×477 · "Berry muesli yogurt bowl" — meal cards */
  berryMuesliBowl: require('./berry-muesli-bowl.jpg'),
  /** 506×372 · "Eggs in a paper carton, one cracked" — Egg white omelette card */
  eggsCarton: require('./eggs-carton.jpg'),
  /** 502×372 · "Blueberries in a paper punnet" */
  blueberriesPunnet: require('./blueberries-punnet.jpg'),
  /** 153×173 thumb · "Unsweetened Greek yogurt" */
  greekYogurtThumb: require('./greek-yogurt-thumb.jpg'),
  /** 153×173 thumb · "Pasture-raised eggs in a carton" / "Egg white veggie omelette" */
  eggsThumb: require('./eggs-thumb.jpg'),
  /** 153×173 thumb · "Moong sprout chaat" */
  moongSproutsThumb: require('./moong-sprouts-thumb.jpg'),
  /** 153×173 thumb · "Blueberries" */
  blueberriesThumb: require('./blueberries-thumb.jpg'),
} as const;

/** Design asset id (/_blob/<id>) → image, for translating the design files. */
export const imageByBlobId = {
  e536f25231c38d4d72fb2768c5054885: images.muesliBowlHero,
  '4884e748d6f3c5cd019fed6eb26737e5': images.berryMuesliBowl,
  c06fb6ad17532045d7695e41e697f92c: images.eggsCarton,
  '0e865e08229d847aa16b2b6d12883654': images.blueberriesPunnet,
  e884d54a3597c5a78810dbd4b86a60a8: images.greekYogurtThumb,
  '31c7a1b894dccb4df090ac9875856c98': images.eggsThumb,
  e865055ec5aefa6df874f59a6aac5728: images.moongSproutsThumb,
  '1c09005870e59a836faf9003f01ab850': images.blueberriesThumb,
} as const;
