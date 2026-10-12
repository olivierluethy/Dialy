import type { FoodSeed } from '@/data/seedFoods';

/**
 * Soft drinks by brand name, which the food databases (BLV, BLS) only list
 * generically ("Colagetränk, gezuckert"). Values per 100 ml as declared for
 * the Swiss market by the manufacturer (product website or Swiss packaging),
 * checked October 2026 - recipes change, so re-check now and then. 100 ml is
 * treated as 100 g (close enough for soft drinks). No GI known.
 *
 * Drinks without carbohydrates (Coca-Cola Zero etc.) are left out: the
 * KH-Rechner doesn't list 0 g foods.
 */

const GLASS = { label: '1 Glas (2 dl)', grams: 200 };
const CAN_330 = { label: '1 Dose (330 ml)', grams: 330 };
const BOTTLE_500 = { label: '1 Flasche (5 dl)', grams: 500 };

function drink(
  id: string,
  name: string,
  names: FoodSeed['names'],
  carbs: number,
  sugar: number,
  portions: FoodSeed['portions']
): FoodSeed {
  return {
    id: `brand-${id}`,
    name,
    names,
    food_group: 'Süssgetränke',
    categories: ['Alkoholfreie Getränke'],
    carbs_per_100g: carbs,
    sugar_per_100g: sugar,
    fat_per_100g: 0,
    glycemic_index: null,
    portions,
  };
}

export const BRAND_DRINKS: FoodSeed[] = [
  // coca-cola.com/ch
  drink('coca-cola', 'Coca-Cola Original', { en: 'Coca-Cola Original', fr: 'Coca-Cola Original', it: 'Coca-Cola Original' }, 10.6, 10.6, [GLASS, CAN_330, BOTTLE_500]),
  drink('fanta-orange', 'Fanta Orange (Orangenlimonade)', { en: 'Fanta Orange (orange soda)', fr: 'Fanta Orange (limonade à l’orange)', it: 'Fanta Orange (aranciata)' }, 10.2, 10.2, [GLASS, CAN_330, BOTTLE_500]),
  // Swiss packaging (Coca-Cola HBC Schweiz AG), sugar only, no sweeteners
  drink('sprite', 'Sprite (Zitronen-Limetten-Limonade)', { en: 'Sprite (lemon-lime soda)', fr: 'Sprite (limonade citron-citron vert)', it: 'Sprite (gazzosa al limone e lime)' }, 7.9, 7.9, [GLASS, CAN_330, BOTTLE_500]),
  // pepsi.ch - the Swiss Pepsi has much less sugar than the German one
  drink('pepsi', 'Pepsi', { en: 'Pepsi', fr: 'Pepsi', it: 'Pepsi' }, 4.6, 4.6, [GLASS, CAN_330, BOTTLE_500]),
  // rivella.ch
  drink('rivella-rot', 'Rivella Rot (Original)', { en: 'Rivella Red (Original)', fr: 'Rivella Rouge (Original)', it: 'Rivella Rosso (Original)' }, 8.8, 8.8, [GLASS, BOTTLE_500]),
  drink('rivella-gelb', 'Rivella Gelb', { en: 'Rivella Yellow', fr: 'Rivella Jaune', it: 'Rivella Giallo' }, 5.2, 5.2, [GLASS, BOTTLE_500]),
  drink('rivella-gruen', 'Rivella Grün (Grüntee)', { en: 'Rivella Green (green tea)', fr: 'Rivella Vert (thé vert)', it: 'Rivella Verde (tè verde)' }, 5, 5, [GLASS, BOTTLE_500]),
  drink('rivella-blau', 'Rivella Blau', { en: 'Rivella Blue', fr: 'Rivella Bleu', it: 'Rivella Blu' }, 1.5, 1.5, [GLASS, BOTTLE_500]),
  // Swiss packaging
  drink('red-bull', 'Red Bull Energy Drink', { en: 'Red Bull Energy Drink', fr: 'Red Bull Energy Drink', it: 'Red Bull Energy Drink' }, 11, 11, [
    { label: '1 Dose (250 ml)', grams: 250 },
    { label: '1 Dose (355 ml)', grams: 355 },
  ]),
  drink('lipton-ice-tea-lemon', 'Lipton Ice Tea Lemon (Eistee)', { en: 'Lipton Ice Tea Lemon (iced tea)', fr: 'Lipton Ice Tea Lemon (thé froid)', it: 'Lipton Ice Tea Lemon (tè freddo)' }, 4.3, 4.2, [GLASS, BOTTLE_500]),
];
