/*
  # Create POI Types table

  1. New Tables
    - `poi_types`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `color` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `poi_types` table
    - Add policies for:
      - Select: Allow authenticated users to read all POI types
      - Insert: Allow authenticated users to create POI types
*/

-- Create the poi_types table
CREATE TABLE IF NOT EXISTS poi_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE poi_types ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read poi_types"
  ON poi_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to create poi_types"
  ON poi_types
  FOR INSERT
  TO authenticated
  WITH CHECK (true);