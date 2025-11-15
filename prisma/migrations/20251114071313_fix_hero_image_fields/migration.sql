/*
  Warnings:

  - Added the required column `updatedAt` to the `HeroImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `heroimage` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
