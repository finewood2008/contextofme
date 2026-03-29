import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    const { slice_id, text } = await req.json()

    if (!slice_id || !text) {
      throw new Error('Missing slice_id or text')
    }

    // Get user's X platform credentials
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('x_api_key, x_api_secret, x_access_token, x_access_secret')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Failed to load profile')
    }

    if (!profile.x_api_key || !profile.x_api_secret || !profile.x_access_token || !profile.x_access_secret) {
      throw new Error('X platform credentials not configured')
    }

    // Post to X using Twitter API v2
    const oauth = {
      consumer_key: profile.x_api_key,
      consumer_secret: profile.x_api_secret,
      token: profile.x_access_token,
      token_secret: profile.x_access_secret,
    }

    // Generate OAuth 1.0a signature
    const method = 'POST'
    const url = 'https://api.twitter.com/2/tweets'
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const nonce = crypto.randomUUID().replace(/-/g, '')

    const params = {
      oauth_consumer_key: oauth.consumer_key,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: oauth.token,
      oauth_version: '1.0',
    }

    const paramString = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`
    const signingKey = `${encodeURIComponent(oauth.consumer_secret)}&${encodeURIComponent(oauth.token_secret)}`

    const encoder = new TextEncoder()
    const keyData = encoder.encode(signingKey)
    const messageData = encoder.encode(signatureBase)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))

    const authHeader = `OAuth ${Object.entries({
      ...params,
      oauth_signature: signatureBase64,
    })
      .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
      .join(', ')}`

    // Post tweet
    const tweetResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text.slice(0, 280) }), // Twitter character limit
    })

    if (!tweetResponse.ok) {
      const errorData = await tweetResponse.json()
      throw new Error(`Twitter API error: ${JSON.stringify(errorData)}`)
    }

    const tweetData = await tweetResponse.json()
    const tweetId = tweetData.data?.id
    const tweetUrl = tweetId ? `https://twitter.com/i/web/status/${tweetId}` : null

    // Record the post
    const { error: insertError } = await supabaseClient
      .from('x_posts')
      .insert({
        user_id: user.id,
        slice_id: slice_id,
        tweet_id: tweetId,
        tweet_url: tweetUrl,
        status: 'posted',
        posted_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Failed to record post:', insertError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        tweet_id: tweetId,
        tweet_url: tweetUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
