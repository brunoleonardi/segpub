/*
  # Fix POI Types RLS Policies

  1. Changes
    - Remove duplicate INSERT policies
    - Update RLS policies to properly handle authenticated users
    
  2. Security
    - Maintains RLS enabled on poi_types table
    - Consolidates INSERT permissions into a single clear policy
    - Ensures authenticated users can create POI types
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow authenticated users to create poi_types" ON public.poi_types;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.poi_types;

-- Create a single, clear INSERT policy
CREATE POLICY "Enable insert for authenticated users only"
ON public.poi_types
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Keep existing SELECT policy
-- Note: Not dropping/recreating since it's correctly configured