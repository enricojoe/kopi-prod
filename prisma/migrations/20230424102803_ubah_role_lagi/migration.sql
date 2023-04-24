/*
  Warnings:

  - The values [U101,U102,U103] on the enum `ROLES` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLES_new" AS ENUM ('R101', 'R102', 'R103', 'R104');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ROLES_new"[] USING ("role"::text::"ROLES_new"[]);
ALTER TYPE "ROLES" RENAME TO "ROLES_old";
ALTER TYPE "ROLES_new" RENAME TO "ROLES";
DROP TYPE "ROLES_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT ARRAY['R101']::"ROLES"[];
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT ARRAY['R101']::"ROLES"[];
