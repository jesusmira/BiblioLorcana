/*
  Warnings:

  - You are about to drop the column `image_uris` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `set_id` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `set_name` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `cards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cards" DROP COLUMN "image_uris",
DROP COLUMN "set_id",
DROP COLUMN "set_name",
DROP COLUMN "version";
