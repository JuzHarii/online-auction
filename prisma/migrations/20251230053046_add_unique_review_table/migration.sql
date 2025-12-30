/*
  Warnings:

  - A unique constraint covering the columns `[product_id,reviewer_id,reviewee_id]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reviews_product_id_reviewer_id_reviewee_id_key" ON "Reviews"("product_id", "reviewer_id", "reviewee_id");
