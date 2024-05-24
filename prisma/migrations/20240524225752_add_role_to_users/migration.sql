-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MENBER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MENBER';
