-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Forecast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "flowerOfTheMonthId" INTEGER NOT NULL,
    "blogLink" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Forecast_flowerOfTheMonthId_fkey" FOREIGN KEY ("flowerOfTheMonthId") REFERENCES "Flower" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Forecast" ("date", "flowerOfTheMonthId", "id") SELECT "date", "flowerOfTheMonthId", "id" FROM "Forecast";
DROP TABLE "Forecast";
ALTER TABLE "new_Forecast" RENAME TO "Forecast";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

