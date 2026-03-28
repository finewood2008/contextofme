

# Add Manual Slice Input to Dashboard

## Overview
Add a text input area at the top of the Memory Vault section so users can submit new context slices directly from the UI. The input will call the existing `ingest` edge function (which handles AI purification) using the user's API token.

## Implementation

### 1. Create `src/components/dashboard/SliceInput.tsx`
A new component with:
- A monospace `<textarea>` styled with the Monolith glass-card aesthetic (1px #222 border, deep black bg)
- Character counter (max 5000)
- A `[ TRANSMIT ]` submit button
- Loading state with a pulsing indicator during AI processing
- On success: returns the new slice to the parent via callback, clears the input, shows a toast

The component calls the `ingest` edge function via `supabase.functions.invoke("ingest", ...)` with the user's `api_token` as the Bearer authorization header.

### 2. Update `src/pages/Dashboard.tsx`
- Import and render `<SliceInput>` between the "Public Gateway" section and the Memory Vault list
- Pass `profile.api_token` and an `onSliceCreated` callback
- The callback prepends the new slice to the `slices` state array so it appears instantly at the top

### Technical Details
- Reuses the existing `ingest` edge function — no backend changes needed
- The edge function already validates input, calls the AI gateway for purification, and inserts into `slices`
- Auth is via the user's `api_token` (Bearer token), matching the existing API flow
- Input validation: trim whitespace, enforce 1-5000 char limit client-side
- Section label: `TRANSMIT THOUGHT` in the same monospace uppercase tracking style

