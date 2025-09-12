--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public._prisma_migrations VALUES ('77c16569-f4c3-4c67-9d3b-ea509128a317', '2354749d9a3c2e32767c1219582012f4fcc1a30bd89cc6a85dfd46314d9f8b28', '2025-08-17 13:18:04.465778+03', '20250811175910_yrdt', NULL, NULL, '2025-08-17 13:18:04.331352+03', 1);
INSERT INTO public._prisma_migrations VALUES ('6009f607-34ef-46db-a0f9-8cdef85d384e', '777a5508e98ab013dd5963b21af7a4d6cb8c3bcc2937ba23cbafbca62d5d42f9', '2025-08-17 13:18:05.86052+03', '20250817101805_add_course_questions', NULL, NULL, '2025-08-17 13:18:05.813449+03', 1);
INSERT INTO public._prisma_migrations VALUES ('1910f463-4156-44f2-8e09-342e3faa4358', '240c834dc2f83916754ebe77a692795a1f1ca5407f4f255b86b86cb68606404d', '2025-09-09 15:34:03.675825+03', '20250909123403_', NULL, NULL, '2025-09-09 15:34:03.669688+03', 1);
INSERT INTO public._prisma_migrations VALUES ('90b4fd7a-1be7-4177-8288-0e9b0622e668', '2e833ebbaf642697fbb4826368c0162511d61222b00b95bae1bd5966bf8374f4', '2025-08-17 13:53:29.57143+03', '20250817105329_add_lesson_section_fields', NULL, NULL, '2025-08-17 13:53:29.56703+03', 1);
INSERT INTO public._prisma_migrations VALUES ('e7b2cd6f-e871-4842-95c4-62fde4322a83', '42a69d0d63698b49ea230313c9661884922afb790fc80cf300d224a52243aaa7', '2025-08-24 18:33:34.273055+03', '20250824153334_update_orders', NULL, NULL, '2025-08-24 18:33:34.183872+03', 1);
INSERT INTO public._prisma_migrations VALUES ('8e804327-2cce-4c6f-bf04-f5908e355aeb', 'b32e7809696b5d87e83f7345004d1982757bc2e42049ae684d575a7c3f40fd0f', '2025-08-24 18:47:38.747403+03', '20250824154738_add_semester_system', NULL, NULL, '2025-08-24 18:47:38.717886+03', 1);
INSERT INTO public._prisma_migrations VALUES ('38820f6d-d98b-4147-ab3e-e0e704c96db0', '9843972ae01fc6938c813292fd6e41c1cce3575e4339912cddd800ebb83ab53f', '2025-08-24 19:08:46.952708+03', '20250824160846_simplify_orders_remove_semesters', NULL, NULL, '2025-08-24 19:08:46.947456+03', 1);
INSERT INTO public._prisma_migrations VALUES ('08c257b0-d819-4bba-8d42-a97b7ae574bb', '2e680badba60e8efa82e8664e377251f6f5035e2fe5fb864412dc6fa69ae033f', '2025-08-25 21:32:27.877664+03', '20250825183134_add_order_number_and_billing_info', NULL, NULL, '2025-08-25 21:32:27.860394+03', 1);
INSERT INTO public._prisma_migrations VALUES ('5f546298-eee3-42fb-a789-0e060c7d4cef', 'beaf909919b45f53c6fc334306157088bf83e13d7953f568a3987cec170fcdee', '2025-08-28 19:08:39.269264+03', '20250828160839_add_media_system', NULL, NULL, '2025-08-28 19:08:39.220382+03', 1);
INSERT INTO public._prisma_migrations VALUES ('532fef0a-9dcd-4720-b8ce-fb3065729ea1', '39109d63db9c139aa2ea0e0c78c884ca43893090e727843635d1be1d08732e5f', '2025-08-30 21:47:25.624767+03', '20250830184725_add_messaging_system', NULL, NULL, '2025-08-30 21:47:25.608902+03', 1);
INSERT INTO public._prisma_migrations VALUES ('00150ee2-8b53-43ba-87fe-c43d38205e91', '352efccf4db64d2b4c0fdde31991770ac1ee89c6e9d4f2da0bb925e354568217', '2025-08-30 22:39:47.549964+03', '20250830193947_add_messaging_system', NULL, NULL, '2025-08-30 22:39:47.498568+03', 1);
INSERT INTO public._prisma_migrations VALUES ('cf8ba281-298c-4e26-825f-092d5f63b4f9', '50c9bd7f2fe445999fb79780a15e87a3ffc38995b8fc00e38c1d9f6d944c1832', '2025-08-30 23:37:51.374601+03', '20250830203751_add_isread_to_messagereply', NULL, NULL, '2025-08-30 23:37:51.368495+03', 1);
INSERT INTO public._prisma_migrations VALUES ('8afc33cc-fcb4-404c-9a1c-40b770aa9814', 'b3ed1a25181f08a4ddb135bd0eb48813e73dfc9b0cb5bf8929f3f56699050efd', '2025-09-02 18:50:07.884267+03', '20250902155007_add_pdf_lessons', NULL, NULL, '2025-09-02 18:50:07.854275+03', 1);
INSERT INTO public._prisma_migrations VALUES ('5e6ef6c6-ad4a-4165-b87d-445a6583b66c', 'd27cd6d8b339772fe0b1de1bf40044c5bc7ecccc12df6ada9503f2eff49b51ca', '2025-09-02 20:19:58.43264+03', '20250902171958_add_pdf_support', NULL, NULL, '2025-09-02 20:19:58.427252+03', 1);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.users VALUES ('cmefj948t0001dv47qdb5yn6x', 'instructor@lms.com', 'John', 'Doe', '$2a$12$E/jXYvsxKeW6OyoDELdbaOLHA8/ljDXRVlPXfkO3gdaLVYvWU3pQm', 'INSTRUCTOR', false, true, '2025-08-17 10:18:13.565', NULL, NULL, 'Experienced instructor with 10+ years of teaching experience', NULL, '2025-08-17 10:18:13.566', '2025-08-22 07:54:24.183');
INSERT INTO public.users VALUES ('cmeok6bvx000y10dq4hqyrcyc', 'yenitest@lms.com', 'Test', 'Öğrenci', '$2a$12$ncbeQhQNsFoH60Sxxv4Ao.gcd6wkcwex6FqkRkACIl196NFDJx9y2', 'STUDENT', true, false, NULL, NULL, NULL, NULL, NULL, '2025-08-23 17:53:58.702', '2025-08-23 17:53:58.702');
INSERT INTO public.users VALUES ('cmeom4bdj000c5rcaov5d51t9', 'yenitest2@lms.com', 'Yeni Test', 'Kullanıcı', '$2a$12$SAxNOh4DIix8XC8SX/S9dedW7TQicchgpzp/xJCVpntrR1LmrhSHe', 'STUDENT', true, false, NULL, NULL, NULL, NULL, NULL, '2025-08-23 18:48:23.959', '2025-08-23 18:48:23.959');
INSERT INTO public.users VALUES ('cmepri9780000pnygyki1d2rr', 'teststudent@lms.com', 'Test', 'Student', '$2a$12$mq1GZ72FEUCMYaeHZh0n2eybLjMdnqO9axR9O.3Fjc/ciAeHDFbky', 'STUDENT', true, false, NULL, NULL, NULL, NULL, NULL, '2025-08-24 14:06:58.58', '2025-08-24 14:06:58.58');
INSERT INTO public.users VALUES ('cmeq07kdg000011t85ugqazgn', 'test@lms.com', 'Test', 'User', '$2a$12$JFMGtGfEBkmjLbUnIJySpuYXhrN7/ue.U/moH3ViI5S9zviZacLxu', 'STUDENT', true, false, NULL, NULL, NULL, NULL, NULL, '2025-08-24 18:10:36.388', '2025-08-24 18:10:36.388');
INSERT INTO public.users VALUES ('cmeq07qkv000111t8iqlb8sj8', 'admin2@lms.com', 'Admin', 'User', '$2a$12$M4mLaAin3/5K5YihT7eXI.WJhEda1WBvFebX0CUemxhom6Ir1hVnW', 'ADMIN', true, false, NULL, NULL, NULL, NULL, NULL, '2025-08-24 18:10:44.431', '2025-08-24 18:10:44.431');
INSERT INTO public.users VALUES ('cmefj940d0000dv47ygoytq4w', 'admin@lms.com', 'Admin', 'User', '$2a$12$6JiM6Ufs5HDGvYeHSed8LOy0nqXUvZaXCQvJhuFB2NKqPyxZyRpcK', 'ADMIN', true, true, '2025-08-17 10:18:13.244', NULL, NULL, NULL, NULL, '2025-08-17 10:18:13.261', '2025-08-28 19:57:58.933');
INSERT INTO public.users VALUES ('cmeyql63f0000dsnc68iu1aap', 'test@example.com', 'Test', 'User', '$2a$12$GAqifsOxsCryiTgacna4KOfU659PaQ4puX0W2BHBrAk5dulBdYQkK', 'STUDENT', true, false, NULL, NULL, NULL, NULL, NULL, '2025-08-30 20:51:10.49', '2025-08-30 20:51:10.49');
INSERT INTO public.users VALUES ('cmefj94h80002dv47vj17m218', 'student@lms.com', 'Jane', 'Smith', '$2a$12$cBOZWO/.ml7iKwJUrUb0hOuVLgjIxQjHYSPpvI9Ml2BwpnliQsp96', 'STUDENT', true, true, '2025-08-17 10:18:13.867', NULL, NULL, NULL, NULL, '2025-08-17 10:18:13.868', '2025-08-22 09:13:24.701');


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.courses VALUES ('cmemoben00001209tmfmy699k', 'Vue.js Temelleri', 'vue.js-temelleri', 'Vue.js ile modern web uygulamaları', NULL, 236.00, 'TRY', 2096, 'BEGINNER', 'tr', 'cmefj940d0000dv47ygoytq4w', true, NULL, NULL, NULL, '2025-08-22 10:14:21.658', '2025-09-09 18:50:40.86');
INSERT INTO public.courses VALUES ('cmefj94hb0004dv47705jkgdf', 'Web Development Basics', 'web-development-basics', 'Learn the fundamentals of web development with HTML, CSS, and JavaScript', NULL, 99.99, 'TRY', 480, 'BEGINNER', 'tr', 'cmefj948t0001dv47qdb5yn6x', true, 'Web Development Basics - Learn HTML, CSS, JavaScript', 'Start your web development journey with this comprehensive course', NULL, '2025-08-17 10:18:13.872', '2025-08-22 10:47:57.394');
INSERT INTO public.courses VALUES ('cmemmitvr0003rpck976vt0ij', 'Python ile Veri Bilimi', 'python-ile-veri-bilimi', 'Python kullanarak veri analizi ve makine öğrenmesi', NULL, 199.99, 'TRY', 0, 'INTERMEDIATE', 'tr', 'cmefj940d0000dv47ygoytq4w', true, NULL, NULL, NULL, '2025-08-22 09:24:08.775', '2025-08-22 10:47:58.947');
INSERT INTO public.courses VALUES ('cmemo2ucr0001izzkore2bsvj', 'JavaScript Temelleri', 'javascript-temelleri', 'Modern JavaScript ile web geliştirme', NULL, 150.00, 'TRY', 0, 'BEGINNER', 'tr', 'cmefj940d0000dv47ygoytq4w', true, NULL, NULL, NULL, '2025-08-22 10:07:42.123', '2025-08-22 10:47:59.696');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.orders VALUES ('test_order_1', 'cmefj94h80002dv47vj17m218', 'TRY', 'COMPLETED', 99.99, 'cmefj94hb0004dv47705jkgdf', NULL, NULL, '{"category": "Web Development", "instructor": "John Doe", "courseTitle": "Web Development Basics"}', NULL, '2025-08-25 15:25:09.874', 'CREDIT_CARD', NULL, 'ORD-1756135509.874000-test_ord');
INSERT INTO public.orders VALUES ('test_order_2', 'cmeok6bvx000y10dq4hqyrcyc', 'TRY', 'PENDING', 149.99, 'cmemmitvr0003rpck976vt0ij', NULL, NULL, '{"category": "Data Science", "instructor": "John Doe", "courseTitle": "Python ile Veri Bilimi"}', NULL, '2025-08-25 15:25:16.331', 'BANK_TRANSFER', NULL, 'ORD-1756135516.331000-test_ord');
INSERT INTO public.orders VALUES ('cmergnn5e00072dub2r6elmv1', 'cmeq07kdg000011t85ugqazgn', 'TRY', 'PENDING', 299.00, 'cmefj94hb0004dv47705jkgdf', '2026-08-25 18:38:46.514', NULL, '{"courseTitle": "Test Course"}', NULL, '2025-08-25 18:38:46.515', 'BANK_TRANSFER', '{"email": "test@lms.com", "fullName": "Test User"}', 'TEST-123');
INSERT INTO public.orders VALUES ('cmerh835b0005b0fvilotiujv', 'cmeq07kdg000011t85ugqazgn', 'TRY', 'COMPLETED', 99.99, 'cmefj94hb0004dv47705jkgdf', '2026-08-25 18:54:40.366', NULL, '{"category": "Web Geliştirme", "discount": 0, "instructor": "John Doe", "courseTitle": "Web Development Basics", "originalPrice": "99.99"}', NULL, '2025-08-25 18:54:40.367', 'BANK_TRANSFER', '{"city": "", "email": "test@lms.com", "phone": "8503038514", "address": "j", "country": "Türkiye", "fullName": "Test User", "postalCode": ""}', 'ORD-1756148078351-NIYVOX5V4');
INSERT INTO public.orders VALUES ('cmes9zv4r000jjfu5g3bou84o', 'cmeq07kdg000011t85ugqazgn', 'TRY', 'COMPLETED', 236.00, 'cmemoben00001209tmfmy699k', '2026-08-26 08:20:05.593', NULL, '{"category": "Web Geliştirme", "discount": 0, "instructor": "Admin User", "courseTitle": "Vue.js Temelleri", "originalPrice": "236"}', NULL, '2025-08-26 08:20:05.595', 'BANK_TRANSFER', '{"city": "", "email": "test@lms.com", "phone": "8503038514", "address": "s", "country": "Türkiye", "fullName": "User Name", "postalCode": ""}', 'ORD-1756196403520-K0Z4LQH2R');
INSERT INTO public.orders VALUES ('cmevstrx40019f1pdhuommczx', 'cmeq07kdg000011t85ugqazgn', 'TRY', 'PENDING', 99.99, 'cmefj94hb0004dv47705jkgdf', '2026-08-28 19:30:32.727', NULL, '{"category": "Web Geliştirme", "discount": 0, "instructor": "John Doe", "courseTitle": "Web Development Basics", "originalPrice": "99.99"}', NULL, '2025-08-28 19:30:32.728', 'BANK_TRANSFER', '{"city": "", "email": "test@lms.com", "phone": "8503038514", "address": "test", "country": "Türkiye", "fullName": "Test User", "postalCode": ""}', 'ORD-1756409430706-ZS5OB6G48');


