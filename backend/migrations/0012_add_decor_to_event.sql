-- CreateTable
CREATE TABLE "Decor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "newDecorEventId" INTEGER,
    CONSTRAINT "Decor_newDecorEventId_fkey" FOREIGN KEY ("newDecorEventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_returningDecor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_returningDecor_A_fkey" FOREIGN KEY ("A") REFERENCES "Decor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_returningDecor_B_fkey" FOREIGN KEY ("B") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_returningDecor_AB_unique" ON "_returningDecor"("A", "B");

-- CreateIndex
CREATE INDEX "_returningDecor_B_index" ON "_returningDecor"("B");
