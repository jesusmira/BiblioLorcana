/*
  Warnings:

  - You are about to drop the `cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_cards" DROP CONSTRAINT "user_cards_card_id_fkey";

-- DropTable
DROP TABLE "cards";
