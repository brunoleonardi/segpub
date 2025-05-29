/*
  # Fix POI Types RLS Policy

  1. Changes
    - Drop existing INSERT policy for poi_types table
    - Create new INSERT policy with correct auth.uid() function
  
  2. Security
    - Updates RLS policy to use correct auth.uid() function
    - Maintains existing security model but fixes the function reference
*/

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."poi_types";

CREATE POLICY "Enable insert for authenticated users only"
ON "public"."poi_types"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);