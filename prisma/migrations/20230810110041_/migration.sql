/*
  Warnings:

  - Added the required column `file_size` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "file_size" TEXT NOT NULL,
ADD COLUMN     "is_processed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_reviewed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
