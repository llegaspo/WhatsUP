/*
  Warnings:

  - You are about to drop the column `Source` on the `Announcement` table. All the data in the column will be lost.
  - Added the required column `source` to the `Announcement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "Source",
ADD COLUMN     "source" "AnnouncementSource" NOT NULL;
