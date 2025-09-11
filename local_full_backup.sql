--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

-- Started on 2025-09-11 11:51:00 +03

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

ALTER TABLE ONLY public.videos DROP CONSTRAINT "videos_lessonId_fkey";
ALTER TABLE ONLY public.video_analytics DROP CONSTRAINT "video_analytics_videoId_fkey";
ALTER TABLE ONLY public.video_analytics DROP CONSTRAINT "video_analytics_userId_fkey";
ALTER TABLE ONLY public.video_analytics DROP CONSTRAINT "video_analytics_lessonId_fkey";
ALTER TABLE ONLY public.user_sessions DROP CONSTRAINT "user_sessions_userId_fkey";
ALTER TABLE ONLY public.user_sessions DROP CONSTRAINT "user_sessions_deviceId_fkey";
ALTER TABLE ONLY public.user_devices DROP CONSTRAINT "user_devices_userId_fkey";
ALTER TABLE ONLY public.sections DROP CONSTRAINT "sections_courseId_fkey";
ALTER TABLE ONLY public.questions DROP CONSTRAINT "questions_userId_fkey";
ALTER TABLE ONLY public.questions DROP CONSTRAINT "questions_lessonId_fkey";
ALTER TABLE ONLY public.questions DROP CONSTRAINT "questions_courseId_fkey";
ALTER TABLE ONLY public.orders DROP CONSTRAINT "orders_userId_fkey";
ALTER TABLE ONLY public.orders DROP CONSTRAINT "orders_courseId_fkey";
ALTER TABLE ONLY public.notes DROP CONSTRAINT "notes_userId_fkey";
ALTER TABLE ONLY public.notes DROP CONSTRAINT "notes_lessonId_fkey";
ALTER TABLE ONLY public.messages DROP CONSTRAINT "messages_userId_fkey";
ALTER TABLE ONLY public.messages DROP CONSTRAINT "messages_adminId_fkey";
ALTER TABLE ONLY public.message_replies DROP CONSTRAINT "message_replies_userId_fkey";
ALTER TABLE ONLY public.message_replies DROP CONSTRAINT "message_replies_messageId_fkey";
ALTER TABLE ONLY public.message_attachments DROP CONSTRAINT "message_attachments_messageId_fkey";
ALTER TABLE ONLY public.lessons DROP CONSTRAINT "lessons_sectionId_fkey";
ALTER TABLE ONLY public.lesson_progress DROP CONSTRAINT "lesson_progress_userId_fkey";
ALTER TABLE ONLY public.lesson_progress DROP CONSTRAINT "lesson_progress_lessonId_fkey";
ALTER TABLE ONLY public.device_enroll_requests DROP CONSTRAINT "device_enroll_requests_userId_fkey";
ALTER TABLE ONLY public.courses DROP CONSTRAINT "courses_instructorId_fkey";
ALTER TABLE ONLY public.course_views DROP CONSTRAINT "course_views_userId_fkey";
ALTER TABLE ONLY public.course_views DROP CONSTRAINT "course_views_courseId_fkey";
ALTER TABLE ONLY public.answers DROP CONSTRAINT "answers_userId_fkey";
ALTER TABLE ONLY public.answers DROP CONSTRAINT "answers_questionId_fkey";
ALTER TABLE ONLY public.analytics_events DROP CONSTRAINT "analytics_events_userId_fkey";
ALTER TABLE ONLY public.access_grants DROP CONSTRAINT "access_grants_userId_fkey";
ALTER TABLE ONLY public.access_grants DROP CONSTRAINT "access_grants_orderId_fkey";
ALTER TABLE ONLY public.access_grants DROP CONSTRAINT "access_grants_courseId_fkey";
DROP INDEX public."videos_lessonId_key";
DROP INDEX public.users_email_key;
DROP INDEX public."user_sessions_sessionId_key";
DROP INDEX public."user_devices_installId_key";
DROP INDEX public.site_settings_key_key;
DROP INDEX public.pages_slug_key;
DROP INDEX public."orders_orderNumber_key";
DROP INDEX public."lesson_progress_userId_lessonId_key";
DROP INDEX public."device_enroll_requests_requestId_key";
DROP INDEX public.courses_slug_key;
DROP INDEX public.coupons_code_key;
DROP INDEX public."access_grants_userId_courseId_key";
ALTER TABLE ONLY public.videos DROP CONSTRAINT videos_pkey;
ALTER TABLE ONLY public.video_analytics DROP CONSTRAINT video_analytics_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.user_sessions DROP CONSTRAINT user_sessions_pkey;
ALTER TABLE ONLY public.user_devices DROP CONSTRAINT user_devices_pkey;
ALTER TABLE ONLY public.site_settings DROP CONSTRAINT site_settings_pkey;
ALTER TABLE ONLY public.sections DROP CONSTRAINT sections_pkey;
ALTER TABLE ONLY public.questions DROP CONSTRAINT questions_pkey;
ALTER TABLE ONLY public.pages DROP CONSTRAINT pages_pkey;
ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_pkey;
ALTER TABLE ONLY public.navigation DROP CONSTRAINT navigation_pkey;
ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
ALTER TABLE ONLY public.message_replies DROP CONSTRAINT message_replies_pkey;
ALTER TABLE ONLY public.message_attachments DROP CONSTRAINT message_attachments_pkey;
ALTER TABLE ONLY public.lessons DROP CONSTRAINT lessons_pkey;
ALTER TABLE ONLY public.lesson_progress DROP CONSTRAINT lesson_progress_pkey;
ALTER TABLE ONLY public.device_enroll_requests DROP CONSTRAINT device_enroll_requests_pkey;
ALTER TABLE ONLY public.courses DROP CONSTRAINT courses_pkey;
ALTER TABLE ONLY public.course_views DROP CONSTRAINT course_views_pkey;
ALTER TABLE ONLY public.coupons DROP CONSTRAINT coupons_pkey;
ALTER TABLE ONLY public.answers DROP CONSTRAINT answers_pkey;
ALTER TABLE ONLY public.analytics_events DROP CONSTRAINT analytics_events_pkey;
ALTER TABLE ONLY public.access_grants DROP CONSTRAINT access_grants_pkey;
ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
DROP TABLE public.videos;
DROP TABLE public.video_analytics;
DROP TABLE public.users;
DROP TABLE public.user_sessions;
DROP TABLE public.user_devices;
DROP TABLE public.site_settings;
DROP TABLE public.sections;
DROP TABLE public.questions;
DROP TABLE public.pages;
DROP TABLE public.orders;
DROP TABLE public.notes;
DROP TABLE public.navigation;
DROP TABLE public.messages;
DROP TABLE public.message_replies;
DROP TABLE public.message_attachments;
DROP TABLE public.lessons;
DROP TABLE public.lesson_progress;
DROP TABLE public.device_enroll_requests;
DROP TABLE public.courses;
DROP TABLE public.course_views;
DROP TABLE public.coupons;
DROP TABLE public.answers;
DROP TABLE public.analytics_events;
DROP TABLE public.access_grants;
DROP TABLE public._prisma_migrations;
DROP TYPE public."VideoAction";
DROP TYPE public."UserRole";
DROP TYPE public."PaymentMethod";
DROP TYPE public."OrderStatus";
DROP TYPE public."MessageType";
DROP TYPE public."MessageStatus";
DROP TYPE public."EnrollStatus";
DROP TYPE public."CourseViewType";
DROP TYPE public."CourseLevel";
DROP TYPE public."CouponType";
DROP TYPE public."AnalyticsEventType";
--
-- TOC entry 909 (class 1247 OID 44010)
-- Name: AnalyticsEventType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AnalyticsEventType" AS ENUM (
    'PAGE_VIEW',
    'COURSE_VIEW',
    'VIDEO_PLAY',
    'VIDEO_PAUSE',
    'VIDEO_COMPLETE',
    'NOTE_CREATE',
    'QUESTION_ASK',
    'ANSWER_CREATE',
    'LOGIN',
    'LOGOUT',
    'SEARCH',
    'PURCHASE'
);


--
-- TOC entry 858 (class 1247 OID 43108)
-- Name: CouponType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CouponType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT'
);


--
-- TOC entry 852 (class 1247 OID 43078)
-- Name: CourseLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CourseLevel" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
);


--
-- TOC entry 912 (class 1247 OID 44036)
-- Name: CourseViewType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CourseViewType" AS ENUM (
    'THUMBNAIL_CLICK',
    'COURSE_PAGE_VIEW',
    'VIDEO_START',
    'VIDEO_PROGRESS',
    'VIDEO_COMPLETE'
);


--
-- TOC entry 855 (class 1247 OID 43098)
-- Name: EnrollStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EnrollStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'DENIED',
    'EXPIRED'
);


--
-- TOC entry 939 (class 1247 OID 74899)
-- Name: MessageStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MessageStatus" AS ENUM (
    'UNREAD',
    'READ',
    'REPLIED',
    'CLOSED'
);


--
-- TOC entry 942 (class 1247 OID 74908)
-- Name: MessageType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MessageType" AS ENUM (
    'QUESTION',
    'SUPPORT',
    'FEEDBACK',
    'GENERAL'
);


--
-- TOC entry 936 (class 1247 OID 52354)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'REFUNDED'
);


--
-- TOC entry 933 (class 1247 OID 52345)
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CREDIT_CARD',
    'BANK_TRANSFER',
    'PAYPAL',
    'STRIPE'
);


--
-- TOC entry 849 (class 1247 OID 43068)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'STUDENT',
    'INSTRUCTOR',
    'EDITOR',
    'ADMIN'
);


--
-- TOC entry 915 (class 1247 OID 44048)
-- Name: VideoAction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VideoAction" AS ENUM (
    'PLAY',
    'PAUSE',
    'SEEK',
    'COMPLETE',
    'NOTE_CREATE',
    'QUESTION_ASK'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 43058)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 43170)
-- Name: access_grants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_grants (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "startAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "orderId" text
);


--
-- TOC entry 226 (class 1259 OID 44061)
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id text NOT NULL,
    "userId" text,
    "eventType" public."AnalyticsEventType" NOT NULL,
    "eventData" jsonb NOT NULL,
    metadata jsonb,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 43222)
-- Name: answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answers (
    id text NOT NULL,
    "userId" text NOT NULL,
    "questionId" text NOT NULL,
    content text NOT NULL,
    "isAccepted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 43265)
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id text NOT NULL,
    code text NOT NULL,
    type public."CouponType" NOT NULL,
    value numeric(10,2) NOT NULL,
    "maxUses" integer,
    "usedCount" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "validFrom" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "validUntil" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 44079)
-- Name: course_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_views (
    id text NOT NULL,
    "courseId" text NOT NULL,
    "userId" text,
    "viewType" public."CourseViewType" NOT NULL,
    duration integer,
    progress double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 43124)
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    thumbnail text,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    duration integer NOT NULL,
    level public."CourseLevel" NOT NULL,
    language text DEFAULT 'tr'::text NOT NULL,
    "instructorId" text NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    keywords text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 43191)
