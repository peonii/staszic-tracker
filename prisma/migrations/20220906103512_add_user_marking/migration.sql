-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "assignmentsCompleted" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
