/*
  Warnings:

  - Added the required column `cart_amount` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart` ADD COLUMN `cart_amount` INTEGER NOT NULL;
