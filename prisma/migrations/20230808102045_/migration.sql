-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
