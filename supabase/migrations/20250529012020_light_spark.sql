-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read poi_types" ON public.poi_types;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.poi_types;

-- Create new policies that allow public access
CREATE POLICY "Allow public read access"
ON public.poi_types
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert access"
ON public.poi_types
FOR INSERT
WITH CHECK (true);