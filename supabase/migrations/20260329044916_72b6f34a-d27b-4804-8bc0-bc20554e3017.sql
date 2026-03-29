DROP POLICY "Service role can insert logs" ON public.api_logs;
CREATE POLICY "Service role inserts logs"
  ON public.api_logs FOR INSERT
  TO service_role
  WITH CHECK (true);