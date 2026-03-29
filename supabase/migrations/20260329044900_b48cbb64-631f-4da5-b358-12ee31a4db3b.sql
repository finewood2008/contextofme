CREATE TABLE public.api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_api_logs_user_id ON public.api_logs (user_id);
CREATE INDEX idx_api_logs_created_at ON public.api_logs (created_at);

ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own api logs"
  ON public.api_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert logs"
  ON public.api_logs FOR INSERT
  WITH CHECK (true);