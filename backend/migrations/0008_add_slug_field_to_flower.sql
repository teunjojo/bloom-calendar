-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flower" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);
INSERT INTO "new_Flower" ("id", "name", "slug")
SELECT
    "id",
    "name",
    lower(replace("name", ' ', '-')) AS "slug"
FROM "Flower";
DROP TABLE "Flower";
ALTER TABLE "new_Flower" RENAME TO "Flower";
CREATE UNIQUE INDEX "Flower_slug_key" ON "Flower"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
