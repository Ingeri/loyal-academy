


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;




ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."ApplicationStatus" AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE "public"."ApplicationStatus" OWNER TO "postgres";


CREATE TYPE "public"."AssessmentType" AS ENUM (
    'EXERCISE',
    'QUIZ',
    'TEST',
    'EXAM'
);


ALTER TYPE "public"."AssessmentType" OWNER TO "postgres";


CREATE TYPE "public"."ConductingType" AS ENUM (
    'Online',
    'OnSite',
    'Hybrid'
);


ALTER TYPE "public"."ConductingType" OWNER TO "postgres";


CREATE TYPE "public"."Level" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
);


ALTER TYPE "public"."Level" OWNER TO "postgres";


CREATE TYPE "public"."PartnershipStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE "public"."PartnershipStatus" OWNER TO "postgres";


CREATE TYPE "public"."PartnershipType" AS ENUM (
    'CONTENT_CREATION',
    'TRAINING',
    'BOTH'
);


ALTER TYPE "public"."PartnershipType" OWNER TO "postgres";


CREATE TYPE "public"."ProjectPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE "public"."ProjectPriority" OWNER TO "postgres";


CREATE TYPE "public"."ProjectStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'IN_REVIEW',
    'QUALITY_CHECK'
);


ALTER TYPE "public"."ProjectStatus" OWNER TO "postgres";


CREATE TYPE "public"."QuoteStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE "public"."QuoteStatus" OWNER TO "postgres";


CREATE TYPE "public"."ScholarshipType" AS ENUM (
    'MERIT_BASED',
    'NEED_BASED',
    'WOMEN_IN_TECH',
    'GENERAL'
);


ALTER TYPE "public"."ScholarshipType" OWNER TO "postgres";


CREATE TYPE "public"."UserRole" AS ENUM (
    'STUDENT',
    'INSTRUCTOR',
    'ADMIN',
    'CAREER_ADVISOR',
    'CLIENT',
    'DONOR'
);


ALTER TYPE "public"."UserRole" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Blog" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "content" "jsonb" NOT NULL,
    "authorName" "text" NOT NULL,
    "readTime" integer NOT NULL,
    "thumbnail" "text",
    "published" boolean DEFAULT false NOT NULL,
    "blogCategoryId" "uuid" NOT NULL,
    "avgRating" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Blog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."BlogCategory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."BlogCategory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."BlogFaq" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "blogId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."BlogFaq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."BlogReview" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rating" integer DEFAULT 5 NOT NULL,
    "comment" "text",
    "reviewerName" "text",
    "reviewerEmail" "text",
    "blogId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."BlogReview" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."CaseStudy" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "imageUrl" "text",
    "clientName" "text" NOT NULL,
    "projectOutcome" "text" NOT NULL,
    "projectId" "uuid" NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."CaseStudy" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL
);


ALTER TABLE "public"."Category" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Certificate" (
    "id" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "courseId" "uuid" NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "certificateNumber" "text" NOT NULL,
    "grade" "text" NOT NULL,
    "finalScore" double precision NOT NULL
);


ALTER TABLE "public"."Certificate" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Course" (
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "thumbnail" "text",
    "published" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "categoryId" "uuid" NOT NULL,
    "avgRating" double precision DEFAULT 0 NOT NULL,
    "discount" numeric(10,2),
    "duration" "text",
    "hasCertificate" boolean DEFAULT true NOT NULL,
    "hasExam" boolean DEFAULT false NOT NULL,
    "level" "public"."Level" DEFAULT 'BEGINNER'::"public"."Level" NOT NULL,
    "price" numeric(10,2) DEFAULT 0 NOT NULL,
    "studentNumber" integer DEFAULT 0 NOT NULL,
    "careerFields" "text"[] DEFAULT ARRAY[]::"text"[],
    "learningOutcomes" "text"[] DEFAULT ARRAY[]::"text"[],
    "overview" "text"[] DEFAULT ARRAY[]::"text"[],
    "conductingType" "public"."ConductingType" DEFAULT 'Online'::"public"."ConductingType" NOT NULL,
    "estimatedSalary" "text",
    "expectedIncome" "text",
    "growthPercentage" double precision,
    "hiringSectors" "text"[] DEFAULT ARRAY[]::"text"[],
    "instructorId" "text" NOT NULL
);


ALTER TABLE "public"."Course" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."CourseProgress" (
    "id" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "courseId" "uuid" NOT NULL,
    "moduleId" "uuid" NOT NULL,
    "lessonId" "uuid"
);


ALTER TABLE "public"."CourseProgress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Enrollment" (
    "id" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "courseId" "uuid" NOT NULL,
    "progress" double precision DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."Enrollment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."FAQ" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" "text" NOT NULL,
    "answer" "text" NOT NULL,
    "courseId" "uuid" NOT NULL
);


ALTER TABLE "public"."FAQ" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."LearnerStory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "role" "text",
    "story" "text" NOT NULL,
    "image" "text",
    "courseId" "uuid" NOT NULL
);


