-- CreateTable
CREATE TABLE "Otpmodel" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otpmodel_pkey" PRIMARY KEY ("id")
);
