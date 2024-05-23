-- CreateIndex
CREATE INDEX "BorrowingTransaction_borrowedAt_idx" ON "BorrowingTransaction"("borrowedAt");

-- CreateIndex
CREATE INDEX "BorrowingTransaction_dueDate_idx" ON "BorrowingTransaction"("dueDate");
