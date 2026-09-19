/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `departments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[no_telp]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "departments_nama_key";

-- AlterTable
ALTER TABLE "departments" DROP COLUMN "deskripsi";

-- CreateIndex
CREATE UNIQUE INDEX "employee_no_telp_key" ON "employee"("no_telp");
