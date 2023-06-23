create TABLE members (
    user_id serial PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    phone_number varchar(20),
    oauth_provider varchar(20),
    oauth_id varchar(255),
    created_at timestamp with time zone DEFAULT current_timestamp,
    updated_at timestamp with time zone DEFAULT current_timestamp
);
create TABLE transactions (
    transaction_id serial PRIMARY KEY,
    seller_id integer REFERENCES members(user_id),
    buyer_id integer REFERENCES members(user_id),
    product_id integer,
    transaction_date timestamp with time zone DEFAULT current_timestamp,
    price numeric
);
create TABLE products (
    product_id serial PRIMARY KEY,
    user_id integer REFERENCES members(user_id),
    title varchar(255) NOT NULL,
    description text,
    price numeric NOT NULL,
    status varchar(20) DEFAULT '판매중',
    created_at timestamp with time zone DEFAULT current_timestamp,
    updated_at timestamp with time zone DEFAULT current_timestamp
);

select * from transactions
