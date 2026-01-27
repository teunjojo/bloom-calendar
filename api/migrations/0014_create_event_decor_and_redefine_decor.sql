-- DropIndex
DROP INDEX "_returningDecor_B_index";

-- DropIndex
DROP INDEX "_returningDecor_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_returningDecor";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "EventDecor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "decorId" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "EventDecor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventDecor_decorId_fkey" FOREIGN KEY ("decorId") REFERENCES "Decor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Decor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Decor" ("id", "name", "type") SELECT "id", "name", "type" FROM "Decor";
DROP TABLE "Decor";
ALTER TABLE "new_Decor" RENAME TO "Decor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
