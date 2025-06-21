-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "unaccentName" TEXT NOT NULL,
    "address" TEXT,
    "cccd" TEXT,
    "taxcode" TEXT,
    "phone" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Contact_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ContactGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("address", "cccd", "createdAt", "groupId", "id", "name", "note", "phone", "taxcode", "unaccentName", "updatedAt") SELECT "address", "cccd", "createdAt", "groupId", "id", "name", "note", "phone", "taxcode", "unaccentName", "updatedAt" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE TABLE "new_ContactGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT 'gray',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_ContactGroup" ("color", "createdAt", "description", "id", "name", "updatedAt") SELECT "color", "createdAt", "description", "id", "name", "updatedAt" FROM "ContactGroup";
DROP TABLE "ContactGroup";
ALTER TABLE "new_ContactGroup" RENAME TO "ContactGroup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