ALTER TABLE "public"."LearnerStory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Lesson" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "content" "jsonb" NOT NULL,
    "order" integer NOT NULL,
    "moduleId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."Lesson" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Module" (
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "courseId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."Module" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Option" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "text" "text" NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "questionId" "uuid" NOT NULL
);


ALTER TABLE "public"."Option" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Partnership" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "companyName" "text" NOT NULL,
    "contactEmail" "text" NOT NULL,
    "contactName" "text" NOT NULL,
    "partnershipType" "public"."PartnershipType" NOT NULL,
    "description" "text" NOT NULL,
    "websiteUrl" "text",
    "status" "public"."PartnershipStatus" DEFAULT 'PENDING'::"public"."PartnershipStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Partnership" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Project" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "budget" numeric(10,2) NOT NULL,
    "timeline" "text" NOT NULL,
    "skillsRequired" "text"[] DEFAULT ARRAY[]::"text"[],
    "status" "public"."ProjectStatus" DEFAULT 'OPEN'::"public"."ProjectStatus" NOT NULL,
    "companyId" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "slug" "text" NOT NULL,
    "adminNotes" "text",
    "milestones" "jsonb",
    "priority" "public"."ProjectPriority" DEFAULT 'MEDIUM'::"public"."ProjectPriority" NOT NULL,
    "assignedTalentId" "text"
);


ALTER TABLE "public"."Project" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ProjectApplication" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "projectId" "uuid" NOT NULL,
    "applicantId" "text" NOT NULL,
    "coverLetter" "text",
    "status" "public"."ApplicationStatus" DEFAULT 'PENDING'::"public"."ApplicationStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "reviewNotes" "text"
);


ALTER TABLE "public"."ProjectApplication" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Question" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "text" "text" NOT NULL,
    "quizId" "uuid" NOT NULL
);


ALTER TABLE "public"."Question" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Quiz" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "type" "public"."AssessmentType" DEFAULT 'QUIZ'::"public"."AssessmentType" NOT NULL,
    "passingScore" integer DEFAULT 70 NOT NULL,
    "lessonId" "uuid",
    "courseId" "uuid" NOT NULL,
    "moduleId" "uuid"
);


ALTER TABLE "public"."Quiz" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."QuizAnswer" (
    "id" "text" NOT NULL,
    "submissionId" "text" NOT NULL,
    "questionId" "uuid" NOT NULL,
    "optionId" "uuid" NOT NULL,
    "isCorrect" boolean NOT NULL
);


ALTER TABLE "public"."QuizAnswer" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."QuizSubmission" (
    "id" "text" NOT NULL,
    "score" double precision NOT NULL,
    "userId" "text" NOT NULL,
    "quizId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "courseId" "uuid"
);


ALTER TABLE "public"."QuizSubmission" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Quote" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "authorName" "text" NOT NULL,
    "authorRole" "text",
    "content" "text" NOT NULL,
    "imageUrl" "text",
    "status" "public"."QuoteStatus" DEFAULT 'PENDING'::"public"."QuoteStatus" NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "reviewedAt" timestamp(3) without time zone,
    "reviewedBy" "text"
);


ALTER TABLE "public"."Quote" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Review" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rating" integer DEFAULT 5 NOT NULL,
    "comment" "text",
    "courseId" "uuid" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."Review" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Scholarship" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "type" "public"."ScholarshipType" NOT NULL,
    "eligibilityCriteria" "jsonb" NOT NULL,
    "applicationDeadline" timestamp(3) without time zone NOT NULL,
    "maxAwards" integer NOT NULL,
    "awardsGranted" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "donorId" "text",
    "donorName" "text" NOT NULL,
    "donorLogoUrl" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "slug" "text" NOT NULL
);


ALTER TABLE "public"."Scholarship" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ScholarshipApplication" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "scholarshipId" "uuid" NOT NULL,
    "applicantId" "text" NOT NULL,
    "motivationLetter" "text" NOT NULL,
    "financialNeedProof" "text",
    "status" "public"."ApplicationStatus" DEFAULT 'PENDING'::"public"."ApplicationStatus" NOT NULL,
    "reviewNotes" "text",
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reviewedAt" timestamp(3) without time zone,
    "reviewedBy" "text",
    "additionalDocuments" "jsonb" DEFAULT '[]'::"jsonb"
);


ALTER TABLE "public"."ScholarshipApplication" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Tag" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."Tag" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "role" "public"."UserRole" DEFAULT 'STUDENT'::"public"."UserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "passwordHash" "text",
    "avatarUrl" "text",
    "bio" "text",
    "notificationPreferences" "jsonb"
);


ALTER TABLE "public"."User" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."_CourseToTag" (
    "A" "uuid" NOT NULL,
    "B" "uuid" NOT NULL
);


ALTER TABLE "public"."_CourseToTag" OWNER TO "postgres";


