-- CreateEnum
CREATE TYPE "AnnouncementSource" AS ENUM ('FACEBOOK', 'CUSTOM');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('ACCEPT', 'REJECT', 'PENDING');

-- CreateEnum
CREATE TYPE "PriorityType" AS ENUM ('URGENT', 'IMPORTANT', 'LATER');

-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('ADMIN', 'ORGANIZATION', 'FEDERATION', 'ACADEMIC', 'INTEREST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fname" TEXT,
    "mname" TEXT,
    "lname" TEXT,
    "name" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "ann_ID" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "Source" "AnnouncementSource" NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("ann_ID")
);

-- CreateTable
CREATE TABLE "Facebook_Post" (
    "id" TEXT NOT NULL,
    "ann_ID" TEXT NOT NULL,
    "user_ID" TEXT NOT NULL,
    "page_Name" TEXT NOT NULL,
    "FB_Post_Id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "status" "StatusType" NOT NULL,

    CONSTRAINT "Facebook_Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "To_Dos" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "fbID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_Date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" "PriorityType" NOT NULL,

    CONSTRAINT "To_Dos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FBPage" (
    "pageName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "PageType" NOT NULL,

    CONSTRAINT "FBPage_pkey" PRIMARY KEY ("pageName")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_createdAt_lname_idx" ON "User"("createdAt", "lname");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Announcement_createdBy_title_idx" ON "Announcement"("createdBy", "title");

-- CreateIndex
CREATE INDEX "Announcement_ann_ID_idx" ON "Announcement"("ann_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Facebook_Post_ann_ID_key" ON "Facebook_Post"("ann_ID");

-- CreateIndex
CREATE UNIQUE INDEX "Facebook_Post_FB_Post_Id_key" ON "Facebook_Post"("FB_Post_Id");

-- CreateIndex
CREATE INDEX "Facebook_Post_id_page_Name_idx" ON "Facebook_Post"("id", "page_Name");

-- CreateIndex
CREATE INDEX "To_Dos_priority_idx" ON "To_Dos"("priority");

-- CreateIndex
CREATE INDEX "FBPage_pageName_idx" ON "FBPage"("pageName");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facebook_Post" ADD CONSTRAINT "Facebook_Post_ann_ID_fkey" FOREIGN KEY ("ann_ID") REFERENCES "Announcement"("ann_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facebook_Post" ADD CONSTRAINT "Facebook_Post_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facebook_Post" ADD CONSTRAINT "Facebook_Post_page_Name_fkey" FOREIGN KEY ("page_Name") REFERENCES "FBPage"("pageName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "To_Dos" ADD CONSTRAINT "To_Dos_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "To_Dos" ADD CONSTRAINT "To_Dos_fbID_fkey" FOREIGN KEY ("fbID") REFERENCES "Facebook_Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
