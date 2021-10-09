-- CreateTable
CREATE TABLE "Spot" (
    "spotId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hallName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "isClosed" BOOLEAN NOT NULL,
    "capacity" INTEGER NOT NULL,
    "crowdCount" INTEGER NOT NULL,
    "timings" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CrowdLog" (
    "spotId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "clientCount" INTEGER NOT NULL,
    CONSTRAINT "CrowdLog_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot" ("spotId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Meal" (
    "mealId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spotId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "spotSpotId" INTEGER NOT NULL,
    CONSTRAINT "Meal_spotSpotId_fkey" FOREIGN KEY ("spotSpotId") REFERENCES "Spot" ("spotId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CrowdLog_spotId_timestamp_key" ON "CrowdLog"("spotId", "timestamp");
