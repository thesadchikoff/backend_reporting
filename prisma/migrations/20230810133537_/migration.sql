/*
  Warnings:

  - Changed the type of `file_size` on the `reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "file_size",
ADD COLUMN     "file_size" INTEGER NOT NULL;
