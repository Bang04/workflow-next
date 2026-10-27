ALTER TABLE "users" ADD COLUMN "naver_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_naver_id_unique" UNIQUE("naver_id");