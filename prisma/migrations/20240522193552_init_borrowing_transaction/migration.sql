-- CreateTable
CREATE TABLE "BorrowingTransaction" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "borrowedAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" DATE,
    "dueDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BorrowingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BorrowingTransaction_userId_bookId_returnedAt_key" ON "BorrowingTransaction"("userId", "bookId", "returnedAt");

-- AddForeignKey
ALTER TABLE "BorrowingTransaction" ADD CONSTRAINT "BorrowingTransaction_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowingTransaction" ADD CONSTRAINT "BorrowingTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
