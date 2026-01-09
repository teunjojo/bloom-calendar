-- CreateTable
CREATE TABLE "Forecast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "flowerOfTheMonthId" INTEGER NOT NULL,
    CONSTRAINT "Forecast_flowerOfTheMonthId_fkey" FOREIGN KEY ("flowerOfTheMonthId") REFERENCES "Flower" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Flower" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BigFlowers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BigFlowers_A_fkey" FOREIGN KEY ("A") REFERENCES "Flower" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BigFlowers_B_fkey" FOREIGN KEY ("B") REFERENCES "Forecast" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "int" INTEGER NOT NULL,
    CONSTRAINT "Image_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("eventId", "id", "imageUrl") SELECT "eventId", "id", "imageUrl" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_BigFlowers_AB_unique" ON "_BigFlowers"("A", "B");

-- CreateIndex
CREATE INDEX "_BigFlowers_B_index" ON "_BigFlowers"("B");
