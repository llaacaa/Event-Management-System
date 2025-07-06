--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-07-06 15:00:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 863 (class 1247 OID 32776)
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status_enum AS ENUM (
    'ACTIVE',
    'NOT_ACTIVE'
);


ALTER TYPE public.user_status_enum OWNER TO postgres;

--
-- TOC entry 860 (class 1247 OID 32770)
-- Name: user_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_type_enum AS ENUM (
    'EVENT_CREATOR',
    'ADMIN',
    'USER'
);


ALTER TYPE public.user_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 32788)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    description character varying(500) NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 40983)
-- Name: comment_reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment_reactions (
    id integer NOT NULL,
    comment_id integer NOT NULL,
    visitor_id text NOT NULL,
    reaction_type text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comment_reactions_reaction_type_check CHECK ((reaction_type = ANY (ARRAY['like'::text, 'dislike'::text])))
);


ALTER TABLE public.comment_reactions OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 40982)
-- Name: comment_reactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_reactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_reactions_id_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 228
-- Name: comment_reactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_reactions_id_seq OWNED BY public.comment_reactions.id;


--
-- TOC entry 225 (class 1259 OID 32899)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    author_name character varying(100) NOT NULL,
    comment_text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_id integer NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    dislikes integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 32898)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 224
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 231 (class 1259 OID 41002)
-- Name: event_reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_reactions (
    id integer NOT NULL,
    event_id integer NOT NULL,
    visitor_id text NOT NULL,
    reaction_type text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT event_reactions_reaction_type_check CHECK ((reaction_type = ANY (ARRAY['like'::text, 'dislike'::text, 'view'::text])))
);


ALTER TABLE public.event_reactions OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 41001)
-- Name: event_reactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_reactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_reactions_id_seq OWNER TO postgres;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 230
-- Name: event_reactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_reactions_id_seq OWNED BY public.event_reactions.id;


--
-- TOC entry 223 (class 1259 OID 32883)
-- Name: event_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tags (
    event_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.event_tags OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 32854)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_date timestamp without time zone NOT NULL,
    location character varying(255) NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    author_email character varying(255),
    category_name character varying(50) NOT NULL,
    max_capacity integer,
    like_count integer DEFAULT 0 NOT NULL,
    dislike_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32853)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 219
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 227 (class 1259 OID 32916)
-- Name: rsvps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rsvps (
    id integer NOT NULL,
    event_id integer NOT NULL,
    rsvp_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_name text NOT NULL
);


ALTER TABLE public.rsvps OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 32915)
-- Name: rsvps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rsvps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rsvps_id_seq OWNER TO postgres;

--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 226
-- Name: rsvps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rsvps_id_seq OWNED BY public.rsvps.id;


--
-- TOC entry 222 (class 1259 OID 32875)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32874)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 221
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 217 (class 1259 OID 32781)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    email character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    user_type public.user_type_enum NOT NULL,
    status public.user_status_enum NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4797 (class 2604 OID 40986)
-- Name: comment_reactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_reactions ALTER COLUMN id SET DEFAULT nextval('public.comment_reactions_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 32902)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 41005)
-- Name: event_reactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reactions ALTER COLUMN id SET DEFAULT nextval('public.event_reactions_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 32857)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 32919)
-- Name: rsvps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rsvps ALTER COLUMN id SET DEFAULT nextval('public.rsvps_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 32878)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 4984 (class 0 OID 32788)
-- Dependencies: 218
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (description, name) FROM stdin;
Lacke jak	Lacke1
Lacke jak	Lacke2
Lacke jak	Lacke3
Lacke jak	Lacke4
Lacke jak	Lacke5
Lacke jak	Lacke6
Lacke jak	Lacke7
Lacke jak	Lacke8
Lacke jak	Lacke9
Lacke jak	Lacke10
Lacke jak	Lacke11
Opis mnog jak	Novi Dogadjaj
\.


--
-- TOC entry 4995 (class 0 OID 40983)
-- Dependencies: 229
-- Data for Name: comment_reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment_reactions (id, comment_id, visitor_id, reaction_type, created_at) FROM stdin;
\.


--
-- TOC entry 4991 (class 0 OID 32899)
-- Dependencies: 225
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, author_name, comment_text, created_at, event_id, likes, dislikes) FROM stdin;
\.


--
-- TOC entry 4997 (class 0 OID 41002)
-- Dependencies: 231
-- Data for Name: event_reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_reactions (id, event_id, visitor_id, reaction_type, created_at) FROM stdin;
\.


--
-- TOC entry 4989 (class 0 OID 32883)
-- Dependencies: 223
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_tags (event_id, tag_id) FROM stdin;
10	4
10	5
10	6
11	4
11	7
11	6
11	8
13	9
13	10
\.


--
-- TOC entry 4986 (class 0 OID 32854)
-- Dependencies: 220
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, created_at, event_date, location, views, author_email, category_name, max_capacity, like_count, dislike_count) FROM stdin;
2	New Event neverica lorem updated	Izmenjen ovaj mnogo jak event jer ide jak gas jos jedan	2025-06-14 15:50:23.200483	2025-05-05 00:00:00	Pancevo	0	admin@gmail.com	Lacke1	5000	0	0
10	New Event neverica lorem	New event that lorem ipsum opala malena lorem ipsum	2025-06-15 01:53:57.119479	2025-11-11 00:00:00	Nova Pazova	0	lacke123@gmail.com	Lacke1	\N	0	0
11	Jel ce da radi	New event that lorem ipsum opala malena lorem ipsum	2025-06-15 02:22:14.736968	2025-11-11 00:00:00	Nova Pazova	0	lacke123@gmail.com	Lacke1	\N	0	0
13	Pumpanje	Jako pumpanje	2025-07-05 16:22:08.778664	2025-05-07 00:00:00	Pancevo	0	admin@gmail.com	Novi Dogadjaj	\N	0	0
\.


--
-- TOC entry 4993 (class 0 OID 32916)
-- Dependencies: 227
-- Data for Name: rsvps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rsvps (id, event_id, rsvp_date, user_name) FROM stdin;
\.


--
-- TOC entry 4988 (class 0 OID 32875)
-- Dependencies: 222
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name) FROM stdin;
4	Metal
5	Rock
6	HIPHIP
7	Country
8	Rap
9	PUMPAJ
10	BLOKADE
\.


