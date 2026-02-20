import type { Receipt, Category, ReceiptSummary, TrendsResponse, ItemMapping } from './types'

export const MOCK_CATEGORIES: Category[] = [
  { id: 1,  name: 'Produce',        icon: '🥦', color: '#2d7a4f', is_builtin: true,  is_disabled: false },
  { id: 2,  name: 'Meat & Seafood', icon: '🥩', color: '#c4622d', is_builtin: true,  is_disabled: false },
  { id: 3,  name: 'Dairy & Eggs',   icon: '🥚', color: '#2d5fa0', is_builtin: true,  is_disabled: false },
  { id: 4,  name: 'Snacks',         icon: '🍿', color: '#d4a017', is_builtin: true,  is_disabled: false },
  { id: 5,  name: 'Pantry',         icon: '🥫', color: '#6b4fa0', is_builtin: true,  is_disabled: false },
  { id: 6,  name: 'Beverages',      icon: '☕', color: '#4a90a4', is_builtin: true,  is_disabled: false },
  { id: 7,  name: 'Frozen',         icon: '🧊', color: '#4f7ab0', is_builtin: true,  is_disabled: false },
  { id: 8,  name: 'Household',      icon: '🧹', color: '#8a7d6b', is_builtin: true,  is_disabled: false },
  { id: 9,  name: 'Cleaning',       icon: '🧼', color: '#7ab04f', is_builtin: true,  is_disabled: false },
  { id: 10, name: 'Other',          icon: '📦', color: '#b08a4f', is_builtin: true,  is_disabled: false },
]

export const MOCK_RECEIPT: Receipt = {
  id: 42,
  store_name: 'H-E-B',
  receipt_date: '2026-02-16',
  scanned_at: '2026-02-16T20:14:00Z',
  status: 'pending',
  total: 121.70,
  tax: 3.24,
  total_verified: false,
  verification_message: 'Items sum to $118.46 + tax $3.24 = $121.70 — could not confirm.',
  ocr_raw: `H-E-B GROCERY
RECEIPT
02/16/2026

NATURES OWN WH WHT ROUNDT   7.24
  2 @ 3.62 EA
OTB CAFE TORT CHIPS 150Z     7.76
  2 @ 3.88 EA
HEB TX ROOTS CAMPARI TOMA FW 3.47
HEB D CH SS                  7.06
MS CHICKEN POT PIE LG        8.99
ORGANC WHOLML                4.99
LAYS CLASSIC CHIPS           5.49
HEB BUTTER UNSALTED          6.49
DANNON LIGHT FIT YGT         3.29
HEB SHREDDED MOZZ            4.79
LEAN CUISINE MEALS           8.99
TIDE PODS                   14.97
HEB DISH SOAP                3.49
BOUNTY SELECT A SIZE         12.99
REYNOLDS WRAP FOIL           8.99
HEB DRINKING WATER           5.49
CELSIUS ENERGY               9.96
                         --------
SUBTOTAL                   118.46
TAX                          3.24
                         --------
TOTAL                      121.70`,
  image_path: null,
  thumbnail_path: null,
  items: [
    { id: 1,  raw_name: 'NATURES OWN WH WHT ROUNDT',    clean_name: "Nature's Own Whole Wheat Roundtop",           category: 'Pantry',        category_source: 'learned', price: 3.62,  quantity: 2, receipt_id: 42 },
    { id: 2,  raw_name: 'OTB CAFE TORT CHIPS 150Z',     clean_name: 'OTB Cafe Tortilla Chips 15oz',               category: 'Snacks',        category_source: 'learned', price: 3.88,  quantity: 2, receipt_id: 42 },
    { id: 3,  raw_name: 'HEB TX ROOTS CAMPARI TOMA FW', clean_name: 'H-E-B Texas Roots Campari Tomatoes',         category: 'Produce',       category_source: 'learned', price: 3.47,  quantity: 1, receipt_id: 42 },
    { id: 4,  raw_name: 'HEB D CH SS',                  clean_name: 'H-E-B Dilley Dill Chips Sweet & Spicy',      category: 'Snacks',        category_source: 'learned', price: 7.06,  quantity: 1, receipt_id: 42 },
    { id: 5,  raw_name: 'MS CHICKEN POT PIE LG',        clean_name: "Marie Callender's Chicken Pot Pie Large",    category: 'Frozen',        category_source: 'ai',      price: 8.99,  quantity: 1, receipt_id: 42 },
    { id: 6,  raw_name: 'ORGANC WHOLML',                clean_name: 'Organic Whole Milk',                         category: 'Dairy & Eggs',  category_source: 'ai',      price: 4.99,  quantity: 1, receipt_id: 42 },
    { id: 7,  raw_name: 'LAYS CLASSIC CHIPS',           clean_name: "Lay's Classic Potato Chips",                 category: 'Snacks',        category_source: 'learned', price: 5.49,  quantity: 1, receipt_id: 42 },
    { id: 8,  raw_name: 'HEB BUTTER UNSALTED',          clean_name: 'H-E-B Unsalted Butter',                      category: 'Dairy & Eggs',  category_source: 'learned', price: 6.49,  quantity: 1, receipt_id: 42 },
    { id: 9,  raw_name: 'DANNON LIGHT FIT YGT',         clean_name: 'Dannon Light + Fit Yogurt',                  category: 'Dairy & Eggs',  category_source: 'ai',      price: 3.29,  quantity: 1, receipt_id: 42 },
    { id: 10, raw_name: 'HEB SHREDDED MOZZ',            clean_name: 'H-E-B Shredded Mozzarella',                  category: 'Dairy & Eggs',  category_source: 'learned', price: 4.79,  quantity: 1, receipt_id: 42 },
    { id: 11, raw_name: 'LEAN CUISINE MEALS',           clean_name: 'Lean Cuisine Frozen Meals',                  category: 'Frozen',        category_source: 'ai',      price: 8.99,  quantity: 1, receipt_id: 42 },
    { id: 12, raw_name: 'TIDE PODS',                    clean_name: 'Tide Pods Laundry Detergent',                category: 'Household',     category_source: 'learned', price: 14.97, quantity: 1, receipt_id: 42 },
    { id: 13, raw_name: 'HEB DISH SOAP',                clean_name: 'H-E-B Dish Soap',                            category: 'Cleaning',      category_source: 'learned', price: 3.49,  quantity: 1, receipt_id: 42 },
    { id: 14, raw_name: 'BOUNTY SELECT A SIZE',         clean_name: 'Bounty Select-A-Size Paper Towels',          category: 'Household',     category_source: 'learned', price: 12.99, quantity: 1, receipt_id: 42 },
    { id: 15, raw_name: 'REYNOLDS WRAP FOIL',           clean_name: 'Reynolds Wrap Aluminum Foil',                category: 'Household',     category_source: 'ai',      price: 8.99,  quantity: 1, receipt_id: 42 },
    { id: 16, raw_name: 'HEB DRINKING WATER',           clean_name: 'H-E-B Purified Drinking Water',              category: 'Beverages',     category_source: 'learned', price: 5.49,  quantity: 1, receipt_id: 42 },
    { id: 17, raw_name: 'CELSIUS ENERGY',               clean_name: 'Celsius Energy Drink',                       category: 'Beverages',     category_source: 'ai',      price: 9.96,  quantity: 1, receipt_id: 42 },
  ],
}

