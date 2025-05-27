-- Creating table for schools
ALTER TABLE schools 
    ADD COLUMN cd_name VARCHAR(50),
    ADD COLUMN logo VARCHAR(255),
    ADD COLUMN location VARCHAR(255),
    ADD COLUMN founded INTEGER,
    ADD COLUMN type VARCHAR(50),
    ADD COLUMN qs_world_rank INTEGER,
    ADD COLUMN us_news_rank_world INTEGER,
    ADD COLUMN total_students INTEGER,
    ADD COLUMN acceptance_rate DECIMAL(5,2),
    ADD COLUMN average_gpa DECIMAL(3,1),
    ADD COLUMN average_gre INTEGER,
    ADD COLUMN average_toefl INTEGER,
    ADD COLUMN number_of_applications INTEGER,
    ADD COLUMN number_of_admissions INTEGER,
    ADD COLUMN tuition_in_state INTEGER,
    ADD COLUMN tuition_out_state INTEGER,
    ADD COLUMN tuition_international INTEGER,
    ADD COLUMN description TEXT,
    ADD COLUMN website VARCHAR(255)

-- Creating table for popular majors
CREATE TABLE popular_majors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    major VARCHAR(100) NOT NULL
);

-- Creating table for campus life housing options
CREATE TABLE housing_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    housing_option VARCHAR(100) NOT NULL
);

-- Creating table for campus life
CREATE TABLE campus_life (
    school_id UUID PRIMARY KEY REFERENCES schools(id),
    student_clubs INTEGER,
    sports_teams INTEGER
);

-- Creating table for admission requirements
CREATE TABLE admission_requirements (
    school_id UUID PRIMARY KEY REFERENCES schools(id),
    gpa DECIMAL(3,1),
    gre INTEGER,
    toefl INTEGER
);

-- Creating table for departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id),
    name VARCHAR(255) NOT NULL,
    law_school_rank_us INTEGER,
    business_school_rank_us INTEGER,
    medicine_school_rank_us INTEGER,
    engineer_school_rank_us INTEGER,
    number_of_applications INTEGER,
    number_of_admissions INTEGER,
    description TEXT
);

-- Creating table for department admission requirements
CREATE TABLE department_admission_requirements (
    department_id UUID PRIMARY KEY REFERENCES departments(id),
    gpa DECIMAL(3,1),
    gre INTEGER,
    toefl INTEGER
);

CREATE TABLE school_admission_requirements (
    school_id UUID PRIMARY KEY REFERENCES schools(id),
    gpa DECIMAL(3,1),
    gre INTEGER,
    toefl INTEGER
);

