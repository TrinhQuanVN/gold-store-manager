/*
  Warnings:

  - You are about to drop the column `unaccentName` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ContactGroup` table. All the data in the column will be lost.
  - Added the required column `unaccent_name` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unaccent_name" TEXT NOT NULL,
    "address" TEXT,
    "cccd" TEXT,
    "taxcode" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contact_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ContactGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("address", "cccd", "createdAt", "groupId", "id", "name", "phone", "taxcode", "updatedAt") SELECT "address", "cccd", "createdAt", "groupId", "id", "name", "phone", "taxcode", "updatedAt" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE TABLE "new_ContactGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ContactGroup" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "ContactGroup";
DROP TABLE "ContactGroup";
ALTER TABLE "new_ContactGroup" RENAME TO "ContactGroup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
