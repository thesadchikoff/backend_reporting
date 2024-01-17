/*
  Warnings:

  - The values [USER,ADMIN] on the enum `ROLES` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLES_new" AS ENUM ('Employee', 'Manager', 'Director');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "ROLES_new" USING ("role"::text::"ROLES_new");
ALTER TYPE "ROLES" RENAME TO "ROLES_old";
ALTER TYPE "ROLES_new" RENAME TO "ROLES";
DROP TYPE "ROLES_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'Employee';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'Employee';