export const MOCK_RECEIPTS: ReceiptSummary[] = [
  { id: 42, store_name: 'H-E-B',   receipt_date: '2026-02-16', scanned_at: '2026-02-16T20:14:00Z', status: 'pending',  total: 121.70, item_count: 17 },
  { id: 41, store_name: 'Costco',  receipt_date: '2026-02-12', scanned_at: '2026-02-12T15:30:00Z', status: 'verified', total: 230.22, item_count: 31 },
  { id: 40, store_name: 'H-E-B',   receipt_date: '2026-02-04', scanned_at: '2026-02-04T11:20:00Z', status: 'verified', total:  98.45, item_count: 14 },
  { id: 39, store_name: 'Target',  receipt_date: '2026-01-28', scanned_at: '2026-01-28T18:05:00Z', status: 'verified', total:  67.12, item_count: 9  },
  { id: 38, store_name: 'Costco',  receipt_date: '2026-01-15', scanned_at: '2026-01-15T13:45:00Z', status: 'verified', total: 198.80, item_count: 24 },
  { id: 37, store_name: 'H-E-B',   receipt_date: '2026-01-08', scanned_at: '2026-01-08T19:22:00Z', status: 'verified', total:  84.33, item_count: 12 },
  { id: 36, store_name: 'Walmart', receipt_date: '2025-12-29', scanned_at: '2025-12-29T16:10:00Z', status: 'verified', total: 143.67, item_count: 21 },
  { id: 35, store_name: 'H-E-B',   receipt_date: '2025-12-21', scanned_at: '2025-12-21T12:00:00Z', status: 'verified', total: 112.90, item_count: 16 },
]

