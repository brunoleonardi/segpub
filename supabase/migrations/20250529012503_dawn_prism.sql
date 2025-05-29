/*
  # Add POIs table with foreign key and RLS policies

  1. New Tables
    - `pois`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type_id` (uuid, foreign key to poi_types.id)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `pois` table
    - Add policies for:
      - Public read access
      - Public insert access
      - Foreign key constraint to poi_types table
*/

-- Create the pois table
CREATE TABLE IF NOT EXISTS pois (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type_id uuid NOT NULL REFERENCES poi_types(id),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON pois
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON pois
  FOR INSERT
  TO public
  WITH CHECK (true);