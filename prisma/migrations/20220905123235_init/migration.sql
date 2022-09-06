-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('EXAM', 'HOMEWORK', 'SHORT_TEST', 'ESSAY');

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "AssignmentType" NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);