--
-- Data for Name: access_grants; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.access_grants VALUES ('cmes9zv5h000ljfu53kdgz21m', 'cmeq07kdg000011t85ugqazgn', 'cmemoben00001209tmfmy699k', '2025-08-26 08:20:05.622', '2026-08-26 08:20:05.593', true, '2025-08-26 08:20:05.622', '2025-08-26 08:20:05.622', 'cmes9zv4r000jjfu5g3bou84o');
INSERT INTO public.access_grants VALUES ('cmergnn5z00092dubfmetizug', 'cmeq07kdg000011t85ugqazgn', 'cmefj94hb0004dv47705jkgdf', '2025-08-25 18:38:46.536', '2026-08-28 19:30:32.727', true, '2025-08-25 18:38:46.536', '2025-08-28 19:30:32.741', 'cmevstrx40019f1pdhuommczx');


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.sections VALUES ('cmefj94hf0006dv474wuj4cf3', 'HTML Fundamentals', 'Learn the basics of HTML markup', 1, 'cmefj94hb0004dv47705jkgdf', true, '2025-08-17 10:18:13.875', '2025-08-17 15:22:11.266', 0, 0);
INSERT INTO public.sections VALUES ('cmefj94hg0008dv4799f4rln6', 'CSS Styling', 'Style your HTML with CSS', 2, 'cmefj94hb0004dv47705jkgdf', true, '2025-08-17 10:18:13.877', '2025-08-17 15:22:11.266', 0, 0);
INSERT INTO public.sections VALUES ('cmefkip670006kcuw2w2u4tvy', 'HTML Fundamentals', 'Learn the basics of HTML markup', 4, 'cmefj94hb0004dv47705jkgdf', true, '2025-08-17 10:53:40.207', '2025-08-17 15:22:11.272', 0, 0);
INSERT INTO public.sections VALUES ('cmefkip6a0008kcuwmuu8px1f', 'CSS Styling', 'Style your HTML with CSS', 3, 'cmefj94hb0004dv47705jkgdf', true, '2025-08-17 10:53:40.21', '2025-08-17 15:22:11.271', 0, 0);
INSERT INTO public.sections VALUES ('cmefkgxqj0003a5uobc1co7ga', 'Test Section', 'Test section description', 5, 'cmefj94hb0004dv47705jkgdf', false, '2025-08-17 10:52:17.995', '2025-08-17 15:22:11.275', 0, 0);
INSERT INTO public.sections VALUES ('cmefkr0ra0001569t1wq9m52q', 'Test Section', 'Test section description', 6, 'cmefj94hb0004dv47705jkgdf', false, '2025-08-17 11:00:08.468', '2025-08-17 15:22:11.276', 0, 0);
INSERT INTO public.sections VALUES ('cmemohqfa0005209t1daulhvv', 'Vue.js Temelleri', 'Vue.js kütüphanesinin temel kavramları', 1, 'cmemoben00001209tmfmy699k', false, '2025-08-22 10:19:16.87', '2025-08-22 10:19:16.87', 0, 0);
INSERT INTO public.sections VALUES ('cmemoojpq0003kh1jvmens0hq', 'Vue.js Bileşenleri', 'Vue.js bileşen sistemi', 2, 'cmemoben00001209tmfmy699k', false, '2025-08-22 10:24:34.752', '2025-08-22 10:24:34.752', 0, 0);
INSERT INTO public.sections VALUES ('cmemoy02b000bkh1j6i6ztdj2', 'test', 'w2442', 1, 'cmemo2ucr0001izzkore2bsvj', true, '2025-08-22 10:31:55.859', '2025-08-22 10:31:55.859', 0, 0);
INSERT INTO public.sections VALUES ('cmemorsdy0009kh1j33kui04r', 'Bölüm 2', 'Test açıklama', 1, 'cmemoben00001209tmfmy699k', false, '2025-08-22 10:27:05.974', '2025-08-28 18:27:38.961', 0, 0);


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.lessons VALUES ('cmefkjdym00011ypin3y1za7c', 'Test Lesson', 'Test lesson description', 'https://example.com/test.mp4', 600, 1, 'cmefkgxqj0003a5uobc1co7ga', false, NULL, NULL, NULL, '2025-08-17 10:54:12.333', '2025-08-17 10:54:12.333', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmefkr6yz0003569trb95ajq3', 'Test Lesson', 'Test lesson description', 'https://example.com/test.mp4', 600, 1, 'cmefkr0ra0001569t1wq9m52q', false, NULL, NULL, NULL, '2025-08-17 11:00:16.523', '2025-08-17 11:00:16.523', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmevqmu4n000hf1pd3tndv1pp', 'Ders 2', '', 'https://arsolix.com/3.mp4', 348, 1, 'cmemorsdy0009kh1j33kui04r', true, NULL, '', NULL, '2025-08-28 18:29:09.756', '2025-08-29 09:00:34.904', false, '[]', 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmevsr2cn0013f1pdfiw4b96x', 'Ders 5 ', '', 'https://arsolix.com/1.mp4', 700, 1, 'cmemoojpq0003kh1jvmens0hq', false, NULL, '', NULL, '2025-08-28 19:28:26.279', '2025-08-29 09:08:20.938', false, '[]', 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmefj94hi000adv47wujr1s4e', 'HTML Tags and Elements', 'Common HTML tags and their usage', 'https://player.vimeo.com/external/767048708.hd.mp4?s=c7f3f18012&profile_id=175', 900, 1, 'cmefj94hf0006dv474wuj4cf3', true, NULL, NULL, NULL, '2025-08-17 10:18:13.878', '2025-08-17 15:11:04.157', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmfcjejst0001fhsstzjxb2ne', 'PDF Test Dersi Updated', 'PDF ders testi güncellendi', '', 0, 1, 'cmemorsdy0009kh1j33kui04r', false, NULL, '', NULL, '2025-09-09 12:38:50.814', '2025-09-09 12:58:22.806', false, '[]', 'VIDEO', NULL, NULL, 'PDF', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmemoz5x1000dkh1j81wgorzz', 'test', 'test', 'htat', 0, 1, 'cmemoy02b000bkh1j6i6ztdj2', false, NULL, '', NULL, '2025-08-22 10:32:50.101', '2025-08-22 10:32:50.101', false, '[]', 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmefkip6d0009kcuw4el6urpf', 'Introduction to HTML', 'What is HTML and why it matters', 'http://localhost:3001/videos/courses/web-development-basics/01-introduction.mp4', 600, 1, 'cmefkip670006kcuw2w2u4tvy', true, NULL, NULL, NULL, '2025-08-17 10:53:40.213', '2025-08-17 10:53:40.213', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmefj94hi0009dv470y1dsh7u', 'Introduction to HTML', 'What is HTML and why it matters', 'http://localhost:3001/videos/courses/web-development-basics/01-introduction.mp4', 600, 2, 'cmefj94hf0006dv474wuj4cf3', true, NULL, NULL, NULL, '2025-08-17 10:18:13.878', '2025-08-17 15:11:04.156', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmefkip6d000akcuwg25b9d3k', 'HTML Tags and Elements', 'Common HTML tags and their usage', 'http://localhost:3001/videos/courses/web-development-basics/02-html-basics.mp4', 900, 2, 'cmefkip670006kcuw2w2u4tvy', true, NULL, NULL, NULL, '2025-08-17 10:53:40.213', '2025-08-17 10:53:40.213', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmefj94hi000bdv4754bh4lfo', 'CSS Introduction', 'What is CSS and how to use it', 'http://localhost:3001/videos/courses/web-development-basics/03-css-basics.mp4', 600, 1, 'cmefj94hg0008dv4799f4rln6', true, NULL, NULL, NULL, '2025-08-17 10:18:13.878', '2025-08-17 10:18:13.878', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmefkip6d000bkcuw0es1q84s', 'CSS Introduction', 'What is CSS and how to use it', 'http://localhost:3001/videos/courses/web-development-basics/03-css-basics.mp4', 600, 1, 'cmefkip6a0008kcuwmuu8px1f', true, NULL, NULL, NULL, '2025-08-17 10:53:40.213', '2025-08-17 10:53:40.213', false, NULL, 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmfcwmwpu0001hdk2z17890qg', 'ttt', '', '', 0, 1, 'cmemohqfa0005209t1daulhvv', false, NULL, '', NULL, '2025-09-09 18:49:15.81', '2025-09-09 18:49:15.837', false, '[]', 'VIDEO', '1757443755835-m6fl052r69l.pdf', '/uploads/pdfs/1757443755835-m6fl052r69l.pdf', 'PDF', 'IVD-Alindi-b167PKWUWFPV.pdf', NULL, 7637);
INSERT INTO public.lessons VALUES ('cmevqlyc7000ff1pde66kidqf', 'Ders1', '', 'https://arsolix.com/1.mp4', 700, 1, 'cmemohqfa0005209t1daulhvv', true, NULL, '', NULL, '2025-08-28 18:28:28.561', '2025-08-28 18:28:49.211', false, '[]', 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);
INSERT INTO public.lessons VALUES ('cmevqnd2l000jf1pdww1662ce', 'Bölüm 3', '', 'https://arsolix.com/3.mp4', 348, 1, 'cmemoojpq0003kh1jvmens0hq', true, NULL, '', NULL, '2025-08-28 18:29:34.312', '2025-08-28 18:29:54.343', false, '[]', 'VIDEO', NULL, NULL, 'VIDEO', NULL, NULL, NULL);


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.questions VALUES ('cmefkgt9s0001a5uoasov4ejo', 'cmefj940d0000dv47ygoytq4w', NULL, 'Test soru', 'Test soru', false, false, NULL, '2025-08-17 10:52:12.197', '2025-08-17 10:52:12.197', 'cmefj94hb0004dv47705jkgdf');
INSERT INTO public.questions VALUES ('cmezpglp70001xjj6faiz7bg6', 'cmeq07kdg000011t85ugqazgn', 'cmevqlyc7000ff1pde66kidqf', 'soru ?', 'soru ?', false, false, NULL, '2025-08-31 13:07:23.995', '2025-08-31 13:07:23.995', 'cmemoben00001209tmfmy699k');
INSERT INTO public.questions VALUES ('cmezrcjlg0005hy8v4smnom84', 'cmeq07kdg000011t85ugqazgn', 'cmevqlyc7000ff1pde66kidqf', 'test', 'test

📎 Ek Dosya: Logo-Dark.png (4.65 KB)', false, false, NULL, '2025-08-31 14:00:13.876', '2025-08-31 14:00:13.876', 'cmemoben00001209tmfmy699k');
INSERT INTO public.questions VALUES ('cmf03a00k000pa6bvld1edktq', 'cmeq07kdg000011t85ugqazgn', 'cmevqnd2l000jf1pdww1662ce', 'test', 'test', false, false, NULL, '2025-08-31 19:34:10.58', '2025-08-31 19:34:10.58', 'cmemoben00001209tmfmy699k');


--
-- Data for Name: answers; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: course_views; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: device_enroll_requests; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.device_enroll_requests VALUES ('cmewqr7sj0009nb2q56v9eus5', 'cmeq07kdg000011t85ugqazgn', 'web_1756466419971_x2co4vf0l', 'web', 'Unknown', '::1', NULL, 'enroll_1756466420275_klzgfkfzs', 'APPROVED', '2025-08-29 11:20:20.275', '2025-08-29 11:35:20.275');
INSERT INTO public.device_enroll_requests VALUES ('cmesjkrkx0001uwz1rp9tlqc3', 'cmeq07kdg000011t85ugqazgn', 'web_1756212496939_wvtyh1oyz', 'web', 'Unknown', '::1', NULL, 'enroll_1756212497307_x0cqch4ve', 'APPROVED', '2025-08-26 12:48:17.309', '2025-08-26 13:03:17.307');
INSERT INTO public.device_enroll_requests VALUES ('cmetvntp4000bita1r6af0h4v', 'cmeq07kdg000011t85ugqazgn', 'web_1756293261207_ng88j4obb', 'web', 'Unknown', '::1', NULL, 'enroll_1756293261591_w81oemk3g', 'APPROVED', '2025-08-27 11:14:21.592', '2025-08-27 11:29:21.591');
INSERT INTO public.device_enroll_requests VALUES ('cmev2hj970005m4eo34rhp0ry', 'cmeq07kdg000011t85ugqazgn', 'web_1756365190847_vxabq4mu2', 'web', 'Unknown', '::1', NULL, 'enroll_1756365191611_1czx6ugg1', 'APPROVED', '2025-08-28 07:13:11.612', '2025-08-28 07:28:11.611');
INSERT INTO public.device_enroll_requests VALUES ('cmevkszh300011qi1r5kneeji', 'cmeq07kdg000011t85ugqazgn', 'web_1756395958602_59qpcg8xj', 'web', 'Unknown', '::1', NULL, 'enroll_1756395958934_1poyikyso', 'APPROVED', '2025-08-28 15:45:58.935', '2025-08-28 16:00:58.934');
INSERT INTO public.device_enroll_requests VALUES ('cmevqi89x000bf1pdy1n4ew9b', 'cmefj940d0000dv47ygoytq4w', 'web_1756405534395_wrqrq8q0v', 'web', 'Unknown', '::1', NULL, 'enroll_1756405534820_q8rv1m03m', 'APPROVED', '2025-08-28 18:25:34.821', '2025-08-28 18:40:34.82');
INSERT INTO public.device_enroll_requests VALUES ('cmevtchf5001jf1pdgxgxvkxw', 'cmefj940d0000dv47ygoytq4w', 'web_1756410305076_sa1u84gy1', 'web', 'Unknown', '::1', NULL, 'enroll_1756410305585_6tdee8pql', 'APPROVED', '2025-08-28 19:45:05.586', '2025-08-28 20:00:05.585');
INSERT INTO public.device_enroll_requests VALUES ('cmex1k7hj000713ucid8wj4sb', 'cmeq07kdg000011t85ugqazgn', 'web_1756484568751_pswilj200', 'web', 'Unknown', '::1', NULL, 'enroll_1756484569063_4dvbrntvp', 'APPROVED', '2025-08-29 16:22:49.063', '2025-08-29 16:37:49.063');
INSERT INTO public.device_enroll_requests VALUES ('cmeyj2v4k0001wb1nr3pnh1s2', 'cmeq07kdg000011t85ugqazgn', 'web_1756574458860_z5o4b24uy', 'web', 'Unknown', '::1', NULL, 'enroll_1756574459155_m910207kg', 'APPROVED', '2025-08-30 17:20:59.156', '2025-08-30 17:35:59.155');
INSERT INTO public.device_enroll_requests VALUES ('cmeypav0v0001cqfsvr8r5mp5', 'cmefj940d0000dv47ygoytq4w', 'web_1756584909685_re6ajrxtr', 'web', 'Unknown', '::1', NULL, 'enroll_1756584909964_1wi0geh17', 'APPROVED', '2025-08-30 20:15:09.965', '2025-08-30 20:30:09.964');
INSERT INTO public.device_enroll_requests VALUES ('cmeyqp354000gdsnc2dt9lrim', 'cmefj940d0000dv47ygoytq4w', 'web_1756587253008_6ldz6ceeg', 'web', 'Unknown', '::1', NULL, 'enroll_1756587253288_6b14un850', 'APPROVED', '2025-08-30 20:54:13.288', '2025-08-30 21:09:13.288');
INSERT INTO public.device_enroll_requests VALUES ('cmezv0e530005vtp3rgfehx12', 'cmeq07kdg000011t85ugqazgn', 'web_1756654965096_ghmgaried', 'web', 'Unknown', '::1', NULL, 'enroll_1756654965399_y2uov7708', 'APPROVED', '2025-08-31 15:42:45.399', '2025-08-31 15:57:45.399');
INSERT INTO public.device_enroll_requests VALUES ('cmf0u7gz80001f69eu9gqng9h', 'cmeq07kdg000011t85ugqazgn', 'web_1756714081923_b5dw95dxr', 'web', 'Unknown', '::1', NULL, 'enroll_1756714082227_nqjz71xxh', 'APPROVED', '2025-09-01 08:08:02.228', '2025-09-01 08:23:02.227');
INSERT INTO public.device_enroll_requests VALUES ('cmf2t3u8w0001rkp6wfadagol', 'cmefj940d0000dv47ygoytq4w', 'web_1756833164902_41rd7gza1', 'MacIntel', 'Mac', '127.0.0.1', NULL, 'enroll_1756833165533_2cejqksgg', 'APPROVED', '2025-09-02 17:12:45.534', '2025-09-02 17:27:45.533');
INSERT INTO public.device_enroll_requests VALUES ('cmewras88000jnb2qwcugspwo', 'cmeq07kdg000011t85ugqazgn', 'web_1756467332908_slimk430w', 'web', 'Unknown', '::1', NULL, 'enroll_1756467333223_begtq1yvp', 'APPROVED', '2025-08-29 11:35:33.224', '2025-08-29 11:50:33.224');
INSERT INTO public.device_enroll_requests VALUES ('cmesul0e10001m26pem0wkjhp', 'cmeq07kdg000011t85ugqazgn', 'web_1756230984205_trasi46t8', 'web', 'Unknown', '::1', NULL, 'enroll_1756230984502_fdgizywth', 'APPROVED', '2025-08-26 17:56:24.503', '2025-08-26 18:11:24.502');
INSERT INTO public.device_enroll_requests VALUES ('cmetw92w6000fita13yqvgexy', 'cmefj940d0000dv47ygoytq4w', 'web_1756294252929_n5ufmwj8w', 'web', 'Unknown', '::1', NULL, 'enroll_1756294253285_yyr1wb3dz', 'APPROVED', '2025-08-27 11:30:53.286', '2025-08-27 11:45:53.285');
INSERT INTO public.device_enroll_requests VALUES ('cmev9hx360001117xtsprx65d', 'cmeq07kdg000011t85ugqazgn', 'web_1756376966545_0zmhlv3jy', 'web', 'Unknown', '::1', NULL, 'enroll_1756376966848_ry5w6uywy', 'APPROVED', '2025-08-28 10:29:26.849', '2025-08-28 10:44:26.848');
INSERT INTO public.device_enroll_requests VALUES ('cmevlxre600011n5h33b3inkj', 'cmefj940d0000dv47ygoytq4w', 'web_1756397861048_1x13kwrp2', 'web', 'Unknown', '::1', NULL, 'enroll_1756397861357_af6rh90hz', 'APPROVED', '2025-08-28 16:17:41.358', '2025-08-28 16:32:41.357');
INSERT INTO public.device_enroll_requests VALUES ('cmevr8rit000lf1pdv8qnybv0', 'cmefj940d0000dv47ygoytq4w', 'web_1756406771995_ndt3hja72', 'web', 'Unknown', '::1', NULL, 'enroll_1756406772820_8c0cd2y8g', 'APPROVED', '2025-08-28 18:46:12.821', '2025-08-28 19:01:12.82');
INSERT INTO public.device_enroll_requests VALUES ('cmewigs320001cmpyft37alej', 'cmefj940d0000dv47ygoytq4w', 'web_1756452496053_uic9s0030', 'web', 'Unknown', '::1', NULL, 'enroll_1756452496429_jpnt2fnlk', 'APPROVED', '2025-08-29 07:28:16.43', '2025-08-29 07:43:16.429');
INSERT INTO public.device_enroll_requests VALUES ('cmex27i5n000b13uceatlpx2x', 'cmeq07kdg000011t85ugqazgn', 'web_1756485655623_uv7h9w9lz', 'web', 'Unknown', '::1', NULL, 'enroll_1756485655978_vdw6n0ccb', 'APPROVED', '2025-08-29 16:40:55.979', '2025-08-29 16:55:55.978');
INSERT INTO public.device_enroll_requests VALUES ('cmeyk51xk0007wb1nhbhb91pj', 'cmeq07kdg000011t85ugqazgn', 'web_1756576240618_a5p6853pr', 'web', 'Unknown', '::1', NULL, 'enroll_1756576240904_ggsv9acmy', 'APPROVED', '2025-08-30 17:50:40.904', '2025-08-30 18:05:40.904');
INSERT INTO public.device_enroll_requests VALUES ('cmeypj7380001w1zy28es9zwa', 'cmefj940d0000dv47ygoytq4w', 'web_1756585298554_zb5u934j4', 'web', 'Unknown', '::1', NULL, 'enroll_1756585298850_bh82xr5ww', 'APPROVED', '2025-08-30 20:21:38.851', '2025-08-30 20:36:38.85');
INSERT INTO public.device_enroll_requests VALUES ('cmeyqrw4x000mdsnc4785ydrf', 'cmeq07kdg000011t85ugqazgn', 'web_1756587383823_ezemjxc0s', 'web', 'Unknown', '::1', NULL, 'enroll_1756587384177_b47ptilaa', 'APPROVED', '2025-08-30 20:56:24.178', '2025-08-30 21:11:24.177');
INSERT INTO public.device_enroll_requests VALUES ('cmf00bfbi000113dboqy311y9', 'cmeq07kdg000011t85ugqazgn', 'web_1756663877283_u9mp1izbj', 'web', 'Unknown', '::1', NULL, 'enroll_1756663878220_ojzwp5m0k', 'APPROVED', '2025-08-31 18:11:18.222', '2025-08-31 18:26:18.22');
INSERT INTO public.device_enroll_requests VALUES ('cmf0u9lby0001fmy09xkkoka9', 'cmeq07kdg000011t85ugqazgn', 'web_1756714180756_gwtsdfouo', 'web', 'Unknown', '::1', NULL, 'enroll_1756714181181_36dyjhlwx', 'APPROVED', '2025-09-01 08:09:41.182', '2025-09-01 08:24:41.181');
INSERT INTO public.device_enroll_requests VALUES ('cmewrffze0001yix0x1bipdkq', 'cmeq07kdg000011t85ugqazgn', 'web_1756467550333_avy4m2sai', 'web', 'Unknown', '::1', NULL, 'enroll_1756467550634_5u5lgy04t', 'APPROVED', '2025-08-29 11:39:10.635', '2025-08-29 11:54:10.634');
INSERT INTO public.device_enroll_requests VALUES ('cmesv7bs00007m26pradx3ann', 'cmeq07kdg000011t85ugqazgn', 'web_1756232025342_6dyqbhunm', 'web', 'Unknown', '::1', NULL, 'enroll_1756232025696_jsmys4qgt', 'APPROVED', '2025-08-26 18:13:45.697', '2025-08-26 18:28:45.696');
INSERT INTO public.device_enroll_requests VALUES ('cmetz6y9k000jita1yo7ive9q', 'cmefj940d0000dv47ygoytq4w', 'web_1756299192497_qctlaty9z', 'web', 'Unknown', '::1', NULL, 'enroll_1756299192822_kgioyem3m', 'APPROVED', '2025-08-27 12:53:12.824', '2025-08-27 13:08:12.823');
INSERT INTO public.device_enroll_requests VALUES ('cmev0b7ym0001a877zqhselew', 'cmeq07kdg000011t85ugqazgn', 'web_1756361537467_oa6h5mss8', 'web', 'Unknown', '::1', NULL, 'enroll_1756361537804_qq5hl9a0f', 'APPROVED', '2025-08-28 06:12:17.805', '2025-08-28 06:27:17.804');
INSERT INTO public.device_enroll_requests VALUES ('cmev9sddz0001jhfsmoso8k2i', 'cmeq07kdg000011t85ugqazgn', 'web_1756377454167_kbzhzp8ih', 'web', 'Unknown', '::1', NULL, 'enroll_1756377454534_yjozuynkt', 'APPROVED', '2025-08-28 10:37:34.535', '2025-08-28 10:52:34.535');
INSERT INTO public.device_enroll_requests VALUES ('cmev9snog0007jhfs8ta4thrg', 'cmefj940d0000dv47ygoytq4w', 'web_1756377467433_62iub51vv', 'web', 'Unknown', '::1', NULL, 'enroll_1756377467871_kwyl8k0vi', 'APPROVED', '2025-08-28 10:37:47.872', '2025-08-28 10:52:47.871');
INSERT INTO public.device_enroll_requests VALUES ('cmevjwq9t0001mu9d3u2eillp', 'cmeq07kdg000011t85ugqazgn', 'web_1756394453643_ookaru390', 'web', 'Unknown', '::1', NULL, 'enroll_1756394454012_ixd9uhnds', 'APPROVED', '2025-08-28 15:20:54.014', '2025-08-28 15:35:54.012');
INSERT INTO public.device_enroll_requests VALUES ('cmevmhux00001ewbdfmiojdph', 'cmefj940d0000dv47ygoytq4w', 'web_1756398797599_1t00y1cqw', 'web', 'Unknown', '::1', NULL, 'enroll_1756398799041_efz1h84sm', 'APPROVED', '2025-08-28 16:33:19.044', '2025-08-28 16:48:19.042');
INSERT INTO public.device_enroll_requests VALUES ('cmevrb0bj000pf1pdo9ty7iv5', 'cmeq07kdg000011t85ugqazgn', 'web_1756406877194_xhrakwusg', 'web', 'Unknown', '::1', NULL, 'enroll_1756406877535_ub7a8rv2b', 'APPROVED', '2025-08-28 18:47:57.536', '2025-08-28 19:02:57.535');
INSERT INTO public.device_enroll_requests VALUES ('cmewki1yp0001g2dgjglixual', 'cmefj940d0000dv47ygoytq4w', 'web_1756455914838_tcmonublv', 'web', 'Unknown', '::1', NULL, 'enroll_1756455915120_939m5muyb', 'APPROVED', '2025-08-29 08:25:15.121', '2025-08-29 08:40:15.12');
INSERT INTO public.device_enroll_requests VALUES ('cmex2vapf000h13ucj51iq3iq', 'cmeq07kdg000011t85ugqazgn', 'web_1756486765779_oaa7ngi5l', 'web', 'Unknown', '::1', NULL, 'enroll_1756486766067_hu5beo7a6', 'APPROVED', '2025-08-29 16:59:26.068', '2025-08-29 17:14:26.067');
INSERT INTO public.device_enroll_requests VALUES ('cmeyl0c2x0001r518ker5wqs4', 'cmeq07kdg000011t85ugqazgn', 'web_1756577700117_0d4mrzjdp', 'web', 'Unknown', '::1', NULL, 'enroll_1756577700392_qob0in19s', 'APPROVED', '2025-08-30 18:15:00.393', '2025-08-30 18:30:00.392');
INSERT INTO public.device_enroll_requests VALUES ('cmeypkcxb0005w1zyklo9t0h1', 'cmefj940d0000dv47ygoytq4w', 'web_1756585352748_5cp86p2ks', 'web', 'Unknown', '::1', NULL, 'enroll_1756585353071_6xpfnpe2y', 'APPROVED', '2025-08-30 20:22:33.072', '2025-08-30 20:37:33.071');
INSERT INTO public.device_enroll_requests VALUES ('cmezdhql20001eg9jq9u80nkz', 'cmefj940d0000dv47ygoytq4w', 'web_1756625541301_oe2xk9ix0', 'web', 'Unknown', '::1', NULL, 'enroll_1756625541587_sj93o3b0i', 'APPROVED', '2025-08-31 07:32:21.588', '2025-08-31 07:47:21.587');
INSERT INTO public.device_enroll_requests VALUES ('cmf03v4yi000ta6bv97xjo108', 'cmeq07kdg000011t85ugqazgn', 'web_1756669836478_lratvrghx', 'web', 'Unknown', '::1', NULL, 'enroll_1756669836761_q6izhia93', 'APPROVED', '2025-08-31 19:50:36.763', '2025-08-31 20:05:36.761');
INSERT INTO public.device_enroll_requests VALUES ('cmf0uptou0007fmy0oijn56lp', 'cmeq07kdg000011t85ugqazgn', 'web_1756714938199_myyhs150e', 'web', 'Unknown', '::1', NULL, 'enroll_1756714938510_w2qghtbvd', 'APPROVED', '2025-09-01 08:22:18.511', '2025-09-01 08:37:18.51');
INSERT INTO public.device_enroll_requests VALUES ('cmesa20kr000rjfu5mdtvhn1k', 'cmeq07kdg000011t85ugqazgn', 'web_1756196505602_lwvys0g3r', 'web', 'Unknown', '::1', NULL, 'enroll_1756196505962_ihp4gdma8', 'APPROVED', '2025-08-26 08:21:45.963', '2025-08-26 08:36:45.962');
INSERT INTO public.device_enroll_requests VALUES ('cmeswacn4000110xw77s0176s', 'cmeq07kdg000011t85ugqazgn', 'web_1756233846035_doeabd0xq', 'web', 'Unknown', '::1', NULL, 'enroll_1756233846394_xl6m75sv6', 'APPROVED', '2025-08-26 18:44:06.396', '2025-08-26 18:59:06.394');
INSERT INTO public.device_enroll_requests VALUES ('cmev0hdz20007a877ssjdt2i5', 'cmefj940d0000dv47ygoytq4w', 'web_1756361825215_oth3ba7bs', 'web', 'Unknown', '::1', NULL, 'enroll_1756361825534_qcvfw7u7n', 'APPROVED', '2025-08-28 06:17:05.534', '2025-08-28 06:32:05.534');
INSERT INTO public.device_enroll_requests VALUES ('cmev9ziis0001qyazxdgjjxqv', 'cmeq07kdg000011t85ugqazgn', 'web_1756377787485_q8qkja2d0', 'web', 'Unknown', '::1', NULL, 'enroll_1756377787777_6sifra0i3', 'APPROVED', '2025-08-28 10:43:07.778', '2025-08-28 10:58:07.777');
INSERT INTO public.device_enroll_requests VALUES ('cmevkfvxr000138n6pqoqum13', 'cmeq07kdg000011t85ugqazgn', 'web_1756395347460_sstig3gog', 'web', 'Unknown', '::1', NULL, 'enroll_1756395347817_lnbzm3xip', 'APPROVED', '2025-08-28 15:35:47.819', '2025-08-28 15:50:47.818');
INSERT INTO public.device_enroll_requests VALUES ('cmevn8qjb0001gwdaylan5jx9', 'cmefj940d0000dv47ygoytq4w', 'web_1756400052654_i6gzxbyk1', 'web', 'Unknown', '::1', NULL, 'enroll_1756400053076_6r6o36xt7', 'APPROVED', '2025-08-28 16:54:13.078', '2025-08-28 17:09:13.076');
INSERT INTO public.device_enroll_requests VALUES ('cmevsgo91000tf1pdx86bhlud', 'cmeq07kdg000011t85ugqazgn', 'web_1756408821146_v0zlfl4bw', 'web', 'Unknown', '::1', NULL, 'enroll_1756408821445_9fw60k0jc', 'APPROVED', '2025-08-28 19:20:21.446', '2025-08-28 19:35:21.445');
INSERT INTO public.device_enroll_requests VALUES ('cmewl4n4f0001soecxmkgodut', 'cmefj940d0000dv47ygoytq4w', 'web_1756456968691_kensajtmx', 'web', 'Unknown', '::1', NULL, 'enroll_1756456968972_myuyizfh0', 'APPROVED', '2025-08-29 08:42:48.973', '2025-08-29 08:57:48.972');
INSERT INTO public.device_enroll_requests VALUES ('cmews5b4o003vyix0c4o2wu3r', 'cmeq07kdg000011t85ugqazgn', 'web_1756468757085_0fmzl5olv', 'web', 'Unknown', '::1', NULL, 'enroll_1756468757399_z3it0mjbp', 'APPROVED', '2025-08-29 11:59:17.4', '2025-08-29 12:14:17.399');
INSERT INTO public.device_enroll_requests VALUES ('cmey9izws000l13uc68e0j6rm', 'cmeq07kdg000011t85ugqazgn', 'web_1756558415416_fi7cyynnt', 'web', 'Unknown', '::1', NULL, 'enroll_1756558415690_mgczct5fs', 'APPROVED', '2025-08-30 12:53:35.691', '2025-08-30 13:08:35.69');
INSERT INTO public.device_enroll_requests VALUES ('cmeymhtbu0001riluprd9luqj', 'cmeq07kdg000011t85ugqazgn', 'web_1756580195231_jk0ba7znu', 'web', 'Unknown', '::1', NULL, 'enroll_1756580195513_f5lwraohr', 'APPROVED', '2025-08-30 18:56:35.514', '2025-08-30 19:11:35.513');
INSERT INTO public.device_enroll_requests VALUES ('cmeypsvzg000bw1zyr6c5q0lf', 'cmeq07kdg000011t85ugqazgn', 'web_1756585750716_t1vby5b0k', 'web', 'Unknown', '::1', NULL, 'enroll_1756585751020_hb69tclq7', 'APPROVED', '2025-08-30 20:29:11.021', '2025-08-30 20:44:11.02');
INSERT INTO public.device_enroll_requests VALUES ('cmezdit7p0007eg9jegr71dn0', 'cmeq07kdg000011t85ugqazgn', 'web_1756625591361_5zfgk56ov', 'web', 'Unknown', '::1', NULL, 'enroll_1756625591652_t1qumsi6n', 'APPROVED', '2025-08-31 07:33:11.653', '2025-08-31 07:48:11.652');
INSERT INTO public.device_enroll_requests VALUES ('cmf048n850001mdmxlmn680jv', 'cmeq07kdg000011t85ugqazgn', 'web_1756670466585_ggzs6n969', 'web', 'Unknown', '::1', NULL, 'enroll_1756670466963_rm3vx8256', 'APPROVED', '2025-08-31 20:01:06.964', '2025-08-31 20:16:06.963');
INSERT INTO public.device_enroll_requests VALUES ('cmf0uup700001ke2w26u4egnl', 'cmeq07kdg000011t85ugqazgn', 'web_1756715165267_2ltd4to38', 'MacIntel', 'Mac', '127.0.0.1', NULL, 'enroll_1756715165963_wcimu7oc5', 'APPROVED', '2025-09-01 08:26:05.964', '2025-09-01 08:41:05.963');
INSERT INTO public.device_enroll_requests VALUES ('cmesae0my0001e4ercumwcma0', 'cmeq07kdg000011t85ugqazgn', 'web_1756197065640_2c3r4fada', 'web', 'Unknown', '::1', NULL, 'enroll_1756197065914_hosvbl0i6', 'APPROVED', '2025-08-26 08:31:05.915', '2025-08-26 08:46:05.914');
INSERT INTO public.device_enroll_requests VALUES ('cmetm800100014mxcyuq2xeft', 'cmeq07kdg000011t85ugqazgn', 'web_1756277406384_uzmygark2', 'web', 'Unknown', '::1', NULL, 'enroll_1756277406717_sg12xoza3', 'APPROVED', '2025-08-27 06:50:06.719', '2025-08-27 07:05:06.717');
INSERT INTO public.device_enroll_requests VALUES ('cmev0jgw8000ba877ibg2kefb', 'cmeq07kdg000011t85ugqazgn', 'web_1756361922334_ziq7y37hz', 'web', 'Unknown', '::1', NULL, 'enroll_1756361922631_lnhze1hmn', 'APPROVED', '2025-08-28 06:18:42.632', '2025-08-28 06:33:42.631');
INSERT INTO public.device_enroll_requests VALUES ('cmevdzae00001zr1xvz52brqm', 'cmeq07kdg000011t85ugqazgn', 'web_1756384495381_s6s8epgv8', 'web', 'Unknown', '::1', NULL, 'enroll_1756384495699_ykgd7yaug', 'APPROVED', '2025-08-28 12:34:55.702', '2025-08-28 12:49:55.7');
INSERT INTO public.device_enroll_requests VALUES ('cmevkghgo000738n6z8mo7b5m', 'cmeq07kdg000011t85ugqazgn', 'web_1756395375446_bar4dhkll', 'web', 'Unknown', '::1', NULL, 'enroll_1756395375720_lc2kwuybg', 'APPROVED', '2025-08-28 15:36:15.721', '2025-08-28 15:51:15.72');
INSERT INTO public.device_enroll_requests VALUES ('cmevnthtk0005gwdabk4r75l5', 'cmefj940d0000dv47ygoytq4w', 'web_1756401021287_y6clhlzcb', 'web', 'Unknown', '::1', NULL, 'enroll_1756401021560_liffvk25i', 'APPROVED', '2025-08-28 17:10:21.561', '2025-08-28 17:25:21.56');
INSERT INTO public.device_enroll_requests VALUES ('cmevsp7vl000zf1pdpf9i1qx5', 'cmefj940d0000dv47ygoytq4w', 'web_1756409219816_4ymtuy7ha', 'web', 'Unknown', '::1', NULL, 'enroll_1756409220129_i0i9myloh', 'APPROVED', '2025-08-28 19:27:00.129', '2025-08-28 19:42:00.129');
INSERT INTO public.device_enroll_requests VALUES ('cmewlquix0001nb2q1er0vien', 'cmefj940d0000dv47ygoytq4w', 'web_1756458004702_2d8jienxp', 'web', 'Unknown', '::1', NULL, 'enroll_1756458005001_xau6oxdos', 'APPROVED', '2025-08-29 09:00:05.002', '2025-08-29 09:15:05.001');
INSERT INTO public.device_enroll_requests VALUES ('cmewswu5g0021qiczjvrmiw30', 'cmeq07kdg000011t85ugqazgn', 'web_1756470041468_uci81q49k', 'web', 'Unknown', '::1', NULL, 'enroll_1756470041764_dg5f64cmy', 'APPROVED', '2025-08-29 12:20:41.765', '2025-08-29 12:35:41.764');
INSERT INTO public.device_enroll_requests VALUES ('cmeya8s51000p13uc5hbbsjvv', 'cmeq07kdg000011t85ugqazgn', 'web_1756559618400_iu51y4b9k', 'web', 'Unknown', '::1', NULL, 'enroll_1756559618676_n7tkhr8qo', 'APPROVED', '2025-08-30 13:13:38.677', '2025-08-30 13:28:38.676');
INSERT INTO public.device_enroll_requests VALUES ('cmeynwpee00019j0n7sqy53fo', 'cmeq07kdg000011t85ugqazgn', 'web_1756582567377_pe90azse5', 'web', 'Unknown', '::1', NULL, 'enroll_1756582569872_1mojdcqpj', 'APPROVED', '2025-08-30 19:36:09.875', '2025-08-30 19:51:09.872');
INSERT INTO public.device_enroll_requests VALUES ('cmeyq1aj5000hw1zyl2ng3c8r', 'cmefj940d0000dv47ygoytq4w', 'web_1756586142842_1gp247abl', 'web', 'Unknown', '::1', NULL, 'enroll_1756586143121_lyh9kzs5r', 'APPROVED', '2025-08-30 20:35:43.122', '2025-08-30 20:50:43.121');
INSERT INTO public.device_enroll_requests VALUES ('cmeze5cjc00032bny81wjoi74', 'cmefj940d0000dv47ygoytq4w', 'web_1756626642853_mbvvi3ye5', 'web', 'Unknown', '::1', NULL, 'enroll_1756626643128_uboog9wh8', 'APPROVED', '2025-08-31 07:50:43.129', '2025-08-31 08:05:43.128');
INSERT INTO public.device_enroll_requests VALUES ('cmf0tfyvi0001os9e07s4aahq', 'cmeq07kdg000011t85ugqazgn', 'web_1756712798750_6u32chute', 'web', 'Unknown', '::1', NULL, 'enroll_1756712799050_1689shgrk', 'APPROVED', '2025-09-01 07:46:39.052', '2025-09-01 08:01:39.05');
INSERT INTO public.device_enroll_requests VALUES ('cmf2nsj1g0001ixl25452ws8r', 'cmefj94h80002dv47vj17m218', 'test-device-123', 'web', 'Chrome', '127.0.0.1', NULL, 'enroll_1756824239711_3rbl06vf8', 'APPROVED', '2025-09-02 14:43:59.714', '2025-09-02 14:58:59.712');
INSERT INTO public.device_enroll_requests VALUES ('cmesf85f10005e4er35zhkn6b', 'cmeq07kdg000011t85ugqazgn', 'web_1756205189907_iewo9ilap', 'web', 'Unknown', '::1', NULL, 'enroll_1756205190253_ob1f7sgk7', 'APPROVED', '2025-08-26 10:46:30.253', '2025-08-26 11:01:30.253');
INSERT INTO public.device_enroll_requests VALUES ('cmetu9w6k0001ita1sspd3dnf', 'cmeq07kdg000011t85ugqazgn', 'web_1756290931529_l4epc8sex', 'web', 'Unknown', '::1', NULL, 'enroll_1756290932007_hsumbpko9', 'APPROVED', '2025-08-27 10:35:32.008', '2025-08-27 10:50:32.007');
INSERT INTO public.device_enroll_requests VALUES ('cmev25fk400018080ie763oxv', 'cmeq07kdg000011t85ugqazgn', 'web_1756364626660_uipw6iyuw', 'web', 'Unknown', '::1', NULL, 'enroll_1756364626946_ul1q6n11p', 'APPROVED', '2025-08-28 07:03:46.947', '2025-08-28 07:18:46.946');
INSERT INTO public.device_enroll_requests VALUES ('cmev26djs0005808066aqejns', 'cmeq07kdg000011t85ugqazgn', 'web_1756364670653_u9z57tplx', 'web', 'Unknown', '::1', NULL, 'enroll_1756364671000_8lvdzkzwe', 'APPROVED', '2025-08-28 07:04:31.001', '2025-08-28 07:19:31');
INSERT INTO public.device_enroll_requests VALUES ('cmev26ovq000b8080xbl26zcw', 'cmefj940d0000dv47ygoytq4w', 'web_1756364685229_pfb0swpk1', 'web', 'Unknown', '::1', NULL, 'enroll_1756364685686_kgyhg8zif', 'APPROVED', '2025-08-28 07:04:45.686', '2025-08-28 07:19:45.686');
INSERT INTO public.device_enroll_requests VALUES ('cmeve2ymc0005zr1xmvkap5yl', 'cmeq07kdg000011t85ugqazgn', 'web_1756384666803_13hlv8evw', 'web', 'Unknown', '::1', NULL, 'enroll_1756384667076_f57z732gb', 'APPROVED', '2025-08-28 12:37:47.076', '2025-08-28 12:52:47.076');
INSERT INTO public.device_enroll_requests VALUES ('cmevkkk8x000110d830ndl9em', 'cmeq07kdg000011t85ugqazgn', 'web_1756395565676_kgwa5gxzu', 'web', 'Unknown', '::1', NULL, 'enroll_1756395565950_rkcgtwisz', 'APPROVED', '2025-08-28 15:39:25.95', '2025-08-28 15:54:25.95');
INSERT INTO public.device_enroll_requests VALUES ('cmevox25o0001f1pdspogzfxk', 'cmeq07kdg000011t85ugqazgn', 'web_1756402867098_rn80dwi56', 'web', 'Unknown', '::1', NULL, 'enroll_1756402867497_3p696hxm7', 'APPROVED', '2025-08-28 17:41:07.498', '2025-08-28 17:56:07.497');
INSERT INTO public.device_enroll_requests VALUES ('cmevsrlve0015f1pdgq10u7az', 'cmeq07kdg000011t85ugqazgn', 'web_1756409331294_hn0mzw8oi', 'web', 'Unknown', '::1', NULL, 'enroll_1756409331578_fp0qf5sa5', 'APPROVED', '2025-08-28 19:28:51.578', '2025-08-28 19:43:51.578');
INSERT INTO public.device_enroll_requests VALUES ('cmewmgdrc0005nb2qxvgqi73c', 'cmefj940d0000dv47ygoytq4w', 'web_1756459196015_0a936njwg', 'web', 'Unknown', '::1', NULL, 'enroll_1756459196327_8bkc1s844', 'APPROVED', '2025-08-29 09:19:56.328', '2025-08-29 09:34:56.327');
INSERT INTO public.device_enroll_requests VALUES ('cmewu7vhv002dqicz4oil8zd7', 'cmeq07kdg000011t85ugqazgn', 'web_1756472236048_cbdea9p24', 'web', 'Unknown', '::1', NULL, 'enroll_1756472236339_tknrqjw44', 'APPROVED', '2025-08-29 12:57:16.339', '2025-08-29 13:12:16.339');
INSERT INTO public.device_enroll_requests VALUES ('cmeyatf93000v13ucw81nsrbi', 'cmeq07kdg000011t85ugqazgn', 'web_1756560581476_8fklqb154', 'web', 'Unknown', '::1', NULL, 'enroll_1756560581750_njjfd2oa9', 'APPROVED', '2025-08-30 13:29:41.751', '2025-08-30 13:44:41.75');
INSERT INTO public.device_enroll_requests VALUES ('cmeyo6jkb000d9j0nqkyviet3', 'cmefj940d0000dv47ygoytq4w', 'web_1756583028601_0ugszmzhh', 'web', 'Unknown', '::1', NULL, 'enroll_1756583028875_x5voginjm', 'APPROVED', '2025-08-30 19:43:48.875', '2025-08-30 19:58:48.875');
INSERT INTO public.device_enroll_requests VALUES ('cmeyq1rbv000nw1zyuizwumyv', 'cmeq07kdg000011t85ugqazgn', 'web_1756586164621_02kcv8qpz', 'web', 'Unknown', '::1', NULL, 'enroll_1756586164891_ah45eoq6b', 'APPROVED', '2025-08-30 20:36:04.892', '2025-08-30 20:51:04.891');
INSERT INTO public.device_enroll_requests VALUES ('cmeze5vg000092bny1kghqhk4', 'cmeq07kdg000011t85ugqazgn', 'web_1756626667357_vejuh5an6', 'web', 'Unknown', '::1', NULL, 'enroll_1756626667631_zci51mwht', 'APPROVED', '2025-08-31 07:51:07.632', '2025-08-31 08:06:07.631');
INSERT INTO public.device_enroll_requests VALUES ('cmf0thuno0007os9esc1l1184', 'cmeq07kdg000011t85ugqazgn', 'web_1756712886597_i50w8aqz9', 'web', 'Unknown', '::1', NULL, 'enroll_1756712886899_gu20qc0vy', 'APPROVED', '2025-09-01 07:48:06.9', '2025-09-01 08:03:06.899');
INSERT INTO public.device_enroll_requests VALUES ('cmf2q9q6i0001z833ovo4wqcy', 'cmefj948t0001dv47qdb5yn6x', 'test-device-instructor', 'web', 'Chrome', '127.0.0.1', NULL, 'enroll_1756828401352_pmc9dfdbu', 'APPROVED', '2025-09-02 15:53:21.354', '2025-09-02 16:08:21.353');
INSERT INTO public.device_enroll_requests VALUES ('cmesh65yy0001ftijackprpjh', 'cmeq07kdg000011t85ugqazgn', 'web_1756208456533_t9ft6c9u8', 'web', 'Unknown', '::1', NULL, 'enroll_1756208456886_tra3khksg', 'APPROVED', '2025-08-26 11:40:56.888', '2025-08-26 11:55:56.886');
INSERT INTO public.device_enroll_requests VALUES ('cmetuyk8p0005ita1bmvk6shf', 'cmeq07kdg000011t85ugqazgn', 'web_1756292082563_0cib5sz3o', 'web', 'Unknown', '::1', NULL, 'enroll_1756292082936_71bsj5rl8', 'APPROVED', '2025-08-27 10:54:42.938', '2025-08-27 11:09:42.937');
INSERT INTO public.device_enroll_requests VALUES ('cmev2bbg30001m4eo3htoekzw', 'cmefj940d0000dv47ygoytq4w', 'web_1756364901172_wdxgzfi9g', 'web', 'Unknown', '::1', NULL, 'enroll_1756364901554_runcgmhcl', 'APPROVED', '2025-08-28 07:08:21.555', '2025-08-28 07:23:21.554');
INSERT INTO public.device_enroll_requests VALUES ('cmevkmmoz0001euqqurz917dd', 'cmeq07kdg000011t85ugqazgn', 'web_1756395662138_9dugveshm', 'web', 'Unknown', '::1', NULL, 'enroll_1756395662435_272heh55v', 'APPROVED', '2025-08-28 15:41:02.436', '2025-08-28 15:56:02.435');
INSERT INTO public.device_enroll_requests VALUES ('cmex0f2gh000113ucnx9jgidr', 'cmeq07kdg000011t85ugqazgn', 'web_1756482649352_2ci31pvre', 'web', 'Unknown', '::1', NULL, 'enroll_1756482649646_voqkga8e8', 'APPROVED', '2025-08-29 15:50:49.647', '2025-08-29 16:05:49.646');
INSERT INTO public.device_enroll_requests VALUES ('cmevqcu6f0005f1pd3cghm749', 'cmeq07kdg000011t85ugqazgn', 'web_1756405282921_fps90z0ws', 'web', 'Unknown', '::1', NULL, 'enroll_1756405283271_v40wc2owx', 'APPROVED', '2025-08-28 18:21:23.272', '2025-08-28 18:36:23.271');
INSERT INTO public.device_enroll_requests VALUES ('cmevszz71001df1pd6la00gh6', 'cmeq07kdg000011t85ugqazgn', 'web_1756409721091_tck2c59of', 'web', 'Unknown', '::1', NULL, 'enroll_1756409722090_43vviqgvd', 'APPROVED', '2025-08-28 19:35:22.093', '2025-08-28 19:50:22.09');
INSERT INTO public.device_enroll_requests VALUES ('cmeyp0ozk000h9j0ns8u3nhtu', 'cmeq07kdg000011t85ugqazgn', 'web_1756584435197_090sde4cb', 'web', 'Unknown', '::1', NULL, 'enroll_1756584435584_2mgzopxr3', 'APPROVED', '2025-08-30 20:07:15.584', '2025-08-30 20:22:15.584');
INSERT INTO public.device_enroll_requests VALUES ('cmeyp16i4000n9j0ndiablzw0', 'cmefj940d0000dv47ygoytq4w', 'web_1756584457995_v567t70if', 'web', 'Unknown', '::1', NULL, 'enroll_1756584458284_3wqfoimf9', 'APPROVED', '2025-08-30 20:07:38.285', '2025-08-30 20:22:38.284');
INSERT INTO public.device_enroll_requests VALUES ('cmeyqlag10002dsncgz2o5ghb', 'cmeyql63f0000dsnc68iu1aap', 'web_1756587075736_fn53t0166', 'web', 'Unknown', '::1', NULL, 'enroll_1756587076128_6a6la619a', 'APPROVED', '2025-08-30 20:51:16.13', '2025-08-30 21:06:16.128');
INSERT INTO public.device_enroll_requests VALUES ('cmeyqlk9t0008dsncxfeotdr6', 'cmefj940d0000dv47ygoytq4w', 'web_1756587088574_8vwnpqcyb', 'web', 'Unknown', '::1', NULL, 'enroll_1756587088865_yfz8hqxpv', 'APPROVED', '2025-08-30 20:51:28.865', '2025-08-30 21:06:28.865');
INSERT INTO public.device_enroll_requests VALUES ('cmezs0ik50001vtp3f55oo07b', 'cmeq07kdg000011t85ugqazgn', 'web_1756649931868_m5ml05lek', 'web', 'Unknown', '::1', NULL, 'enroll_1756649932276_ohttmenoi', 'APPROVED', '2025-08-31 14:18:52.277', '2025-08-31 14:33:52.276');
INSERT INTO public.device_enroll_requests VALUES ('cmf0u48uu0001zg9m8dr33mt7', 'cmeq07kdg000011t85ugqazgn', 'web_1756713931429_86h88kkpw', 'web', 'Unknown', '::1', NULL, 'enroll_1756713931731_h9wahr1pj', 'APPROVED', '2025-09-01 08:05:31.732', '2025-09-01 08:20:31.731');
INSERT INTO public.device_enroll_requests VALUES ('cmf2qflfa0005z833tqx07szm', 'cmefj940d0000dv47ygoytq4w', 'web_1756726464457_1w65gy4sq', 'MacIntel', 'Mac', '127.0.0.1', NULL, 'enroll_1756828675125_mxkwyswgz', 'APPROVED', '2025-09-02 15:57:55.126', '2025-09-02 16:12:55.125');


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.lesson_progress VALUES ('cmf00p65e0005a6bvwudo2lnv', 'cmeq07kdg000011t85ugqazgn', 'cmevqmu4n000hf1pd3tndv1pp', 4, 347, false, 15.83692782500262, '2025-08-31 18:21:59.522', '2025-08-31 18:39:29.06', NULL);
INSERT INTO public.lesson_progress VALUES ('cmf01bs6c000ha6bv40335cjs', 'cmeq07kdg000011t85ugqazgn', 'cmevqnd2l000jf1pdww1662ce', 1, 347, false, 4.367365336999795, '2025-08-31 18:39:34.5', '2025-08-31 18:39:42.189', NULL);
INSERT INTO public.lesson_progress VALUES ('cmf00ll4w0003a6bva0gafdre', 'cmeq07kdg000011t85ugqazgn', 'cmevqlyc7000ff1pde66kidqf', 5, 699, false, 36.08638744499964, '2025-08-31 18:19:12.321', '2025-09-10 19:22:34.139', NULL);
INSERT INTO public.lesson_progress VALUES ('cmfcxih0e000126ourug82z1y', 'cmeq07kdg000011t85ugqazgn', 'cmfcwmwpu0001hdk2z17890qg', 100, 0, false, 0, '2025-09-09 19:13:48.442', '2025-09-11 15:16:43.143', NULL);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.messages VALUES ('cmeyqmfm4000edsncny8403ze', 'cmeq07kdg000011t85ugqazgn', 'cmefj940d0000dv47ygoytq4w', 'test', 'test', 'QUESTION', 'REPLIED', true, '2025-08-30 20:52:09.484', '2025-08-31 07:50:56.077');
INSERT INTO public.messages VALUES ('cmeyqlg5m0006dsncezyjuh82', 'cmeyql63f0000dsnc68iu1aap', 'cmefj940d0000dv47ygoytq4w', 'Test Mesajı', 'Bu bir test mesajıdır', 'QUESTION', 'READ', true, '2025-08-30 20:51:23.531', '2025-09-01 12:48:46.653');


--
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: message_replies; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.message_replies VALUES ('cmeyqs7vj000sdsnc0oq64mtl', 'cmeyqmfm4000edsncny8403ze', 'cmeq07kdg000011t85ugqazgn', 'test', false, '2025-08-30 20:56:39.391', false);
INSERT INTO public.message_replies VALUES ('cmeyqsdtg000udsncfa1zj205', 'cmeyqmfm4000edsncny8403ze', 'cmeq07kdg000011t85ugqazgn', 'tstsı', false, '2025-08-30 20:56:47.092', false);
INSERT INTO public.message_replies VALUES ('cmeyqw4830001mlt4ujk5axvn', 'cmeyqmfm4000edsncny8403ze', 'cmeq07kdg000011t85ugqazgn', 's', false, '2025-08-30 20:59:41.284', false);
INSERT INTO public.message_replies VALUES ('cmeyqpej3000kdsncpgaxfmc1', 'cmeyqmfm4000edsncny8403ze', 'cmefj940d0000dv47ygoytq4w', 'test', true, '2025-08-30 20:54:28.047', true);
INSERT INTO public.message_replies VALUES ('cmezdi3yq0005eg9j70j7j7bf', 'cmeyqmfm4000edsncny8403ze', 'cmefj940d0000dv47ygoytq4w', 'test', true, '2025-08-31 07:32:38.93', true);
INSERT INTO public.message_replies VALUES ('cmeze4y8c00012bnyhj2c2jfa', 'cmeyqmfm4000edsncny8403ze', 'cmeq07kdg000011t85ugqazgn', 'sfsf', false, '2025-08-31 07:50:24.588', false);
INSERT INTO public.message_replies VALUES ('cmeze5miy00072bnye4h0zcb6', 'cmeyqmfm4000edsncny8403ze', 'cmefj940d0000dv47ygoytq4w', 'safsa', true, '2025-08-31 07:50:56.075', true);
INSERT INTO public.message_replies VALUES ('cmeyqlpyd000cdsncvy0rjvu2', 'cmeyqlg5m0006dsncezyjuh82', 'cmefj940d0000dv47ygoytq4w', 'Merhaba! Test mesajınızı aldım. Size nasıl yardımcı olabilirim?', true, '2025-08-30 20:51:36.23', true);


--
-- Data for Name: navigation; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.notes VALUES ('cmewsn82y0007qicz5d30wm63', 'cmeq07kdg000011t85ugqazgn', 'cmevqlyc7000ff1pde66kidqf', 'test', 78.6649692, true, '2025-08-29 12:13:13.259', '2025-08-29 12:13:13.259');
INSERT INTO public.notes VALUES ('cmf03a3qj000ra6bvf7n7fy4c', 'cmeq07kdg000011t85ugqazgn', 'cmevqnd2l000jf1pdww1662ce', 'test', 4.3673653, true, '2025-08-31 19:34:15.403', '2025-08-31 19:34:15.403');
INSERT INTO public.notes VALUES ('cmf11miyk000b11z02ibrl1tf', 'cmeq07kdg000011t85ugqazgn', 'cmevqlyc7000ff1pde66kidqf', 'önemli', 27.34274881200219, true, '2025-09-01 11:35:41.949', '2025-09-01 11:35:41.949');


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.site_settings VALUES ('cmeml5hr200016d3jgyowun2s', 'platform_url', '"https://lms-platform.com"');
INSERT INTO public.site_settings VALUES ('cmeml5hr300026d3jqmi5vkaj', 'default_language', '"tr"');
INSERT INTO public.site_settings VALUES ('cmeml5hr500046d3jysxfi9d9', 'min_password_length', '8');
INSERT INTO public.site_settings VALUES ('cmeml5hr700056d3jd0mlqbq0', 'jwt_expires_in_hours', '24');
INSERT INTO public.site_settings VALUES ('cmeml5hr800066d3jfvcpc03m', 'two_factor_auth', 'true');
INSERT INTO public.site_settings VALUES ('cmeml5hra00076d3j5hst4592', 'rate_limiting', 'true');
INSERT INTO public.site_settings VALUES ('cmeml5hrc00086d3jmnmr9j2g', 'paytr_merchant_id', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hre00096d3jmxuojvpj', 'paytr_merchant_key', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hrf000a6d3jw5yrrsti', 'iyzico_api_key', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hrg000b6d3j15ngt8m5', 'iyzico_secret_key', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hrh000c6d3jsiqeokp6', 'sandbox_mode', 'false');
INSERT INTO public.site_settings VALUES ('cmeml5hri000d6d3jxe4juwge', 'smtp_host', '"smtp.gmail.com"');
INSERT INTO public.site_settings VALUES ('cmeml5hrk000e6d3jsjkhuj9u', 'smtp_port', '587');
INSERT INTO public.site_settings VALUES ('cmeml5hrl000f6d3j1r6nrahy', 'smtp_security', '"tls"');
INSERT INTO public.site_settings VALUES ('cmeml5hrl000g6d3jj8idssh1', 'smtp_username', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hrm000h6d3jafq0o02j', 'smtp_password', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hrn000i6d3j215c7qyv', 'sender_name', '"LMS Platform"');
INSERT INTO public.site_settings VALUES ('cmeml5hrn000j6d3jr2g3gnr1', 'aws_access_key_id', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hro000k6d3jxmr802wf', 'aws_secret_access_key', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hrp000l6d3jzu07mccw', 'aws_bucket_name', '"lms-platform-bucket"');
INSERT INTO public.site_settings VALUES ('cmeml5hrq000m6d3jx6vk6uz3', 'aws_region', '"eu-west-1"');
INSERT INTO public.site_settings VALUES ('cmeml5hrs000n6d3jvw6gnw7u', 'cloudfront_domain', '""');
INSERT INTO public.site_settings VALUES ('cmeml5hrv000o6d3j8d6yrpei', 'use_cdn', 'true');
INSERT INTO public.site_settings VALUES ('cmeml5hrw000p6d3jxw53jsa5', 'default_timezone', '"Europe/Istanbul"');
INSERT INTO public.site_settings VALUES ('cmeml5hrx000q6d3j1zc3pv70', 'date_format', '"DD/MM/YYYY"');
INSERT INTO public.site_settings VALUES ('cmeml5hry000r6d3jsrm1hn1x', 'time_format', '"24"');
INSERT INTO public.site_settings VALUES ('cmeml5hrz000s6d3j1lq90ny6', 'week_start_day', '1');
INSERT INTO public.site_settings VALUES ('cmeml5hqw00006d3jjsgwsuxz', 'platform_name', '"LMS Platform Pro"');
INSERT INTO public.site_settings VALUES ('cmeml5hr400036d3j6xhbrzg0', 'default_currency', '"TRY"');
INSERT INTO public.site_settings VALUES ('cmemo6et20000v3mlv33p3sd2', 'tax_rate', '"18"');
INSERT INTO public.site_settings VALUES ('cmemo6etb0001v3ml57p3yz9w', 'tax_included_by_default', '"false"');


--
-- Data for Name: user_devices; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--

INSERT INTO public.user_devices VALUES ('cmf0uup790003ke2w2ryzlmbi', 'cmeq07kdg000011t85ugqazgn', 'web_1756715165267_2ltd4to38', 'key_1756715165972', 'MacIntel', 'Mac', NULL, '127.0.0.1', '176.234.133.244', '2025-09-11 15:43:49.746', false, true, '2025-09-01 08:26:05.972', 'MacIntel - Safari 18.6', 'macOS 10.15', 'Safari 18.6', '2025-09-01 08:26:05.973', '2025-09-11 15:43:49.746');
INSERT INTO public.user_devices VALUES ('cmf2nsj1z0003ixl2lhvl4vfa', 'cmefj94h80002dv47vj17m218', 'test-device-123', 'key_1756824239734', 'web', 'Chrome', NULL, '127.0.0.1', '127.0.0.1', '2025-09-02 14:44:18.343', false, true, '2025-09-02 14:43:59.734', 'web Device', NULL, NULL, '2025-09-02 14:43:59.735', '2025-09-02 14:44:18.343');
INSERT INTO public.user_devices VALUES ('cmf2q9q7c0003z833vmtxk0tx', 'cmefj948t0001dv47qdb5yn6x', 'test-device-instructor', 'key_1756828401383', 'web', 'Chrome', NULL, '127.0.0.1', '127.0.0.1', '2025-09-02 15:53:21.395', false, true, '2025-09-02 15:53:21.383', 'web Device', NULL, NULL, '2025-09-02 15:53:21.384', '2025-09-02 15:53:21.395');
INSERT INTO public.user_devices VALUES ('cmf2qflfd0007z833p75d9cvm', 'cmefj940d0000dv47ygoytq4w', 'web_1756726464457_1w65gy4sq', 'key_1756828675129', 'MacIntel', 'Mac', NULL, '127.0.0.1', '127.0.0.1', '2025-09-02 15:57:55.132', true, true, '2025-09-02 15:57:55.129', 'Admin-MacIntel', NULL, NULL, '2025-09-02 15:57:55.13', '2025-09-02 15:57:55.132');
INSERT INTO public.user_devices VALUES ('cmf2t3u930003rkp61ng16rr3', 'cmefj940d0000dv47ygoytq4w', 'web_1756833164902_41rd7gza1', 'key_1756833165543', 'MacIntel', 'Mac', NULL, '127.0.0.1', '127.0.0.1', '2025-09-02 17:12:45.555', true, true, '2025-09-02 17:12:45.543', 'Admin-MacIntel', NULL, NULL, '2025-09-02 17:12:45.544', '2025-09-02 17:12:45.555');


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- Data for Name: video_analytics; Type: TABLE DATA; Schema: public; Owner: sefaarslan
--



--
-- PostgreSQL database dump complete
--

