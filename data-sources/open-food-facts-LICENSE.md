# Open Food Facts data in Dialy

`src/data/offFoods.json` contains branded products sold in Switzerland,
derived from the Open Food Facts database (https://world.openfoodfacts.org).

- **Source:** Open Food Facts contributors, https://world.openfoodfacts.org
- **License of the database:** Open Database License (ODbL) 1.0,
  https://opendatacommons.org/licenses/odbl/1-0/
- **License of the individual contents:** Database Contents License (DbCL)
  1.0, https://opendatacommons.org/licenses/dbcl/1-0/

## What was changed

`src/data/offFoods.json` is a derived database. It was produced from the
Open Food Facts JSONL dump by `scripts/import-off.mjs`, which:

- keeps products sold in Switzerland with a German name and declared
  carbohydrates per 100 g / 100 ml (as sold),
- drops implausible entries (sugar > carbohydrates, macros over 100 g,
  energy not matching the macros), entries with Open Food Facts data-quality
  errors, products already present in Dialy under the same name, and
  duplicates within Open Food Facts,
- keeps only: barcode (as id `off-<barcode>`), name (+ first brand), brand,
  one app category, carbohydrates, sugars, fat per 100 g, and the serving
  size declared on the package,
- rounds values to one decimal.

Counts per rule are in `data-sources/off-import-report.txt`.

## License of the derived database

`src/data/offFoods.json` is made available under the **Open Database License
(ODbL) 1.0** (share-alike). Anyone may use, share and adapt it under the
terms of the ODbL, crediting Open Food Facts. This license applies only to
that file — not to the rest of Dialy's code or data.

The other food data in Dialy (Swiss Food Composition Database / BLV, BLS 4.0,
menuCH, curated foods) is kept separately and is not covered by the ODbL.