-- Name: device_enroll_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.device_enroll_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    "installId" text,
    platform text NOT NULL,
    model text,
    ip text NOT NULL,
    "geoCountry" text,
    "requestId" text NOT NULL,
    status public."EnrollStatus" DEFAULT 'PENDING'::public."EnrollStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 43200)
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_progress (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    progress double precision DEFAULT 0 NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "lastPosition" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


--
-- TOC entry 213 (class 1259 OID 43144)
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "videoUrl" text,
    duration integer NOT NULL,
    "order" integer NOT NULL,
    "sectionId" text NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "videoKey" text,
    thumbnail text,
    subtitles jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isFree" boolean DEFAULT false NOT NULL,
    resources jsonb,
    "videoType" text DEFAULT 'VIDEO'::text,
    "pdfKey" text,
    "pdfUrl" text,
    "contentType" text DEFAULT 'VIDEO'::text,
    "pdfFileName" text,
    "pdfPages" integer,
    "pdfSize" integer
);


--
-- TOC entry 233 (class 1259 OID 74936)
-- Name: message_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_attachments (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "fileName" text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileType" text NOT NULL,
    "fileSize" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 74927)
-- Name: message_replies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_replies (
    id text NOT NULL,
    "messageId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 74917)
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id text NOT NULL,
    "userId" text NOT NULL,
    "adminId" text,
    subject text NOT NULL,
    content text NOT NULL,
    "messageType" public."MessageType" NOT NULL,
    status public."MessageStatus" DEFAULT 'UNREAD'::public."MessageStatus" NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 43247)
-- Name: navigation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.navigation (
    id text NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    items jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 43231)
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    content text NOT NULL,
    "timestamp" double precision,
    "isPublic" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 43153)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "userId" text NOT NULL,
    currency text DEFAULT 'TRY'::text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    amount numeric(10,2) NOT NULL,
    "courseId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "invoiceNumber" text,
    metadata jsonb,
    "paymentIntentId" text,
    "purchasedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paymentMethod" public."PaymentMethod" NOT NULL,
    "billingInfo" jsonb,
    "orderNumber" text NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 43256)
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content jsonb NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 43212)
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text,
    title text NOT NULL,
    content text NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "isAccepted" boolean DEFAULT false NOT NULL,
    "acceptedAnswerId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "courseId" text NOT NULL
);


--
-- TOC entry 212 (class 1259 OID 43135)
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer NOT NULL,
    "courseId" text NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    "totalLessons" integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 43240)
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 43180)
-- Name: user_devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_devices (
    id text NOT NULL,
    "userId" text NOT NULL,
    "installId" text NOT NULL,
    "publicKey" text NOT NULL,
    platform text NOT NULL,
    model text,
    "userAgent" text,
    "firstIp" text NOT NULL,
    "lastIp" text NOT NULL,
    "lastSeenAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isTrusted" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "approvedAt" timestamp(3) without time zone,
    "deviceName" text,
    "osVersion" text,
    "appVersion" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 44069)
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    "sessionId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastActivity" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "deviceId" text
);


--
-- TOC entry 210 (class 1259 OID 43113)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'STUDENT'::public."UserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerifiedAt" timestamp(3) without time zone,
    avatar text,
    phone text,
    bio text,
    website text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 44087)
-- Name: video_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.video_analytics (
    id text NOT NULL,
    "videoId" text NOT NULL,
    "userId" text,
    "lessonId" text,
    action public."VideoAction" NOT NULL,
    "timestamp" double precision,
    duration integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 44095)
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    url text NOT NULL,
    thumbnail text,
    duration integer NOT NULL,
    "lessonId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 4063 (class 0 OID 43058)
-- Dependencies: 209
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
77c16569-f4c3-4c67-9d3b-ea509128a317	2354749d9a3c2e32767c1219582012f4fcc1a30bd89cc6a85dfd46314d9f8b28	2025-08-17 13:18:04.465778+03	20250811175910_yrdt	\N	\N	2025-08-17 13:18:04.331352+03	1
6009f607-34ef-46db-a0f9-8cdef85d384e	777a5508e98ab013dd5963b21af7a4d6cb8c3bcc2937ba23cbafbca62d5d42f9	2025-08-17 13:18:05.86052+03	20250817101805_add_course_questions	\N	\N	2025-08-17 13:18:05.813449+03	1
1910f463-4156-44f2-8e09-342e3faa4358	240c834dc2f83916754ebe77a692795a1f1ca5407f4f255b86b86cb68606404d	2025-09-09 15:34:03.675825+03	20250909123403_	\N	\N	2025-09-09 15:34:03.669688+03	1
90b4fd7a-1be7-4177-8288-0e9b0622e668	2e833ebbaf642697fbb4826368c0162511d61222b00b95bae1bd5966bf8374f4	2025-08-17 13:53:29.57143+03	20250817105329_add_lesson_section_fields	\N	\N	2025-08-17 13:53:29.56703+03	1
e7b2cd6f-e871-4842-95c4-62fde4322a83	42a69d0d63698b49ea230313c9661884922afb790fc80cf300d224a52243aaa7	2025-08-24 18:33:34.273055+03	20250824153334_update_orders	\N	\N	2025-08-24 18:33:34.183872+03	1
8e804327-2cce-4c6f-bf04-f5908e355aeb	b32e7809696b5d87e83f7345004d1982757bc2e42049ae684d575a7c3f40fd0f	2025-08-24 18:47:38.747403+03	20250824154738_add_semester_system	\N	\N	2025-08-24 18:47:38.717886+03	1
38820f6d-d98b-4147-ab3e-e0e704c96db0	9843972ae01fc6938c813292fd6e41c1cce3575e4339912cddd800ebb83ab53f	2025-08-24 19:08:46.952708+03	20250824160846_simplify_orders_remove_semesters	\N	\N	2025-08-24 19:08:46.947456+03	1
08c257b0-d819-4bba-8d42-a97b7ae574bb	2e680badba60e8efa82e8664e377251f6f5035e2fe5fb864412dc6fa69ae033f	2025-08-25 21:32:27.877664+03	20250825183134_add_order_number_and_billing_info	\N	\N	2025-08-25 21:32:27.860394+03	1
5f546298-eee3-42fb-a789-0e060c7d4cef	beaf909919b45f53c6fc334306157088bf83e13d7953f568a3987cec170fcdee	2025-08-28 19:08:39.269264+03	20250828160839_add_media_system	\N	\N	2025-08-28 19:08:39.220382+03	1
532fef0a-9dcd-4720-b8ce-fb3065729ea1	39109d63db9c139aa2ea0e0c78c884ca43893090e727843635d1be1d08732e5f	2025-08-30 21:47:25.624767+03	20250830184725_add_messaging_system	\N	\N	2025-08-30 21:47:25.608902+03	1
00150ee2-8b53-43ba-87fe-c43d38205e91	352efccf4db64d2b4c0fdde31991770ac1ee89c6e9d4f2da0bb925e354568217	2025-08-30 22:39:47.549964+03	20250830193947_add_messaging_system	\N	\N	2025-08-30 22:39:47.498568+03	1
cf8ba281-298c-4e26-825f-092d5f63b4f9	50c9bd7f2fe445999fb79780a15e87a3ffc38995b8fc00e38c1d9f6d944c1832	2025-08-30 23:37:51.374601+03	20250830203751_add_isread_to_messagereply	\N	\N	2025-08-30 23:37:51.368495+03	1
8afc33cc-fcb4-404c-9a1c-40b770aa9814	b3ed1a25181f08a4ddb135bd0eb48813e73dfc9b0cb5bf8929f3f56699050efd	2025-09-02 18:50:07.884267+03	20250902155007_add_pdf_lessons	\N	\N	2025-09-02 18:50:07.854275+03	1
5e6ef6c6-ad4a-4165-b87d-445a6583b66c	d27cd6d8b339772fe0b1de1bf40044c5bc7ecccc12df6ada9503f2eff49b51ca	2025-09-02 20:19:58.43264+03	20250902171958_add_pdf_support	\N	\N	2025-09-02 20:19:58.427252+03	1
\.


--
-- TOC entry 4069 (class 0 OID 43170)
-- Dependencies: 215
-- Data for Name: access_grants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.access_grants (id, "userId", "courseId", "startAt", "endAt", "isActive", "createdAt", "updatedAt", "orderId") FROM stdin;
cmes9zv5h000ljfu53kdgz21m	cmeq07kdg000011t85ugqazgn	cmemoben00001209tmfmy699k	2025-08-26 08:20:05.622	2026-08-26 08:20:05.593	t	2025-08-26 08:20:05.622	2025-08-26 08:20:05.622	cmes9zv4r000jjfu5g3bou84o
cmergnn5z00092dubfmetizug	cmeq07kdg000011t85ugqazgn	cmefj94hb0004dv47705jkgdf	2025-08-25 18:38:46.536	2026-08-28 19:30:32.727	t	2025-08-25 18:38:46.536	2025-08-28 19:30:32.741	cmevstrx40019f1pdhuommczx
\.


--
-- TOC entry 4080 (class 0 OID 44061)
-- Dependencies: 226
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_events (id, "userId", "eventType", "eventData", metadata, "ipAddress", "userAgent", "createdAt") FROM stdin;
\.


