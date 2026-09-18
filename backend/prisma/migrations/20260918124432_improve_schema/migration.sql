/*
  Warnings:

  - You are about to drop the column `departement_id` on the `employee` table. All the data in the column will be lost.
  - The `status` column on the `employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[nama]` on the table `departments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department_id` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tanggal_masuk` on the `employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('FULL_TIME', 'PART_TIME', 'KELUAR');

-- AlterTable
ALTER TABLE "departments" ALTER COLUMN "deskripsi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "departement_id",
ADD COLUMN     "department_id" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'PART_TIME',
DROP COLUMN "tanggal_masuk",
ADD COLUMN     "tanggal_masuk" DATE NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "departments_nama_key" ON "departments"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE INDEX "employee_department_id_idx" ON "employee"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
