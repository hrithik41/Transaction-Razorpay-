/*
  Warnings:

  - You are about to alter the column `fk_product_id` on the `cart` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `product_id` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_fk_product_id_fkey`;

-- AlterTable
ALTER TABLE `cart` MODIFY `fk_product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    MODIFY `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`product_id`);

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_fk_product_id_fkey` FOREIGN KEY (`fk_product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