--
-- TOC entry 4983 (class 0 OID 32781)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (email, name, last_name, user_type, status, password) FROM stdin;
admin@gmail.com	admin	admin	ADMIN	ACTIVE	$2b$10$9vU7wpNBmrE80ZYFVD5SFOgSl.w2HWGqrN0Qcvd45KnN7QjnOubOm
lacke123@gmail.com	LackeNovi	Kojic	EVENT_CREATOR	ACTIVE	$2b$10$yUiHavOppBThPaC0fj75S.gTyG7HuyuI/OoSJdxnZCSlAFm3os6CO
lackeNovi@gmail.com	LazaNovi123	Luda	EVENT_CREATOR	ACTIVE	$2b$10$J.WBMJWVwFrL5HkCE0BZZOV0IwWv5R0mSJrwt7KFmqbuonYbArWB.
\.


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 228
-- Name: comment_reactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_reactions_id_seq', 1, false);


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 224
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 230
-- Name: event_reactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_reactions_id_seq', 1, false);


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 219
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 13, true);


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 226
-- Name: rsvps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rsvps_id_seq', 1, false);


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 221
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 10, true);


--
-- TOC entry 4806 (class 2606 OID 32852)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (name);


--
-- TOC entry 4820 (class 2606 OID 40994)
-- Name: comment_reactions comment_reactions_comment_id_visitor_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_reactions
    ADD CONSTRAINT comment_reactions_comment_id_visitor_id_key UNIQUE (comment_id, visitor_id);


--
-- TOC entry 4822 (class 2606 OID 40992)
-- Name: comment_reactions comment_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_reactions
    ADD CONSTRAINT comment_reactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4816 (class 2606 OID 32909)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4824 (class 2606 OID 41013)
-- Name: event_reactions event_reactions_event_id_visitor_id_reaction_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reactions
    ADD CONSTRAINT event_reactions_event_id_visitor_id_reaction_type_key UNIQUE (event_id, visitor_id, reaction_type);


--
-- TOC entry 4826 (class 2606 OID 41011)
-- Name: event_reactions event_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reactions
    ADD CONSTRAINT event_reactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 32887)
-- Name: event_tags event_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (event_id, tag_id);


--
-- TOC entry 4808 (class 2606 OID 32863)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 32922)
-- Name: rsvps rsvps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 32882)
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- TOC entry 4812 (class 2606 OID 32880)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4804 (class 2606 OID 32787)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- TOC entry 4834 (class 2606 OID 40995)
-- Name: comment_reactions comment_reactions_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_reactions
    ADD CONSTRAINT comment_reactions_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- TOC entry 4831 (class 2606 OID 32910)
-- Name: comments comments_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4836 (class 2606 OID 41014)
-- Name: event_reactions event_reactions_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reactions
    ADD CONSTRAINT event_reactions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4829 (class 2606 OID 32888)
-- Name: event_tags event_tags_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4830 (class 2606 OID 32893)
-- Name: event_tags event_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 32864)
-- Name: events events_author_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_author_email_fkey FOREIGN KEY (author_email) REFERENCES public.users(email);


--
-- TOC entry 4828 (class 2606 OID 32869)
-- Name: events events_category_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_category_name_fkey FOREIGN KEY (category_name) REFERENCES public.categories(name);


--
-- TOC entry 4835 (class 2606 OID 49162)
-- Name: comment_reactions fk_comment_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment_reactions
    ADD CONSTRAINT fk_comment_id FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE;


--
-- TOC entry 4832 (class 2606 OID 49152)
-- Name: comments fk_event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 49157)
-- Name: event_reactions fk_event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_reactions
    ADD CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4833 (class 2606 OID 32928)
-- Name: rsvps rsvps_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


-- Completed on 2025-07-06 15:00:17

--
-- PostgreSQL database dump complete
--

