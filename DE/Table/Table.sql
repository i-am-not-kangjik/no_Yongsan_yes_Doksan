CREATE TABLE "product" (
  "id" varchar(10) PRIMARY KEY,
  "product_name" varchar(50) NOT NULL,
  "release_year" int NOT NULL,
  "battery_capacity" float(10) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "phone" (
  "product_id" varchar(10) PRIMARY KEY,
  "screen_size" float(10) NOT NULL,
  "weight" float(10) NOT NULL,
  "ram" int NOT NULL,
  "back_camera_total" int NOT NULL,
  "max_video_playtime" int NOT NULL,
  "max_audio_playtime" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "watch" (
  "product_id" varchar(10) PRIMARY KEY,
  "internet_type" varchar(20) NOT NULL,
  "capacity" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "product_grade" (
  "grade_id" varchar(10) PRIMARY KEY,
  "product_id" varchar(10) NOT NULL,
  "grade" varchar(20) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "phone_capacity_cost" (
  "id" varchar(10) PRIMARY KEY,
  "product_id" varchar(10) NOT NULL,
  "capacity" varchar(10) NOT NULL,
  "cost" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "watch_cost" (
  "id" varchar(10) PRIMARY KEY,
  "product_id" varchar(10) NOT NULL,
  "screen_size" float(10) NOT NULL,
  "cost" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "crwaling_phone" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "grade_id" varchar(50) NOT NULL,
  "phone_cost_id" varchar(50) NOT NULL,
  "price" int NOT NULL,
  "favoritecount" int NOT NULL,
  "viewcount" int NOT NULL,
  "hours" varchar(50) NOT NULL,
  "crawling" int NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "crwaling_watch" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "grade_id" varchar(10) NOT NULL,
  "watch_cost_id" varchar(10) NOT NULL,
  "price" int NOT NULL,
  "favoritecount" int NOT NULL,
  "viewcount" int NOT NULL,
  "address" varchar(50) NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "phone_model_results" (
  "result_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "phone_crwaling_id" int NOT NULL,
  "model_result" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "watch_model_results" (
  "result_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "watch_crawling_id" int NOT NULL,
  "model_result" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "phone" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");

ALTER TABLE "watch" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");

ALTER TABLE "product_grade" ADD FOREIGN KEY ("product_id") REFERENCES "product" ("id");

ALTER TABLE "phone_capacity_cost" ADD FOREIGN KEY ("product_id") REFERENCES "phone" ("product_id");

ALTER TABLE "watch_cost" ADD FOREIGN KEY ("product_id") REFERENCES "watch" ("product_id");

ALTER TABLE "crwaling_phone" ADD FOREIGN KEY ("grade_id") REFERENCES "product_grade" ("grade_id");

ALTER TABLE "crwaling_phone" ADD FOREIGN KEY ("phone_cost_id") REFERENCES "phone_capacity_cost" ("id");

ALTER TABLE "crwaling_watch" ADD FOREIGN KEY ("grade_id") REFERENCES "product_grade" ("grade_id");

ALTER TABLE "crwaling_watch" ADD FOREIGN KEY ("watch_cost_id") REFERENCES "watch_cost" ("id");

ALTER TABLE "phone_model_results" ADD FOREIGN KEY ("phone_crwaling_id") REFERENCES "crwaling_phone" ("id");

ALTER TABLE "watch_model_results" ADD FOREIGN KEY ("watch_crawling_id") REFERENCES "crwaling_watch" ("id");