--
-- TOC entry 4074 (class 0 OID 43222)
-- Dependencies: 220
-- Data for Name: answers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.answers (id, "userId", "questionId", content, "isAccepted", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4079 (class 0 OID 43265)
-- Dependencies: 225
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons (id, code, type, value, "maxUses", "usedCount", "isActive", "validFrom", "validUntil", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4082 (class 0 OID 44079)
-- Dependencies: 228
-- Data for Name: course_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course_views (id, "courseId", "userId", "viewType", duration, progress, "createdAt") FROM stdin;
\.


--
-- TOC entry 4065 (class 0 OID 43124)
-- Dependencies: 211
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.courses (id, title, slug, description, thumbnail, price, currency, duration, level, language, "instructorId", "isPublished", "metaTitle", "metaDescription", keywords, "createdAt", "updatedAt") FROM stdin;
cmemoben00001209tmfmy699k	Vue.js Temelleri	vue.js-temelleri	Vue.js ile modern web uygulamaları	\N	236.00	TRY	2096	BEGINNER	tr	cmefj940d0000dv47ygoytq4w	t	\N	\N	\N	2025-08-22 10:14:21.658	2025-09-09 18:50:40.86
cmefj94hb0004dv47705jkgdf	Web Development Basics	web-development-basics	Learn the fundamentals of web development with HTML, CSS, and JavaScript	\N	99.99	TRY	480	BEGINNER	tr	cmefj948t0001dv47qdb5yn6x	t	Web Development Basics - Learn HTML, CSS, JavaScript	Start your web development journey with this comprehensive course	\N	2025-08-17 10:18:13.872	2025-08-22 10:47:57.394
cmemmitvr0003rpck976vt0ij	Python ile Veri Bilimi	python-ile-veri-bilimi	Python kullanarak veri analizi ve makine öğrenmesi	\N	199.99	TRY	0	INTERMEDIATE	tr	cmefj940d0000dv47ygoytq4w	t	\N	\N	\N	2025-08-22 09:24:08.775	2025-08-22 10:47:58.947
cmemo2ucr0001izzkore2bsvj	JavaScript Temelleri	javascript-temelleri	Modern JavaScript ile web geliştirme	\N	150.00	TRY	0	BEGINNER	tr	cmefj940d0000dv47ygoytq4w	t	\N	\N	\N	2025-08-22 10:07:42.123	2025-08-22 10:47:59.696
\.


--
-- TOC entry 4071 (class 0 OID 43191)
-- Dependencies: 217
-- Data for Name: device_enroll_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.device_enroll_requests (id, "userId", "installId", platform, model, ip, "geoCountry", "requestId", status, "createdAt", "expiresAt") FROM stdin;
cmewqr7sj0009nb2q56v9eus5	cmeq07kdg000011t85ugqazgn	web_1756466419971_x2co4vf0l	web	Unknown	::1	\N	enroll_1756466420275_klzgfkfzs	APPROVED	2025-08-29 11:20:20.275	2025-08-29 11:35:20.275
cmesjkrkx0001uwz1rp9tlqc3	cmeq07kdg000011t85ugqazgn	web_1756212496939_wvtyh1oyz	web	Unknown	::1	\N	enroll_1756212497307_x0cqch4ve	APPROVED	2025-08-26 12:48:17.309	2025-08-26 13:03:17.307
cmetvntp4000bita1r6af0h4v	cmeq07kdg000011t85ugqazgn	web_1756293261207_ng88j4obb	web	Unknown	::1	\N	enroll_1756293261591_w81oemk3g	APPROVED	2025-08-27 11:14:21.592	2025-08-27 11:29:21.591
cmev2hj970005m4eo34rhp0ry	cmeq07kdg000011t85ugqazgn	web_1756365190847_vxabq4mu2	web	Unknown	::1	\N	enroll_1756365191611_1czx6ugg1	APPROVED	2025-08-28 07:13:11.612	2025-08-28 07:28:11.611
cmevkszh300011qi1r5kneeji	cmeq07kdg000011t85ugqazgn	web_1756395958602_59qpcg8xj	web	Unknown	::1	\N	enroll_1756395958934_1poyikyso	APPROVED	2025-08-28 15:45:58.935	2025-08-28 16:00:58.934
cmevqi89x000bf1pdy1n4ew9b	cmefj940d0000dv47ygoytq4w	web_1756405534395_wrqrq8q0v	web	Unknown	::1	\N	enroll_1756405534820_q8rv1m03m	APPROVED	2025-08-28 18:25:34.821	2025-08-28 18:40:34.82
cmevtchf5001jf1pdgxgxvkxw	cmefj940d0000dv47ygoytq4w	web_1756410305076_sa1u84gy1	web	Unknown	::1	\N	enroll_1756410305585_6tdee8pql	APPROVED	2025-08-28 19:45:05.586	2025-08-28 20:00:05.585
cmex1k7hj000713ucid8wj4sb	cmeq07kdg000011t85ugqazgn	web_1756484568751_pswilj200	web	Unknown	::1	\N	enroll_1756484569063_4dvbrntvp	APPROVED	2025-08-29 16:22:49.063	2025-08-29 16:37:49.063
cmeyj2v4k0001wb1nr3pnh1s2	cmeq07kdg000011t85ugqazgn	web_1756574458860_z5o4b24uy	web	Unknown	::1	\N	enroll_1756574459155_m910207kg	APPROVED	2025-08-30 17:20:59.156	2025-08-30 17:35:59.155
cmeypav0v0001cqfsvr8r5mp5	cmefj940d0000dv47ygoytq4w	web_1756584909685_re6ajrxtr	web	Unknown	::1	\N	enroll_1756584909964_1wi0geh17	APPROVED	2025-08-30 20:15:09.965	2025-08-30 20:30:09.964
cmeyqp354000gdsnc2dt9lrim	cmefj940d0000dv47ygoytq4w	web_1756587253008_6ldz6ceeg	web	Unknown	::1	\N	enroll_1756587253288_6b14un850	APPROVED	2025-08-30 20:54:13.288	2025-08-30 21:09:13.288
cmezv0e530005vtp3rgfehx12	cmeq07kdg000011t85ugqazgn	web_1756654965096_ghmgaried	web	Unknown	::1	\N	enroll_1756654965399_y2uov7708	APPROVED	2025-08-31 15:42:45.399	2025-08-31 15:57:45.399
cmf0u7gz80001f69eu9gqng9h	cmeq07kdg000011t85ugqazgn	web_1756714081923_b5dw95dxr	web	Unknown	::1	\N	enroll_1756714082227_nqjz71xxh	APPROVED	2025-09-01 08:08:02.228	2025-09-01 08:23:02.227
cmf2t3u8w0001rkp6wfadagol	cmefj940d0000dv47ygoytq4w	web_1756833164902_41rd7gza1	MacIntel	Mac	127.0.0.1	\N	enroll_1756833165533_2cejqksgg	APPROVED	2025-09-02 17:12:45.534	2025-09-02 17:27:45.533
cmewras88000jnb2qwcugspwo	cmeq07kdg000011t85ugqazgn	web_1756467332908_slimk430w	web	Unknown	::1	\N	enroll_1756467333223_begtq1yvp	APPROVED	2025-08-29 11:35:33.224	2025-08-29 11:50:33.224
cmesul0e10001m26pem0wkjhp	cmeq07kdg000011t85ugqazgn	web_1756230984205_trasi46t8	web	Unknown	::1	\N	enroll_1756230984502_fdgizywth	APPROVED	2025-08-26 17:56:24.503	2025-08-26 18:11:24.502
cmetw92w6000fita13yqvgexy	cmefj940d0000dv47ygoytq4w	web_1756294252929_n5ufmwj8w	web	Unknown	::1	\N	enroll_1756294253285_yyr1wb3dz	APPROVED	2025-08-27 11:30:53.286	2025-08-27 11:45:53.285
cmev9hx360001117xtsprx65d	cmeq07kdg000011t85ugqazgn	web_1756376966545_0zmhlv3jy	web	Unknown	::1	\N	enroll_1756376966848_ry5w6uywy	APPROVED	2025-08-28 10:29:26.849	2025-08-28 10:44:26.848
cmevlxre600011n5h33b3inkj	cmefj940d0000dv47ygoytq4w	web_1756397861048_1x13kwrp2	web	Unknown	::1	\N	enroll_1756397861357_af6rh90hz	APPROVED	2025-08-28 16:17:41.358	2025-08-28 16:32:41.357
cmevr8rit000lf1pdv8qnybv0	cmefj940d0000dv47ygoytq4w	web_1756406771995_ndt3hja72	web	Unknown	::1	\N	enroll_1756406772820_8c0cd2y8g	APPROVED	2025-08-28 18:46:12.821	2025-08-28 19:01:12.82
cmewigs320001cmpyft37alej	cmefj940d0000dv47ygoytq4w	web_1756452496053_uic9s0030	web	Unknown	::1	\N	enroll_1756452496429_jpnt2fnlk	APPROVED	2025-08-29 07:28:16.43	2025-08-29 07:43:16.429
cmex27i5n000b13uceatlpx2x	cmeq07kdg000011t85ugqazgn	web_1756485655623_uv7h9w9lz	web	Unknown	::1	\N	enroll_1756485655978_vdw6n0ccb	APPROVED	2025-08-29 16:40:55.979	2025-08-29 16:55:55.978
cmeyk51xk0007wb1nhbhb91pj	cmeq07kdg000011t85ugqazgn	web_1756576240618_a5p6853pr	web	Unknown	::1	\N	enroll_1756576240904_ggsv9acmy	APPROVED	2025-08-30 17:50:40.904	2025-08-30 18:05:40.904
cmeypj7380001w1zy28es9zwa	cmefj940d0000dv47ygoytq4w	web_1756585298554_zb5u934j4	web	Unknown	::1	\N	enroll_1756585298850_bh82xr5ww	APPROVED	2025-08-30 20:21:38.851	2025-08-30 20:36:38.85
cmeyqrw4x000mdsnc4785ydrf	cmeq07kdg000011t85ugqazgn	web_1756587383823_ezemjxc0s	web	Unknown	::1	\N	enroll_1756587384177_b47ptilaa	APPROVED	2025-08-30 20:56:24.178	2025-08-30 21:11:24.177
cmf00bfbi000113dboqy311y9	cmeq07kdg000011t85ugqazgn	web_1756663877283_u9mp1izbj	web	Unknown	::1	\N	enroll_1756663878220_ojzwp5m0k	APPROVED	2025-08-31 18:11:18.222	2025-08-31 18:26:18.22
cmf0u9lby0001fmy09xkkoka9	cmeq07kdg000011t85ugqazgn	web_1756714180756_gwtsdfouo	web	Unknown	::1	\N	enroll_1756714181181_36dyjhlwx	APPROVED	2025-09-01 08:09:41.182	2025-09-01 08:24:41.181
cmewrffze0001yix0x1bipdkq	cmeq07kdg000011t85ugqazgn	web_1756467550333_avy4m2sai	web	Unknown	::1	\N	enroll_1756467550634_5u5lgy04t	APPROVED	2025-08-29 11:39:10.635	2025-08-29 11:54:10.634
cmesv7bs00007m26pradx3ann	cmeq07kdg000011t85ugqazgn	web_1756232025342_6dyqbhunm	web	Unknown	::1	\N	enroll_1756232025696_jsmys4qgt	APPROVED	2025-08-26 18:13:45.697	2025-08-26 18:28:45.696
cmetz6y9k000jita1yo7ive9q	cmefj940d0000dv47ygoytq4w	web_1756299192497_qctlaty9z	web	Unknown	::1	\N	enroll_1756299192822_kgioyem3m	APPROVED	2025-08-27 12:53:12.824	2025-08-27 13:08:12.823
cmev0b7ym0001a877zqhselew	cmeq07kdg000011t85ugqazgn	web_1756361537467_oa6h5mss8	web	Unknown	::1	\N	enroll_1756361537804_qq5hl9a0f	APPROVED	2025-08-28 06:12:17.805	2025-08-28 06:27:17.804
cmev9sddz0001jhfsmoso8k2i	cmeq07kdg000011t85ugqazgn	web_1756377454167_kbzhzp8ih	web	Unknown	::1	\N	enroll_1756377454534_yjozuynkt	APPROVED	2025-08-28 10:37:34.535	2025-08-28 10:52:34.535
cmev9snog0007jhfs8ta4thrg	cmefj940d0000dv47ygoytq4w	web_1756377467433_62iub51vv	web	Unknown	::1	\N	enroll_1756377467871_kwyl8k0vi	APPROVED	2025-08-28 10:37:47.872	2025-08-28 10:52:47.871
cmevjwq9t0001mu9d3u2eillp	cmeq07kdg000011t85ugqazgn	web_1756394453643_ookaru390	web	Unknown	::1	\N	enroll_1756394454012_ixd9uhnds	APPROVED	2025-08-28 15:20:54.014	2025-08-28 15:35:54.012
cmevmhux00001ewbdfmiojdph	cmefj940d0000dv47ygoytq4w	web_1756398797599_1t00y1cqw	web	Unknown	::1	\N	enroll_1756398799041_efz1h84sm	APPROVED	2025-08-28 16:33:19.044	2025-08-28 16:48:19.042
cmevrb0bj000pf1pdo9ty7iv5	cmeq07kdg000011t85ugqazgn	web_1756406877194_xhrakwusg	web	Unknown	::1	\N	enroll_1756406877535_ub7a8rv2b	APPROVED	2025-08-28 18:47:57.536	2025-08-28 19:02:57.535
cmewki1yp0001g2dgjglixual	cmefj940d0000dv47ygoytq4w	web_1756455914838_tcmonublv	web	Unknown	::1	\N	enroll_1756455915120_939m5muyb	APPROVED	2025-08-29 08:25:15.121	2025-08-29 08:40:15.12
cmex2vapf000h13ucj51iq3iq	cmeq07kdg000011t85ugqazgn	web_1756486765779_oaa7ngi5l	web	Unknown	::1	\N	enroll_1756486766067_hu5beo7a6	APPROVED	2025-08-29 16:59:26.068	2025-08-29 17:14:26.067
cmeyl0c2x0001r518ker5wqs4	cmeq07kdg000011t85ugqazgn	web_1756577700117_0d4mrzjdp	web	Unknown	::1	\N	enroll_1756577700392_qob0in19s	APPROVED	2025-08-30 18:15:00.393	2025-08-30 18:30:00.392
cmeypkcxb0005w1zyklo9t0h1	cmefj940d0000dv47ygoytq4w	web_1756585352748_5cp86p2ks	web	Unknown	::1	\N	enroll_1756585353071_6xpfnpe2y	APPROVED	2025-08-30 20:22:33.072	2025-08-30 20:37:33.071
cmezdhql20001eg9jq9u80nkz	cmefj940d0000dv47ygoytq4w	web_1756625541301_oe2xk9ix0	web	Unknown	::1	\N	enroll_1756625541587_sj93o3b0i	APPROVED	2025-08-31 07:32:21.588	2025-08-31 07:47:21.587
cmf03v4yi000ta6bv97xjo108	cmeq07kdg000011t85ugqazgn	web_1756669836478_lratvrghx	web	Unknown	::1	\N	enroll_1756669836761_q6izhia93	APPROVED	2025-08-31 19:50:36.763	2025-08-31 20:05:36.761
cmf0uptou0007fmy0oijn56lp	cmeq07kdg000011t85ugqazgn	web_1756714938199_myyhs150e	web	Unknown	::1	\N	enroll_1756714938510_w2qghtbvd	APPROVED	2025-09-01 08:22:18.511	2025-09-01 08:37:18.51
cmesa20kr000rjfu5mdtvhn1k	cmeq07kdg000011t85ugqazgn	web_1756196505602_lwvys0g3r	web	Unknown	::1	\N	enroll_1756196505962_ihp4gdma8	APPROVED	2025-08-26 08:21:45.963	2025-08-26 08:36:45.962
cmeswacn4000110xw77s0176s	cmeq07kdg000011t85ugqazgn	web_1756233846035_doeabd0xq	web	Unknown	::1	\N	enroll_1756233846394_xl6m75sv6	APPROVED	2025-08-26 18:44:06.396	2025-08-26 18:59:06.394
cmev0hdz20007a877ssjdt2i5	cmefj940d0000dv47ygoytq4w	web_1756361825215_oth3ba7bs	web	Unknown	::1	\N	enroll_1756361825534_qcvfw7u7n	APPROVED	2025-08-28 06:17:05.534	2025-08-28 06:32:05.534
cmev9ziis0001qyazxdgjjxqv	cmeq07kdg000011t85ugqazgn	web_1756377787485_q8qkja2d0	web	Unknown	::1	\N	enroll_1756377787777_6sifra0i3	APPROVED	2025-08-28 10:43:07.778	2025-08-28 10:58:07.777
cmevkfvxr000138n6pqoqum13	cmeq07kdg000011t85ugqazgn	web_1756395347460_sstig3gog	web	Unknown	::1	\N	enroll_1756395347817_lnbzm3xip	APPROVED	2025-08-28 15:35:47.819	2025-08-28 15:50:47.818
cmevn8qjb0001gwdaylan5jx9	cmefj940d0000dv47ygoytq4w	web_1756400052654_i6gzxbyk1	web	Unknown	::1	\N	enroll_1756400053076_6r6o36xt7	APPROVED	2025-08-28 16:54:13.078	2025-08-28 17:09:13.076
cmevsgo91000tf1pdx86bhlud	cmeq07kdg000011t85ugqazgn	web_1756408821146_v0zlfl4bw	web	Unknown	::1	\N	enroll_1756408821445_9fw60k0jc	APPROVED	2025-08-28 19:20:21.446	2025-08-28 19:35:21.445
cmewl4n4f0001soecxmkgodut	cmefj940d0000dv47ygoytq4w	web_1756456968691_kensajtmx	web	Unknown	::1	\N	enroll_1756456968972_myuyizfh0	APPROVED	2025-08-29 08:42:48.973	2025-08-29 08:57:48.972
cmews5b4o003vyix0c4o2wu3r	cmeq07kdg000011t85ugqazgn	web_1756468757085_0fmzl5olv	web	Unknown	::1	\N	enroll_1756468757399_z3it0mjbp	APPROVED	2025-08-29 11:59:17.4	2025-08-29 12:14:17.399
cmey9izws000l13uc68e0j6rm	cmeq07kdg000011t85ugqazgn	web_1756558415416_fi7cyynnt	web	Unknown	::1	\N	enroll_1756558415690_mgczct5fs	APPROVED	2025-08-30 12:53:35.691	2025-08-30 13:08:35.69
cmeymhtbu0001riluprd9luqj	cmeq07kdg000011t85ugqazgn	web_1756580195231_jk0ba7znu	web	Unknown	::1	\N	enroll_1756580195513_f5lwraohr	APPROVED	2025-08-30 18:56:35.514	2025-08-30 19:11:35.513
cmeypsvzg000bw1zyr6c5q0lf	cmeq07kdg000011t85ugqazgn	web_1756585750716_t1vby5b0k	web	Unknown	::1	\N	enroll_1756585751020_hb69tclq7	APPROVED	2025-08-30 20:29:11.021	2025-08-30 20:44:11.02
cmezdit7p0007eg9jegr71dn0	cmeq07kdg000011t85ugqazgn	web_1756625591361_5zfgk56ov	web	Unknown	::1	\N	enroll_1756625591652_t1qumsi6n	APPROVED	2025-08-31 07:33:11.653	2025-08-31 07:48:11.652
cmf048n850001mdmxlmn680jv	cmeq07kdg000011t85ugqazgn	web_1756670466585_ggzs6n969	web	Unknown	::1	\N	enroll_1756670466963_rm3vx8256	APPROVED	2025-08-31 20:01:06.964	2025-08-31 20:16:06.963
cmf0uup700001ke2w26u4egnl	cmeq07kdg000011t85ugqazgn	web_1756715165267_2ltd4to38	MacIntel	Mac	127.0.0.1	\N	enroll_1756715165963_wcimu7oc5	APPROVED	2025-09-01 08:26:05.964	2025-09-01 08:41:05.963
cmesae0my0001e4ercumwcma0	cmeq07kdg000011t85ugqazgn	web_1756197065640_2c3r4fada	web	Unknown	::1	\N	enroll_1756197065914_hosvbl0i6	APPROVED	2025-08-26 08:31:05.915	2025-08-26 08:46:05.914
cmetm800100014mxcyuq2xeft	cmeq07kdg000011t85ugqazgn	web_1756277406384_uzmygark2	web	Unknown	::1	\N	enroll_1756277406717_sg12xoza3	APPROVED	2025-08-27 06:50:06.719	2025-08-27 07:05:06.717
cmev0jgw8000ba877ibg2kefb	cmeq07kdg000011t85ugqazgn	web_1756361922334_ziq7y37hz	web	Unknown	::1	\N	enroll_1756361922631_lnhze1hmn	APPROVED	2025-08-28 06:18:42.632	2025-08-28 06:33:42.631
cmevdzae00001zr1xvz52brqm	cmeq07kdg000011t85ugqazgn	web_1756384495381_s6s8epgv8	web	Unknown	::1	\N	enroll_1756384495699_ykgd7yaug	APPROVED	2025-08-28 12:34:55.702	2025-08-28 12:49:55.7
cmevkghgo000738n6z8mo7b5m	cmeq07kdg000011t85ugqazgn	web_1756395375446_bar4dhkll	web	Unknown	::1	\N	enroll_1756395375720_lc2kwuybg	APPROVED	2025-08-28 15:36:15.721	2025-08-28 15:51:15.72
cmevnthtk0005gwdabk4r75l5	cmefj940d0000dv47ygoytq4w	web_1756401021287_y6clhlzcb	web	Unknown	::1	\N	enroll_1756401021560_liffvk25i	APPROVED	2025-08-28 17:10:21.561	2025-08-28 17:25:21.56
cmevsp7vl000zf1pdpf9i1qx5	cmefj940d0000dv47ygoytq4w	web_1756409219816_4ymtuy7ha	web	Unknown	::1	\N	enroll_1756409220129_i0i9myloh	APPROVED	2025-08-28 19:27:00.129	2025-08-28 19:42:00.129
cmewlquix0001nb2q1er0vien	cmefj940d0000dv47ygoytq4w	web_1756458004702_2d8jienxp	web	Unknown	::1	\N	enroll_1756458005001_xau6oxdos	APPROVED	2025-08-29 09:00:05.002	2025-08-29 09:15:05.001
cmewswu5g0021qiczjvrmiw30	cmeq07kdg000011t85ugqazgn	web_1756470041468_uci81q49k	web	Unknown	::1	\N	enroll_1756470041764_dg5f64cmy	APPROVED	2025-08-29 12:20:41.765	2025-08-29 12:35:41.764
cmeya8s51000p13uc5hbbsjvv	cmeq07kdg000011t85ugqazgn	web_1756559618400_iu51y4b9k	web	Unknown	::1	\N	enroll_1756559618676_n7tkhr8qo	APPROVED	2025-08-30 13:13:38.677	2025-08-30 13:28:38.676
cmeynwpee00019j0n7sqy53fo	cmeq07kdg000011t85ugqazgn	web_1756582567377_pe90azse5	web	Unknown	::1	\N	enroll_1756582569872_1mojdcqpj	APPROVED	2025-08-30 19:36:09.875	2025-08-30 19:51:09.872
cmeyq1aj5000hw1zyl2ng3c8r	cmefj940d0000dv47ygoytq4w	web_1756586142842_1gp247abl	web	Unknown	::1	\N	enroll_1756586143121_lyh9kzs5r	APPROVED	2025-08-30 20:35:43.122	2025-08-30 20:50:43.121
cmeze5cjc00032bny81wjoi74	cmefj940d0000dv47ygoytq4w	web_1756626642853_mbvvi3ye5	web	Unknown	::1	\N	enroll_1756626643128_uboog9wh8	APPROVED	2025-08-31 07:50:43.129	2025-08-31 08:05:43.128
cmf0tfyvi0001os9e07s4aahq	cmeq07kdg000011t85ugqazgn	web_1756712798750_6u32chute	web	Unknown	::1	\N	enroll_1756712799050_1689shgrk	APPROVED	2025-09-01 07:46:39.052	2025-09-01 08:01:39.05
cmf2nsj1g0001ixl25452ws8r	cmefj94h80002dv47vj17m218	test-device-123	web	Chrome	127.0.0.1	\N	enroll_1756824239711_3rbl06vf8	APPROVED	2025-09-02 14:43:59.714	2025-09-02 14:58:59.712
cmesf85f10005e4er35zhkn6b	cmeq07kdg000011t85ugqazgn	web_1756205189907_iewo9ilap	web	Unknown	::1	\N	enroll_1756205190253_ob1f7sgk7	APPROVED	2025-08-26 10:46:30.253	2025-08-26 11:01:30.253
cmetu9w6k0001ita1sspd3dnf	cmeq07kdg000011t85ugqazgn	web_1756290931529_l4epc8sex	web	Unknown	::1	\N	enroll_1756290932007_hsumbpko9	APPROVED	2025-08-27 10:35:32.008	2025-08-27 10:50:32.007
cmev25fk400018080ie763oxv	cmeq07kdg000011t85ugqazgn	web_1756364626660_uipw6iyuw	web	Unknown	::1	\N	enroll_1756364626946_ul1q6n11p	APPROVED	2025-08-28 07:03:46.947	2025-08-28 07:18:46.946
cmev26djs0005808066aqejns	cmeq07kdg000011t85ugqazgn	web_1756364670653_u9z57tplx	web	Unknown	::1	\N	enroll_1756364671000_8lvdzkzwe	APPROVED	2025-08-28 07:04:31.001	2025-08-28 07:19:31
cmev26ovq000b8080xbl26zcw	cmefj940d0000dv47ygoytq4w	web_1756364685229_pfb0swpk1	web	Unknown	::1	\N	enroll_1756364685686_kgyhg8zif	APPROVED	2025-08-28 07:04:45.686	2025-08-28 07:19:45.686
cmeve2ymc0005zr1xmvkap5yl	cmeq07kdg000011t85ugqazgn	web_1756384666803_13hlv8evw	web	Unknown	::1	\N	enroll_1756384667076_f57z732gb	APPROVED	2025-08-28 12:37:47.076	2025-08-28 12:52:47.076
cmevkkk8x000110d830ndl9em	cmeq07kdg000011t85ugqazgn	web_1756395565676_kgwa5gxzu	web	Unknown	::1	\N	enroll_1756395565950_rkcgtwisz	APPROVED	2025-08-28 15:39:25.95	2025-08-28 15:54:25.95
cmevox25o0001f1pdspogzfxk	cmeq07kdg000011t85ugqazgn	web_1756402867098_rn80dwi56	web	Unknown	::1	\N	enroll_1756402867497_3p696hxm7	APPROVED	2025-08-28 17:41:07.498	2025-08-28 17:56:07.497
cmevsrlve0015f1pdgq10u7az	cmeq07kdg000011t85ugqazgn	web_1756409331294_hn0mzw8oi	web	Unknown	::1	\N	enroll_1756409331578_fp0qf5sa5	APPROVED	2025-08-28 19:28:51.578	2025-08-28 19:43:51.578
cmewmgdrc0005nb2qxvgqi73c	cmefj940d0000dv47ygoytq4w	web_1756459196015_0a936njwg	web	Unknown	::1	\N	enroll_1756459196327_8bkc1s844	APPROVED	2025-08-29 09:19:56.328	2025-08-29 09:34:56.327
cmewu7vhv002dqicz4oil8zd7	cmeq07kdg000011t85ugqazgn	web_1756472236048_cbdea9p24	web	Unknown	::1	\N	enroll_1756472236339_tknrqjw44	APPROVED	2025-08-29 12:57:16.339	2025-08-29 13:12:16.339
cmeyatf93000v13ucw81nsrbi	cmeq07kdg000011t85ugqazgn	web_1756560581476_8fklqb154	web	Unknown	::1	\N	enroll_1756560581750_njjfd2oa9	APPROVED	2025-08-30 13:29:41.751	2025-08-30 13:44:41.75
cmeyo6jkb000d9j0nqkyviet3	cmefj940d0000dv47ygoytq4w	web_1756583028601_0ugszmzhh	web	Unknown	::1	\N	enroll_1756583028875_x5voginjm	APPROVED	2025-08-30 19:43:48.875	2025-08-30 19:58:48.875
cmeyq1rbv000nw1zyuizwumyv	cmeq07kdg000011t85ugqazgn	web_1756586164621_02kcv8qpz	web	Unknown	::1	\N	enroll_1756586164891_ah45eoq6b	APPROVED	2025-08-30 20:36:04.892	2025-08-30 20:51:04.891
cmeze5vg000092bny1kghqhk4	cmeq07kdg000011t85ugqazgn	web_1756626667357_vejuh5an6	web	Unknown	::1	\N	enroll_1756626667631_zci51mwht	APPROVED	2025-08-31 07:51:07.632	2025-08-31 08:06:07.631
cmf0thuno0007os9esc1l1184	cmeq07kdg000011t85ugqazgn	web_1756712886597_i50w8aqz9	web	Unknown	::1	\N	enroll_1756712886899_gu20qc0vy	APPROVED	2025-09-01 07:48:06.9	2025-09-01 08:03:06.899
cmf2q9q6i0001z833ovo4wqcy	cmefj948t0001dv47qdb5yn6x	test-device-instructor	web	Chrome	127.0.0.1	\N	enroll_1756828401352_pmc9dfdbu	APPROVED	2025-09-02 15:53:21.354	2025-09-02 16:08:21.353
cmesh65yy0001ftijackprpjh	cmeq07kdg000011t85ugqazgn	web_1756208456533_t9ft6c9u8	web	Unknown	::1	\N	enroll_1756208456886_tra3khksg	APPROVED	2025-08-26 11:40:56.888	2025-08-26 11:55:56.886
cmetuyk8p0005ita1bmvk6shf	cmeq07kdg000011t85ugqazgn	web_1756292082563_0cib5sz3o	web	Unknown	::1	\N	enroll_1756292082936_71bsj5rl8	APPROVED	2025-08-27 10:54:42.938	2025-08-27 11:09:42.937
cmev2bbg30001m4eo3htoekzw	cmefj940d0000dv47ygoytq4w	web_1756364901172_wdxgzfi9g	web	Unknown	::1	\N	enroll_1756364901554_runcgmhcl	APPROVED	2025-08-28 07:08:21.555	2025-08-28 07:23:21.554
cmevkmmoz0001euqqurz917dd	cmeq07kdg000011t85ugqazgn	web_1756395662138_9dugveshm	web	Unknown	::1	\N	enroll_1756395662435_272heh55v	APPROVED	2025-08-28 15:41:02.436	2025-08-28 15:56:02.435
cmex0f2gh000113ucnx9jgidr	cmeq07kdg000011t85ugqazgn	web_1756482649352_2ci31pvre	web	Unknown	::1	\N	enroll_1756482649646_voqkga8e8	APPROVED	2025-08-29 15:50:49.647	2025-08-29 16:05:49.646
cmevqcu6f0005f1pd3cghm749	cmeq07kdg000011t85ugqazgn	web_1756405282921_fps90z0ws	web	Unknown	::1	\N	enroll_1756405283271_v40wc2owx	APPROVED	2025-08-28 18:21:23.272	2025-08-28 18:36:23.271
cmevszz71001df1pd6la00gh6	cmeq07kdg000011t85ugqazgn	web_1756409721091_tck2c59of	web	Unknown	::1	\N	enroll_1756409722090_43vviqgvd	APPROVED	2025-08-28 19:35:22.093	2025-08-28 19:50:22.09
cmeyp0ozk000h9j0ns8u3nhtu	cmeq07kdg000011t85ugqazgn	web_1756584435197_090sde4cb	web	Unknown	::1	\N	enroll_1756584435584_2mgzopxr3	APPROVED	2025-08-30 20:07:15.584	2025-08-30 20:22:15.584
cmeyp16i4000n9j0ndiablzw0	cmefj940d0000dv47ygoytq4w	web_1756584457995_v567t70if	web	Unknown	::1	\N	enroll_1756584458284_3wqfoimf9	APPROVED	2025-08-30 20:07:38.285	2025-08-30 20:22:38.284
cmeyqlag10002dsncgz2o5ghb	cmeyql63f0000dsnc68iu1aap	web_1756587075736_fn53t0166	web	Unknown	::1	\N	enroll_1756587076128_6a6la619a	APPROVED	2025-08-30 20:51:16.13	2025-08-30 21:06:16.128
cmeyqlk9t0008dsncxfeotdr6	cmefj940d0000dv47ygoytq4w	web_1756587088574_8vwnpqcyb	web	Unknown	::1	\N	enroll_1756587088865_yfz8hqxpv	APPROVED	2025-08-30 20:51:28.865	2025-08-30 21:06:28.865
cmezs0ik50001vtp3f55oo07b	cmeq07kdg000011t85ugqazgn	web_1756649931868_m5ml05lek	web	Unknown	::1	\N	enroll_1756649932276_ohttmenoi	APPROVED	2025-08-31 14:18:52.277	2025-08-31 14:33:52.276
cmf0u48uu0001zg9m8dr33mt7	cmeq07kdg000011t85ugqazgn	web_1756713931429_86h88kkpw	web	Unknown	::1	\N	enroll_1756713931731_h9wahr1pj	APPROVED	2025-09-01 08:05:31.732	2025-09-01 08:20:31.731
cmf2qflfa0005z833tqx07szm	cmefj940d0000dv47ygoytq4w	web_1756726464457_1w65gy4sq	MacIntel	Mac	127.0.0.1	\N	enroll_1756828675125_mxkwyswgz	APPROVED	2025-09-02 15:57:55.126	2025-09-02 16:12:55.125
\.


--
-- TOC entry 4072 (class 0 OID 43200)
-- Dependencies: 218
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lesson_progress (id, "userId", "lessonId", progress, duration, completed, "lastPosition", "createdAt", "updatedAt", "completedAt") FROM stdin;
cmf00p65e0005a6bvwudo2lnv	cmeq07kdg000011t85ugqazgn	cmevqmu4n000hf1pd3tndv1pp	4	347	f	15.83692782500262	2025-08-31 18:21:59.522	2025-08-31 18:39:29.06	\N
cmf01bs6c000ha6bv40335cjs	cmeq07kdg000011t85ugqazgn	cmevqnd2l000jf1pdww1662ce	1	347	f	4.367365336999795	2025-08-31 18:39:34.5	2025-08-31 18:39:42.189	\N
cmfcxih0e000126ourug82z1y	cmeq07kdg000011t85ugqazgn	cmfcwmwpu0001hdk2z17890qg	100	0	f	0	2025-09-09 19:13:48.442	2025-09-10 19:21:20.899	\N
cmf00ll4w0003a6bva0gafdre	cmeq07kdg000011t85ugqazgn	cmevqlyc7000ff1pde66kidqf	5	699	f	36.08638744499964	2025-08-31 18:19:12.321	2025-09-10 19:22:34.139	\N
\.


--
-- TOC entry 4067 (class 0 OID 43144)
-- Dependencies: 213
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lessons (id, title, description, "videoUrl", duration, "order", "sectionId", "isPublished", "videoKey", thumbnail, subtitles, "createdAt", "updatedAt", "isFree", resources, "videoType", "pdfKey", "pdfUrl", "contentType", "pdfFileName", "pdfPages", "pdfSize") FROM stdin;
cmefkjdym00011ypin3y1za7c	Test Lesson	Test lesson description	https://example.com/test.mp4	600	1	cmefkgxqj0003a5uobc1co7ga	f	\N	\N	\N	2025-08-17 10:54:12.333	2025-08-17 10:54:12.333	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmefkr6yz0003569trb95ajq3	Test Lesson	Test lesson description	https://example.com/test.mp4	600	1	cmefkr0ra0001569t1wq9m52q	f	\N	\N	\N	2025-08-17 11:00:16.523	2025-08-17 11:00:16.523	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmevqmu4n000hf1pd3tndv1pp	Ders 2		https://arsolix.com/3.mp4	348	1	cmemorsdy0009kh1j33kui04r	t	\N		\N	2025-08-28 18:29:09.756	2025-08-29 09:00:34.904	f	[]	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmevsr2cn0013f1pdfiw4b96x	Ders 5 		https://arsolix.com/1.mp4	700	1	cmemoojpq0003kh1jvmens0hq	f	\N		\N	2025-08-28 19:28:26.279	2025-08-29 09:08:20.938	f	[]	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmefj94hi000adv47wujr1s4e	HTML Tags and Elements	Common HTML tags and their usage	https://player.vimeo.com/external/767048708.hd.mp4?s=c7f3f18012&profile_id=175	900	1	cmefj94hf0006dv474wuj4cf3	t	\N	\N	\N	2025-08-17 10:18:13.878	2025-08-17 15:11:04.157	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmfcjejst0001fhsstzjxb2ne	PDF Test Dersi Updated	PDF ders testi güncellendi		0	1	cmemorsdy0009kh1j33kui04r	f	\N		\N	2025-09-09 12:38:50.814	2025-09-09 12:58:22.806	f	[]	VIDEO	\N	\N	PDF	\N	\N	\N
cmemoz5x1000dkh1j81wgorzz	test	test	htat	0	1	cmemoy02b000bkh1j6i6ztdj2	f	\N		\N	2025-08-22 10:32:50.101	2025-08-22 10:32:50.101	f	[]	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmefkip6d0009kcuw4el6urpf	Introduction to HTML	What is HTML and why it matters	http://localhost:3001/videos/courses/web-development-basics/01-introduction.mp4	600	1	cmefkip670006kcuw2w2u4tvy	t	\N	\N	\N	2025-08-17 10:53:40.213	2025-08-17 10:53:40.213	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmefj94hi0009dv470y1dsh7u	Introduction to HTML	What is HTML and why it matters	http://localhost:3001/videos/courses/web-development-basics/01-introduction.mp4	600	2	cmefj94hf0006dv474wuj4cf3	t	\N	\N	\N	2025-08-17 10:18:13.878	2025-08-17 15:11:04.156	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmefkip6d000akcuwg25b9d3k	HTML Tags and Elements	Common HTML tags and their usage	http://localhost:3001/videos/courses/web-development-basics/02-html-basics.mp4	900	2	cmefkip670006kcuw2w2u4tvy	t	\N	\N	\N	2025-08-17 10:53:40.213	2025-08-17 10:53:40.213	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmefj94hi000bdv4754bh4lfo	CSS Introduction	What is CSS and how to use it	http://localhost:3001/videos/courses/web-development-basics/03-css-basics.mp4	600	1	cmefj94hg0008dv4799f4rln6	t	\N	\N	\N	2025-08-17 10:18:13.878	2025-08-17 10:18:13.878	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmefkip6d000bkcuw0es1q84s	CSS Introduction	What is CSS and how to use it	http://localhost:3001/videos/courses/web-development-basics/03-css-basics.mp4	600	1	cmefkip6a0008kcuwmuu8px1f	t	\N	\N	\N	2025-08-17 10:53:40.213	2025-08-17 10:53:40.213	f	\N	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmfcwmwpu0001hdk2z17890qg	ttt			0	1	cmemohqfa0005209t1daulhvv	f	\N		\N	2025-09-09 18:49:15.81	2025-09-09 18:49:15.837	f	[]	VIDEO	1757443755835-m6fl052r69l.pdf	/uploads/pdfs/1757443755835-m6fl052r69l.pdf	PDF	IVD-Alindi-b167PKWUWFPV.pdf	\N	7637
cmevqlyc7000ff1pde66kidqf	Ders1		https://arsolix.com/1.mp4	700	1	cmemohqfa0005209t1daulhvv	t	\N		\N	2025-08-28 18:28:28.561	2025-08-28 18:28:49.211	f	[]	VIDEO	\N	\N	VIDEO	\N	\N	\N
cmevqnd2l000jf1pdww1662ce	Bölüm 3		https://arsolix.com/3.mp4	348	1	cmemoojpq0003kh1jvmens0hq	t	\N		\N	2025-08-28 18:29:34.312	2025-08-28 18:29:54.343	f	[]	VIDEO	\N	\N	VIDEO	\N	\N	\N
\.


--
-- TOC entry 4087 (class 0 OID 74936)
-- Dependencies: 233
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message_attachments (id, "messageId", "fileName", "fileUrl", "fileType", "fileSize", "createdAt") FROM stdin;
\.


--
-- TOC entry 4086 (class 0 OID 74927)
-- Dependencies: 232
-- Data for Name: message_replies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message_replies (id, "messageId", "userId", content, "isAdmin", "createdAt", "isRead") FROM stdin;
cmeyqs7vj000sdsnc0oq64mtl	cmeyqmfm4000edsncny8403ze	cmeq07kdg000011t85ugqazgn	test	f	2025-08-30 20:56:39.391	f
cmeyqsdtg000udsncfa1zj205	cmeyqmfm4000edsncny8403ze	cmeq07kdg000011t85ugqazgn	tstsı	f	2025-08-30 20:56:47.092	f
cmeyqw4830001mlt4ujk5axvn	cmeyqmfm4000edsncny8403ze	cmeq07kdg000011t85ugqazgn	s	f	2025-08-30 20:59:41.284	f
cmeyqpej3000kdsncpgaxfmc1	cmeyqmfm4000edsncny8403ze	cmefj940d0000dv47ygoytq4w	test	t	2025-08-30 20:54:28.047	t
cmezdi3yq0005eg9j70j7j7bf	cmeyqmfm4000edsncny8403ze	cmefj940d0000dv47ygoytq4w	test	t	2025-08-31 07:32:38.93	t
cmeze4y8c00012bnyhj2c2jfa	cmeyqmfm4000edsncny8403ze	cmeq07kdg000011t85ugqazgn	sfsf	f	2025-08-31 07:50:24.588	f
cmeze5miy00072bnye4h0zcb6	cmeyqmfm4000edsncny8403ze	cmefj940d0000dv47ygoytq4w	safsa	t	2025-08-31 07:50:56.075	t
cmeyqlpyd000cdsncvy0rjvu2	cmeyqlg5m0006dsncezyjuh82	cmefj940d0000dv47ygoytq4w	Merhaba! Test mesajınızı aldım. Size nasıl yardımcı olabilirim?	t	2025-08-30 20:51:36.23	t
\.


--
-- TOC entry 4085 (class 0 OID 74917)
-- Dependencies: 231
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, "userId", "adminId", subject, content, "messageType", status, "isRead", "createdAt", "updatedAt") FROM stdin;
cmeyqmfm4000edsncny8403ze	cmeq07kdg000011t85ugqazgn	cmefj940d0000dv47ygoytq4w	test	test	QUESTION	REPLIED	t	2025-08-30 20:52:09.484	2025-08-31 07:50:56.077
cmeyqlg5m0006dsncezyjuh82	cmeyql63f0000dsnc68iu1aap	cmefj940d0000dv47ygoytq4w	Test Mesajı	Bu bir test mesajıdır	QUESTION	READ	t	2025-08-30 20:51:23.531	2025-09-01 12:48:46.653
\.


--
-- TOC entry 4077 (class 0 OID 43247)
-- Dependencies: 223
-- Data for Name: navigation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.navigation (id, name, location, items, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4075 (class 0 OID 43231)
-- Dependencies: 221
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notes (id, "userId", "lessonId", content, "timestamp", "isPublic", "createdAt", "updatedAt") FROM stdin;
cmewsn82y0007qicz5d30wm63	cmeq07kdg000011t85ugqazgn	cmevqlyc7000ff1pde66kidqf	test	78.6649692	t	2025-08-29 12:13:13.259	2025-08-29 12:13:13.259
cmf03a3qj000ra6bvf7n7fy4c	cmeq07kdg000011t85ugqazgn	cmevqnd2l000jf1pdww1662ce	test	4.3673653	t	2025-08-31 19:34:15.403	2025-08-31 19:34:15.403
cmf11miyk000b11z02ibrl1tf	cmeq07kdg000011t85ugqazgn	cmevqlyc7000ff1pde66kidqf	önemli	27.34274881200219	t	2025-09-01 11:35:41.949	2025-09-01 11:35:41.949
\.


--
-- TOC entry 4068 (class 0 OID 43153)
-- Dependencies: 214
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, "userId", currency, status, amount, "courseId", "expiresAt", "invoiceNumber", metadata, "paymentIntentId", "purchasedAt", "paymentMethod", "billingInfo", "orderNumber") FROM stdin;
test_order_1	cmefj94h80002dv47vj17m218	TRY	COMPLETED	99.99	cmefj94hb0004dv47705jkgdf	\N	\N	{"category": "Web Development", "instructor": "John Doe", "courseTitle": "Web Development Basics"}	\N	2025-08-25 15:25:09.874	CREDIT_CARD	\N	ORD-1756135509.874000-test_ord
test_order_2	cmeok6bvx000y10dq4hqyrcyc	TRY	PENDING	149.99	cmemmitvr0003rpck976vt0ij	\N	\N	{"category": "Data Science", "instructor": "John Doe", "courseTitle": "Python ile Veri Bilimi"}	\N	2025-08-25 15:25:16.331	BANK_TRANSFER	\N	ORD-1756135516.331000-test_ord
cmergnn5e00072dub2r6elmv1	cmeq07kdg000011t85ugqazgn	TRY	PENDING	299.00	cmefj94hb0004dv47705jkgdf	2026-08-25 18:38:46.514	\N	{"courseTitle": "Test Course"}	\N	2025-08-25 18:38:46.515	BANK_TRANSFER	{"email": "test@lms.com", "fullName": "Test User"}	TEST-123
cmerh835b0005b0fvilotiujv	cmeq07kdg000011t85ugqazgn	TRY	COMPLETED	99.99	cmefj94hb0004dv47705jkgdf	2026-08-25 18:54:40.366	\N	{"category": "Web Geliştirme", "discount": 0, "instructor": "John Doe", "courseTitle": "Web Development Basics", "originalPrice": "99.99"}	\N	2025-08-25 18:54:40.367	BANK_TRANSFER	{"city": "", "email": "test@lms.com", "phone": "8503038514", "address": "j", "country": "Türkiye", "fullName": "Test User", "postalCode": ""}	ORD-1756148078351-NIYVOX5V4
cmes9zv4r000jjfu5g3bou84o	cmeq07kdg000011t85ugqazgn	TRY	COMPLETED	236.00	cmemoben00001209tmfmy699k	2026-08-26 08:20:05.593	\N	{"category": "Web Geliştirme", "discount": 0, "instructor": "Admin User", "courseTitle": "Vue.js Temelleri", "originalPrice": "236"}	\N	2025-08-26 08:20:05.595	BANK_TRANSFER	{"city": "", "email": "test@lms.com", "phone": "8503038514", "address": "s", "country": "Türkiye", "fullName": "User Name", "postalCode": ""}	ORD-1756196403520-K0Z4LQH2R
cmevstrx40019f1pdhuommczx	cmeq07kdg000011t85ugqazgn	TRY	PENDING	99.99	cmefj94hb0004dv47705jkgdf	2026-08-28 19:30:32.727	\N	{"category": "Web Geliştirme", "discount": 0, "instructor": "John Doe", "courseTitle": "Web Development Basics", "originalPrice": "99.99"}	\N	2025-08-28 19:30:32.728	BANK_TRANSFER	{"city": "", "email": "test@lms.com", "phone": "8503038514", "address": "test", "country": "Türkiye", "fullName": "Test User", "postalCode": ""}	ORD-1756409430706-ZS5OB6G48
\.


--
-- TOC entry 4078 (class 0 OID 43256)
-- Dependencies: 224
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages (id, title, slug, content, "metaTitle", "metaDescription", "isPublished", "publishedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 4073 (class 0 OID 43212)
-- Dependencies: 219
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.questions (id, "userId", "lessonId", title, content, "isPinned", "isAccepted", "acceptedAnswerId", "createdAt", "updatedAt", "courseId") FROM stdin;
cmefkgt9s0001a5uoasov4ejo	cmefj940d0000dv47ygoytq4w	\N	Test soru	Test soru	f	f	\N	2025-08-17 10:52:12.197	2025-08-17 10:52:12.197	cmefj94hb0004dv47705jkgdf
cmezpglp70001xjj6faiz7bg6	cmeq07kdg000011t85ugqazgn	cmevqlyc7000ff1pde66kidqf	soru ?	soru ?	f	f	\N	2025-08-31 13:07:23.995	2025-08-31 13:07:23.995	cmemoben00001209tmfmy699k
cmezrcjlg0005hy8v4smnom84	cmeq07kdg000011t85ugqazgn	cmevqlyc7000ff1pde66kidqf	test	test\n\n📎 Ek Dosya: Logo-Dark.png (4.65 KB)	f	f	\N	2025-08-31 14:00:13.876	2025-08-31 14:00:13.876	cmemoben00001209tmfmy699k
cmf03a00k000pa6bvld1edktq	cmeq07kdg000011t85ugqazgn	cmevqnd2l000jf1pdww1662ce	test	test	f	f	\N	2025-08-31 19:34:10.58	2025-08-31 19:34:10.58	cmemoben00001209tmfmy699k
\.


--
-- TOC entry 4066 (class 0 OID 43135)
-- Dependencies: 212
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sections (id, title, description, "order", "courseId", "isPublished", "createdAt", "updatedAt", duration, "totalLessons") FROM stdin;
cmefj94hf0006dv474wuj4cf3	HTML Fundamentals	Learn the basics of HTML markup	1	cmefj94hb0004dv47705jkgdf	t	2025-08-17 10:18:13.875	2025-08-17 15:22:11.266	0	0
cmefj94hg0008dv4799f4rln6	CSS Styling	Style your HTML with CSS	2	cmefj94hb0004dv47705jkgdf	t	2025-08-17 10:18:13.877	2025-08-17 15:22:11.266	0	0
cmefkip670006kcuw2w2u4tvy	HTML Fundamentals	Learn the basics of HTML markup	4	cmefj94hb0004dv47705jkgdf	t	2025-08-17 10:53:40.207	2025-08-17 15:22:11.272	0	0
cmefkip6a0008kcuwmuu8px1f	CSS Styling	Style your HTML with CSS	3	cmefj94hb0004dv47705jkgdf	t	2025-08-17 10:53:40.21	2025-08-17 15:22:11.271	0	0
cmefkgxqj0003a5uobc1co7ga	Test Section	Test section description	5	cmefj94hb0004dv47705jkgdf	f	2025-08-17 10:52:17.995	2025-08-17 15:22:11.275	0	0
cmefkr0ra0001569t1wq9m52q	Test Section	Test section description	6	cmefj94hb0004dv47705jkgdf	f	2025-08-17 11:00:08.468	2025-08-17 15:22:11.276	0	0
cmemohqfa0005209t1daulhvv	Vue.js Temelleri	Vue.js kütüphanesinin temel kavramları	1	cmemoben00001209tmfmy699k	f	2025-08-22 10:19:16.87	2025-08-22 10:19:16.87	0	0
cmemoojpq0003kh1jvmens0hq	Vue.js Bileşenleri	Vue.js bileşen sistemi	2	cmemoben00001209tmfmy699k	f	2025-08-22 10:24:34.752	2025-08-22 10:24:34.752	0	0
cmemoy02b000bkh1j6i6ztdj2	test	w2442	1	cmemo2ucr0001izzkore2bsvj	t	2025-08-22 10:31:55.859	2025-08-22 10:31:55.859	0	0
cmemorsdy0009kh1j33kui04r	Bölüm 2	Test açıklama	1	cmemoben00001209tmfmy699k	f	2025-08-22 10:27:05.974	2025-08-28 18:27:38.961	0	0
\.


--
-- TOC entry 4076 (class 0 OID 43240)
-- Dependencies: 222
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (id, key, value) FROM stdin;
cmeml5hr200016d3jgyowun2s	platform_url	"https://lms-platform.com"
cmeml5hr300026d3jqmi5vkaj	default_language	"tr"
cmeml5hr500046d3jysxfi9d9	min_password_length	8
cmeml5hr700056d3jd0mlqbq0	jwt_expires_in_hours	24
cmeml5hr800066d3jfvcpc03m	two_factor_auth	true
cmeml5hra00076d3j5hst4592	rate_limiting	true
cmeml5hrc00086d3jmnmr9j2g	paytr_merchant_id	""
cmeml5hre00096d3jmxuojvpj	paytr_merchant_key	""
cmeml5hrf000a6d3jw5yrrsti	iyzico_api_key	""
cmeml5hrg000b6d3j15ngt8m5	iyzico_secret_key	""
cmeml5hrh000c6d3jsiqeokp6	sandbox_mode	false
cmeml5hri000d6d3jxe4juwge	smtp_host	"smtp.gmail.com"
cmeml5hrk000e6d3jsjkhuj9u	smtp_port	587
cmeml5hrl000f6d3j1r6nrahy	smtp_security	"tls"
cmeml5hrl000g6d3jj8idssh1	smtp_username	""
cmeml5hrm000h6d3jafq0o02j	smtp_password	""
cmeml5hrn000i6d3j215c7qyv	sender_name	"LMS Platform"
cmeml5hrn000j6d3jr2g3gnr1	aws_access_key_id	""
cmeml5hro000k6d3jxmr802wf	aws_secret_access_key	""
cmeml5hrp000l6d3jzu07mccw	aws_bucket_name	"lms-platform-bucket"
cmeml5hrq000m6d3jx6vk6uz3	aws_region	"eu-west-1"
cmeml5hrs000n6d3jvw6gnw7u	cloudfront_domain	""
cmeml5hrv000o6d3j8d6yrpei	use_cdn	true
cmeml5hrw000p6d3jxw53jsa5	default_timezone	"Europe/Istanbul"
cmeml5hrx000q6d3j1zc3pv70	date_format	"DD/MM/YYYY"
cmeml5hry000r6d3jsrm1hn1x	time_format	"24"
cmeml5hrz000s6d3j1lq90ny6	week_start_day	1
cmeml5hqw00006d3jjsgwsuxz	platform_name	"LMS Platform Pro"
cmeml5hr400036d3j6xhbrzg0	default_currency	"TRY"
cmemo6et20000v3mlv33p3sd2	tax_rate	"18"
cmemo6etb0001v3ml57p3yz9w	tax_included_by_default	"false"
\.


--
-- TOC entry 4070 (class 0 OID 43180)
-- Dependencies: 216
-- Data for Name: user_devices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_devices (id, "userId", "installId", "publicKey", platform, model, "userAgent", "firstIp", "lastIp", "lastSeenAt", "isTrusted", "isActive", "approvedAt", "deviceName", "osVersion", "appVersion", "createdAt", "updatedAt") FROM stdin;
cmf0uup790003ke2w2ryzlmbi	cmeq07kdg000011t85ugqazgn	web_1756715165267_2ltd4to38	key_1756715165972	MacIntel	Mac	\N	127.0.0.1	176.234.133.244	2025-09-10 19:44:45.545	f	t	2025-09-01 08:26:05.972	MacIntel - Safari 18.6	macOS 10.15	Safari 18.6	2025-09-01 08:26:05.973	2025-09-10 19:44:45.545
cmf2nsj1z0003ixl2lhvl4vfa	cmefj94h80002dv47vj17m218	test-device-123	key_1756824239734	web	Chrome	\N	127.0.0.1	127.0.0.1	2025-09-02 14:44:18.343	f	t	2025-09-02 14:43:59.734	web Device	\N	\N	2025-09-02 14:43:59.735	2025-09-02 14:44:18.343
cmf2q9q7c0003z833vmtxk0tx	cmefj948t0001dv47qdb5yn6x	test-device-instructor	key_1756828401383	web	Chrome	\N	127.0.0.1	127.0.0.1	2025-09-02 15:53:21.395	f	t	2025-09-02 15:53:21.383	web Device	\N	\N	2025-09-02 15:53:21.384	2025-09-02 15:53:21.395
cmf2qflfd0007z833p75d9cvm	cmefj940d0000dv47ygoytq4w	web_1756726464457_1w65gy4sq	key_1756828675129	MacIntel	Mac	\N	127.0.0.1	127.0.0.1	2025-09-02 15:57:55.132	t	t	2025-09-02 15:57:55.129	Admin-MacIntel	\N	\N	2025-09-02 15:57:55.13	2025-09-02 15:57:55.132
cmf2t3u930003rkp61ng16rr3	cmefj940d0000dv47ygoytq4w	web_1756833164902_41rd7gza1	key_1756833165543	MacIntel	Mac	\N	127.0.0.1	127.0.0.1	2025-09-02 17:12:45.555	t	t	2025-09-02 17:12:45.543	Admin-MacIntel	\N	\N	2025-09-02 17:12:45.544	2025-09-02 17:12:45.555
\.


--
-- TOC entry 4081 (class 0 OID 44069)
-- Dependencies: 227
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sessions (id, "userId", "sessionId", "isActive", "startedAt", "lastActivity", "ipAddress", "userAgent", "deviceId") FROM stdin;
\.


--
-- TOC entry 4064 (class 0 OID 43113)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, "firstName", "lastName", password, role, "isActive", "emailVerified", "emailVerifiedAt", avatar, phone, bio, website, "createdAt", "updatedAt") FROM stdin;
cmefj948t0001dv47qdb5yn6x	instructor@lms.com	John	Doe	$2a$12$E/jXYvsxKeW6OyoDELdbaOLHA8/ljDXRVlPXfkO3gdaLVYvWU3pQm	INSTRUCTOR	f	t	2025-08-17 10:18:13.565	\N	\N	Experienced instructor with 10+ years of teaching experience	\N	2025-08-17 10:18:13.566	2025-08-22 07:54:24.183
cmeok6bvx000y10dq4hqyrcyc	yenitest@lms.com	Test	Öğrenci	$2a$12$ncbeQhQNsFoH60Sxxv4Ao.gcd6wkcwex6FqkRkACIl196NFDJx9y2	STUDENT	t	f	\N	\N	\N	\N	\N	2025-08-23 17:53:58.702	2025-08-23 17:53:58.702
cmeom4bdj000c5rcaov5d51t9	yenitest2@lms.com	Yeni Test	Kullanıcı	$2a$12$SAxNOh4DIix8XC8SX/S9dedW7TQicchgpzp/xJCVpntrR1LmrhSHe	STUDENT	t	f	\N	\N	\N	\N	\N	2025-08-23 18:48:23.959	2025-08-23 18:48:23.959
cmepri9780000pnygyki1d2rr	teststudent@lms.com	Test	Student	$2a$12$mq1GZ72FEUCMYaeHZh0n2eybLjMdnqO9axR9O.3Fjc/ciAeHDFbky	STUDENT	t	f	\N	\N	\N	\N	\N	2025-08-24 14:06:58.58	2025-08-24 14:06:58.58
cmeq07kdg000011t85ugqazgn	test@lms.com	Test	User	$2a$12$JFMGtGfEBkmjLbUnIJySpuYXhrN7/ue.U/moH3ViI5S9zviZacLxu	STUDENT	t	f	\N	\N	\N	\N	\N	2025-08-24 18:10:36.388	2025-08-24 18:10:36.388
cmeq07qkv000111t8iqlb8sj8	admin2@lms.com	Admin	User	$2a$12$M4mLaAin3/5K5YihT7eXI.WJhEda1WBvFebX0CUemxhom6Ir1hVnW	ADMIN	t	f	\N	\N	\N	\N	\N	2025-08-24 18:10:44.431	2025-08-24 18:10:44.431
cmefj940d0000dv47ygoytq4w	admin@lms.com	Admin	User	$2a$12$6JiM6Ufs5HDGvYeHSed8LOy0nqXUvZaXCQvJhuFB2NKqPyxZyRpcK	ADMIN	t	t	2025-08-17 10:18:13.244	\N	\N	\N	\N	2025-08-17 10:18:13.261	2025-08-28 19:57:58.933
cmeyql63f0000dsnc68iu1aap	test@example.com	Test	User	$2a$12$GAqifsOxsCryiTgacna4KOfU659PaQ4puX0W2BHBrAk5dulBdYQkK	STUDENT	t	f	\N	\N	\N	\N	\N	2025-08-30 20:51:10.49	2025-08-30 20:51:10.49
cmefj94h80002dv47vj17m218	student@lms.com	Jane	Smith	$2a$12$cBOZWO/.ml7iKwJUrUb0hOuVLgjIxQjHYSPpvI9Ml2BwpnliQsp96	STUDENT	t	t	2025-08-17 10:18:13.867	\N	\N	\N	\N	2025-08-17 10:18:13.868	2025-08-22 09:13:24.701
\.


--
-- TOC entry 4083 (class 0 OID 44087)
-- Dependencies: 229
-- Data for Name: video_analytics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.video_analytics (id, "videoId", "userId", "lessonId", action, "timestamp", duration, "createdAt") FROM stdin;
\.


--
-- TOC entry 4084 (class 0 OID 44095)
-- Dependencies: 230
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.videos (id, title, description, url, thumbnail, duration, "lessonId", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3830 (class 2606 OID 43066)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3845 (class 2606 OID 43179)
-- Name: access_grants access_grants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_grants
    ADD CONSTRAINT access_grants_pkey PRIMARY KEY (id);


--
-- TOC entry 3874 (class 2606 OID 44068)
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- TOC entry 3859 (class 2606 OID 43230)
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- TOC entry 3872 (class 2606 OID 43275)
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- TOC entry 3879 (class 2606 OID 44086)
-- Name: course_views course_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_views
    ADD CONSTRAINT course_views_pkey PRIMARY KEY (id);


--
-- TOC entry 3835 (class 2606 OID 43134)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3851 (class 2606 OID 43199)
-- Name: device_enroll_requests device_enroll_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_enroll_requests
    ADD CONSTRAINT device_enroll_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3854 (class 2606 OID 43211)
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3840 (class 2606 OID 43152)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 3890 (class 2606 OID 74943)
-- Name: message_attachments message_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_pkey PRIMARY KEY (id);


--
-- TOC entry 3888 (class 2606 OID 74935)
-- Name: message_replies message_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_replies
    ADD CONSTRAINT message_replies_pkey PRIMARY KEY (id);


--
-- TOC entry 3886 (class 2606 OID 74926)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3866 (class 2606 OID 43255)
-- Name: navigation navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation
    ADD CONSTRAINT navigation_pkey PRIMARY KEY (id);


--
-- TOC entry 3861 (class 2606 OID 43239)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3843 (class 2606 OID 43162)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3868 (class 2606 OID 43264)
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- TOC entry 3857 (class 2606 OID 43221)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 3838 (class 2606 OID 43143)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3864 (class 2606 OID 43246)
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3849 (class 2606 OID 43190)
-- Name: user_devices user_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT user_devices_pkey PRIMARY KEY (id);


--
-- TOC entry 3876 (class 2606 OID 44078)
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3833 (class 2606 OID 43123)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3881 (class 2606 OID 44094)
-- Name: video_analytics video_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_analytics
    ADD CONSTRAINT video_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 3884 (class 2606 OID 44103)
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- TOC entry 3846 (class 1259 OID 43279)
-- Name: access_grants_userId_courseId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "access_grants_userId_courseId_key" ON public.access_grants USING btree ("userId", "courseId");


--
-- TOC entry 3870 (class 1259 OID 43285)
-- Name: coupons_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX coupons_code_key ON public.coupons USING btree (code);


--
-- TOC entry 3836 (class 1259 OID 43277)
-- Name: courses_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX courses_slug_key ON public.courses USING btree (slug);


--
-- TOC entry 3852 (class 1259 OID 43281)
-- Name: device_enroll_requests_requestId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "device_enroll_requests_requestId_key" ON public.device_enroll_requests USING btree ("requestId");


--
-- TOC entry 3855 (class 1259 OID 43282)
-- Name: lesson_progress_userId_lessonId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "lesson_progress_userId_lessonId_key" ON public.lesson_progress USING btree ("userId", "lessonId");


--
-- TOC entry 3841 (class 1259 OID 61285)
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- TOC entry 3869 (class 1259 OID 43284)
-- Name: pages_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pages_slug_key ON public.pages USING btree (slug);


--
-- TOC entry 3862 (class 1259 OID 43283)
-- Name: site_settings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX site_settings_key_key ON public.site_settings USING btree (key);


--
-- TOC entry 3847 (class 1259 OID 43280)
-- Name: user_devices_installId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "user_devices_installId_key" ON public.user_devices USING btree ("installId");


--
-- TOC entry 3877 (class 1259 OID 44104)
-- Name: user_sessions_sessionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "user_sessions_sessionId_key" ON public.user_sessions USING btree ("sessionId");


--
-- TOC entry 3831 (class 1259 OID 43276)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 3882 (class 1259 OID 44105)
-- Name: videos_lessonId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "videos_lessonId_key" ON public.videos USING btree ("lessonId");


--
-- TOC entry 3897 (class 2606 OID 43321)
-- Name: access_grants access_grants_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_grants
    ADD CONSTRAINT "access_grants_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3898 (class 2606 OID 54423)
-- Name: access_grants access_grants_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_grants
    ADD CONSTRAINT "access_grants_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3896 (class 2606 OID 43316)
-- Name: access_grants access_grants_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_grants
    ADD CONSTRAINT "access_grants_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3910 (class 2606 OID 44111)
-- Name: analytics_events analytics_events_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT "analytics_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3907 (class 2606 OID 43366)
-- Name: answers answers_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3906 (class 2606 OID 43361)
-- Name: answers answers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT "answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3913 (class 2606 OID 44126)
-- Name: course_views course_views_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_views
    ADD CONSTRAINT "course_views_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3914 (class 2606 OID 44131)
-- Name: course_views course_views_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_views
    ADD CONSTRAINT "course_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3891 (class 2606 OID 43286)
-- Name: courses courses_instructorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3900 (class 2606 OID 43336)
-- Name: device_enroll_requests device_enroll_requests_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_enroll_requests
    ADD CONSTRAINT "device_enroll_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3902 (class 2606 OID 43346)
-- Name: lesson_progress lesson_progress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT "lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3901 (class 2606 OID 43341)
-- Name: lesson_progress lesson_progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT "lesson_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3893 (class 2606 OID 43296)
-- Name: lessons lessons_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "lessons_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public.sections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3923 (class 2606 OID 74964)
-- Name: message_attachments message_attachments_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT "message_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3921 (class 2606 OID 74954)
-- Name: message_replies message_replies_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_replies
    ADD CONSTRAINT "message_replies_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3922 (class 2606 OID 74959)
-- Name: message_replies message_replies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_replies
    ADD CONSTRAINT "message_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3919 (class 2606 OID 74949)
-- Name: messages messages_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3920 (class 2606 OID 74944)
-- Name: messages messages_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3909 (class 2606 OID 43376)
-- Name: notes notes_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "notes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3908 (class 2606 OID 43371)
-- Name: notes notes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3895 (class 2606 OID 52379)
-- Name: orders orders_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3894 (class 2606 OID 52374)
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3905 (class 2606 OID 44106)
-- Name: questions questions_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3904 (class 2606 OID 43356)
-- Name: questions questions_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3903 (class 2606 OID 43351)
-- Name: questions questions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3892 (class 2606 OID 43291)
-- Name: sections sections_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT "sections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3899 (class 2606 OID 43331)
-- Name: user_devices user_devices_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_devices
    ADD CONSTRAINT "user_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3912 (class 2606 OID 44121)
-- Name: user_sessions user_sessions_deviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT "user_sessions_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES public.user_devices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3911 (class 2606 OID 44116)
-- Name: user_sessions user_sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3917 (class 2606 OID 44146)
-- Name: video_analytics video_analytics_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_analytics
    ADD CONSTRAINT "video_analytics_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3916 (class 2606 OID 44141)
-- Name: video_analytics video_analytics_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_analytics
    ADD CONSTRAINT "video_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3915 (class 2606 OID 44136)
-- Name: video_analytics video_analytics_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.video_analytics
    ADD CONSTRAINT "video_analytics_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public.videos(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3918 (class 2606 OID 44151)
-- Name: videos videos_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "videos_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2025-09-11 11:51:00 +03

--
-- PostgreSQL database dump complete
--

