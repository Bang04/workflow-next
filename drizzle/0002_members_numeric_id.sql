-- members.id: text('m1') -> serial(1). 기존 값은 앞의 'm'을 떼어 숫자로 변환한다.
-- drizzle-kit이 만든 SQL은 USING 절이 없어 실행되지 않으므로 직접 작성했다.
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_member_id_members_id_fk";--> statement-breakpoint
ALTER TABLE "task_people" DROP CONSTRAINT "task_people_member_id_members_id_fk";--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "id" SET DATA TYPE integer USING substring("id" from 2)::integer;--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "member_id" SET DATA TYPE integer USING substring("member_id" from 2)::integer;--> statement-breakpoint
ALTER TABLE "task_people" ALTER COLUMN "member_id" SET DATA TYPE integer USING substring("member_id" from 2)::integer;--> statement-breakpoint
CREATE SEQUENCE "members_id_seq" OWNED BY "members"."id";--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "id" SET DEFAULT nextval('members_id_seq');--> statement-breakpoint
SELECT setval('members_id_seq', (SELECT COALESCE(MAX("id"), 0) + 1 FROM "members"), false);--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_people" ADD CONSTRAINT "task_people_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
