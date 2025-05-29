/*
  # Fix POI Types RLS Policies

  1. Changes
    - Add RLS policy to allow authenticated users to insert new POI types
    
  2. Security
    - Ensures authenticated users can create new POI types
    - Maintains existing read permissions
*/

-- Add policy to allow authenticated users to insert new POI types
CREATE POLICY "Enable insert for authenticated users only" 
ON public.poi_types
FOR INSERT 
TO authenticated
WITH CHECK (true);