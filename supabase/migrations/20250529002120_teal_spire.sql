/*
  # Fix POI Types RLS Policy

  1. Changes
    - Drop existing INSERT policy for poi_types table
    - Create new INSERT policy with correct auth.uid() check
    
  2. Security
    - Ensures only authenticated users can insert new POI types
    - Maintains existing SELECT policy
*/

BEGIN;

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.poi_types;

-- Create new INSERT policy with correct auth check
CREATE POLICY "Enable insert for authenticated users only" 
ON public.poi_types
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

COMMIT;