ALTER TABLE ONLY "public"."BlogCategory"
    ADD CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."BlogFaq"
    ADD CONSTRAINT "BlogFaq_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."BlogReview"
    ADD CONSTRAINT "BlogReview_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Blog"
    ADD CONSTRAINT "Blog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."CaseStudy"
    ADD CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."CourseProgress"
    ADD CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."FAQ"
    ADD CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."LearnerStory"
    ADD CONSTRAINT "LearnerStory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Module"
    ADD CONSTRAINT "Module_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Option"
    ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Partnership"
    ADD CONSTRAINT "Partnership_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ProjectApplication"
    ADD CONSTRAINT "ProjectApplication_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."QuizSubmission"
    ADD CONSTRAINT "QuizSubmission_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ScholarshipApplication"
    ADD CONSTRAINT "ScholarshipApplication_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Scholarship"
    ADD CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."_CourseToTag"
    ADD CONSTRAINT "_CourseToTag_AB_pkey" PRIMARY KEY ("A", "B");



CREATE UNIQUE INDEX "BlogCategory_name_key" ON "public"."BlogCategory" USING "btree" ("name");



CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "public"."BlogCategory" USING "btree" ("slug");



CREATE UNIQUE INDEX "Blog_slug_key" ON "public"."Blog" USING "btree" ("slug");



CREATE UNIQUE INDEX "CaseStudy_projectId_key" ON "public"."CaseStudy" USING "btree" ("projectId");



CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category" USING "btree" ("name");



CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category" USING "btree" ("slug");



CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "public"."Certificate" USING "btree" ("certificateNumber");



CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "public"."Certificate" USING "btree" ("userId", "courseId");



CREATE UNIQUE INDEX "Course_slug_key" ON "public"."Course" USING "btree" ("slug");



CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "public"."Enrollment" USING "btree" ("userId", "courseId");



CREATE UNIQUE INDEX "Lesson_slug_key" ON "public"."Lesson" USING "btree" ("slug");



CREATE UNIQUE INDEX "ProjectApplication_projectId_applicantId_key" ON "public"."ProjectApplication" USING "btree" ("projectId", "applicantId");



CREATE INDEX "Project_assignedTalentId_idx" ON "public"."Project" USING "btree" ("assignedTalentId");



CREATE INDEX "Project_companyId_idx" ON "public"."Project" USING "btree" ("companyId");



CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project" USING "btree" ("slug");



CREATE INDEX "Project_status_idx" ON "public"."Project" USING "btree" ("status");



CREATE INDEX "Quote_status_idx" ON "public"."Quote" USING "btree" ("status");



CREATE UNIQUE INDEX "ScholarshipApplication_applicantId_scholarshipId_key" ON "public"."ScholarshipApplication" USING "btree" ("applicantId", "scholarshipId");



CREATE UNIQUE INDEX "Scholarship_slug_key" ON "public"."Scholarship" USING "btree" ("slug");



CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag" USING "btree" ("name");



CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");



CREATE INDEX "_CourseToTag_B_index" ON "public"."_CourseToTag" USING "btree" ("B");



ALTER TABLE ONLY "public"."BlogFaq"
    ADD CONSTRAINT "BlogFaq_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."BlogReview"
    ADD CONSTRAINT "BlogReview_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Blog"
    ADD CONSTRAINT "Blog_blogCategoryId_fkey" FOREIGN KEY ("blogCategoryId") REFERENCES "public"."BlogCategory"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Certificate"
    ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Certificate"
    ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CourseProgress"
    ADD CONSTRAINT "CourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CourseProgress"
    ADD CONSTRAINT "CourseProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CourseProgress"
    ADD CONSTRAINT "CourseProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."CourseProgress"
    ADD CONSTRAINT "CourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Course"
    ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Course"
    ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Enrollment"
    ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Enrollment"
    ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."FAQ"
    ADD CONSTRAINT "FAQ_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."LearnerStory"
    ADD CONSTRAINT "LearnerStory_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Lesson"
    ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Module"
    ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Option"
    ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ProjectApplication"
    ADD CONSTRAINT "ProjectApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Question"
    ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."Option"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."QuizSubmission"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."QuizSubmission"
    ADD CONSTRAINT "QuizSubmission_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."QuizSubmission"
    ADD CONSTRAINT "QuizSubmission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."QuizSubmission"
    ADD CONSTRAINT "QuizSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Quiz"
    ADD CONSTRAINT "Quiz_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id");



ALTER TABLE ONLY "public"."Quote"
    ADD CONSTRAINT "Quote_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Review"
    ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ScholarshipApplication"
    ADD CONSTRAINT "ScholarshipApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ScholarshipApplication"
    ADD CONSTRAINT "ScholarshipApplication_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ScholarshipApplication"
    ADD CONSTRAINT "ScholarshipApplication_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "public"."Scholarship"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Scholarship"
    ADD CONSTRAINT "Scholarship_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."_CourseToTag"
    ADD CONSTRAINT "_CourseToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Course"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."_CourseToTag"
    ADD CONSTRAINT "_CourseToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON UPDATE CASCADE ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;




































































































































































