export const MOCK_TRENDS: TrendsResponse = {
  categories: ['Produce','Meat & Seafood','Dairy & Eggs','Snacks','Pantry','Beverages','Frozen','Household','Cleaning'],
  months: [
    { year: 2025, month: 9,  month_label: 'Sep 2025', total: 198.40, by_category: { 'Produce': 32.10, 'Meat & Seafood': 54.20, 'Dairy & Eggs': 28.40, 'Snacks': 15.60, 'Pantry': 38.90, 'Beverages': 12.30, 'Frozen': 0,     'Household': 11.20, 'Cleaning': 5.70  } },
    { year: 2025, month: 10, month_label: 'Oct 2025', total: 226.15, by_category: { 'Produce': 41.80, 'Meat & Seafood': 62.50, 'Dairy & Eggs': 31.20, 'Snacks': 18.90, 'Pantry': 42.10, 'Beverages': 9.80,  'Frozen': 8.50,  'Household': 7.35,  'Cleaning': 4.00  } },
    { year: 2025, month: 11, month_label: 'Nov 2025', total: 284.60, by_category: { 'Produce': 28.90, 'Meat & Seafood': 88.40, 'Dairy & Eggs': 35.60, 'Snacks': 22.40, 'Pantry': 55.20, 'Beverages': 14.50, 'Frozen': 18.20, 'Household': 14.40, 'Cleaning': 7.00  } },
    { year: 2025, month: 12, month_label: 'Dec 2025', total: 312.80, by_category: { 'Produce': 38.20, 'Meat & Seafood': 96.30, 'Dairy & Eggs': 42.10, 'Snacks': 31.60, 'Pantry': 61.40, 'Beverages': 18.20, 'Frozen': 9.50,  'Household': 10.50, 'Cleaning': 5.00  } },
    { year: 2026, month: 1,  month_label: 'Jan 2026', total: 349.25, by_category: { 'Produce': 19.50, 'Meat & Seafood': 78.90, 'Dairy & Eggs': 29.80, 'Snacks': 24.10, 'Pantry': 88.40, 'Beverages': 22.10, 'Frozen': 42.50, 'Household': 34.45, 'Cleaning': 9.50  } },
    { year: 2026, month: 2,  month_label: 'Feb 2026', total: 247.80, by_category: { 'Produce': 9.20,  'Meat & Seafood': 23.10, 'Dairy & Eggs': 19.56, 'Snacks': 13.00, 'Pantry': 34.20, 'Beverages': 15.45, 'Frozen': 17.98, 'Household': 36.95, 'Cleaning': 21.46 } },
  ],
}

export const MOCK_MAPPINGS: ItemMapping[] = [
  { id: 1,  normalized_key: 'naturesownwhwhtrundt',      display_name: "Nature's Own Whole Wheat Roundtop",  category: 'Pantry',        source: 'learned', times_seen: 14, last_seen: '2026-02-16T20:14:00Z' },
  { id: 2,  normalized_key: 'otbcafefortchips150z',      display_name: 'OTB Cafe Tortilla Chips 15oz',        category: 'Snacks',        source: 'learned', times_seen: 8,  last_seen: '2026-02-16T20:14:00Z' },
  { id: 3,  normalized_key: 'hebtxrootscamparitomfw',    display_name: 'H-E-B Texas Roots Campari Tomatoes', category: 'Produce',       source: 'learned', times_seen: 6,  last_seen: '2026-02-16T20:14:00Z' },
  { id: 4,  normalized_key: 'hebdchss',                  display_name: 'H-E-B Dilley Dill Chips',             category: 'Snacks',        source: 'learned', times_seen: 11, last_seen: '2026-02-16T20:14:00Z' },
  { id: 5,  normalized_key: 'hebbuttrunsaltd',           display_name: 'H-E-B Unsalted Butter',               category: 'Dairy & Eggs',  source: 'learned', times_seen: 22, last_seen: '2026-02-16T20:14:00Z' },
  { id: 6,  normalized_key: 'laysclassicchips',          display_name: "Lay's Classic Potato Chips",          category: 'Snacks',        source: 'learned', times_seen: 5,  last_seen: '2026-02-16T20:14:00Z' },
  { id: 7,  normalized_key: 'hebshrddmozz',              display_name: 'H-E-B Shredded Mozzarella',           category: 'Dairy & Eggs',  source: 'learned', times_seen: 9,  last_seen: '2026-02-16T20:14:00Z' },
  { id: 8,  normalized_key: 'tidepods',                  display_name: 'Tide Pods Laundry Detergent',         category: 'Household',     source: 'learned', times_seen: 7,  last_seen: '2026-02-16T20:14:00Z' },
  { id: 9,  normalized_key: 'hebdishsoap',               display_name: 'H-E-B Dish Soap',                     category: 'Cleaning',      source: 'learned', times_seen: 12, last_seen: '2026-02-12T15:30:00Z' },
  { id: 10, normalized_key: 'bountyseleasize',           display_name: 'Bounty Select-A-Size Paper Towels',   category: 'Household',     source: 'learned', times_seen: 10, last_seen: '2026-02-16T20:14:00Z' },
  { id: 11, normalized_key: 'hebdrinkingwater',          display_name: 'H-E-B Purified Drinking Water',       category: 'Beverages',     source: 'learned', times_seen: 18, last_seen: '2026-02-16T20:14:00Z' },
]
