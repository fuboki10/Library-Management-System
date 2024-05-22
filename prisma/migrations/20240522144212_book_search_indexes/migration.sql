-- CreateIndex
CREATE INDEX "Book_ISBN_idx" ON "Book" USING HASH ("ISBN");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_author_idx" ON "Book"("author");
