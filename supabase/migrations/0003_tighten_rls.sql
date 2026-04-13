-- Tighten RLS policies: restrict sensitive data to authorized users only
-- Safe to re-run: drops existing permissive policies first

-- =========================================================================
-- classes: authenticated users can read (needed for invite code join flow)
-- This table only has class metadata, not student data — acceptable risk
-- =========================================================================
-- (Keep existing "Anyone can read classes" or replace with auth-only)
DROP POLICY IF EXISTS "Anyone can read classes" ON classes;
CREATE POLICY "Authenticated users can read classes" ON classes
  FOR SELECT TO authenticated USING (true);

-- =========================================================================
-- class_members: only the teacher of the class + the student themselves
-- =========================================================================
DROP POLICY IF EXISTS "Anyone can read class members" ON class_members;
CREATE POLICY "Class members visible to teacher and self" ON class_members
  FOR SELECT USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_members.class_id
      AND classes.teacher_id = auth.uid()
    )
  );

-- =========================================================================
-- student_questions: only the student who asked + the class teacher
-- =========================================================================
DROP POLICY IF EXISTS "Anyone can read questions" ON student_questions;
CREATE POLICY "Questions visible to student and teacher" ON student_questions
  FOR SELECT USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = student_questions.class_id
      AND classes.teacher_id = auth.uid()
    )
  );
