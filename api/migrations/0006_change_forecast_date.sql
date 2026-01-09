-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Forecast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "flowerOfTheMonthId" INTEGER NOT NULL,
    CONSTRAINT "Forecast_flowerOfTheMonthId_fkey" FOREIGN KEY ("flowerOfTheMonthId") REFERENCES "Flower" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
-- Populate the new `date` column from whichever previous column exists.
-- This covers previous schemas that used `month`, or `startDate`/`endDate`.
INSERT INTO "new_Forecast" ("flowerOfTheMonthId", "id", "date")
SELECT
    "flowerOfTheMonthId",
    "id",
    COALESCE(
        "date",
        CAST("month" AS TEXT),
        "startDate",
        "endDate",
        '1970-01-01'
    )
FROM "Forecast";
DROP TABLE "Forecast";
ALTER TABLE "new_Forecast" RENAME TO "Forecast";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
