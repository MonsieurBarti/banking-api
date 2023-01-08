-- CreateTable
CREATE TABLE "services" (
    "id_service" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "public_key" UUID NOT NULL,
    "secret_key" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id_service")
);
