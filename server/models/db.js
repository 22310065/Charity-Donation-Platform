const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bvxpzmurqomysbibemov.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2eHB6bXVycW9teXNiaWJlbW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjE2MTgsImV4cCI6MjA5NDc5NzYxOH0.qdi-QxtmO9NnrR7kRbKl-NQc-Gh43GverG0Uk6xlwlE'
);

module.exports = supabase;