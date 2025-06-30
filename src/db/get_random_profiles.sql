create or replace function get_random_profiles()
returns setof linkedin_profiles as $$
    select * from linkedin_profiles order by random() limit 2;
$$ language sql;