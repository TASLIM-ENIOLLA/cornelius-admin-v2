/** @type {import('next').NextConfig} */

module.exports = {
	env: {
		SUPABASE_URL: "https://vslytjgoeaftadapdtye.supabase.co",
		SUPABASE_PROJEECT_NAME: "Cornelius Store",
		SUPABASE_PASSWORD: "$CorneliusStore2023",
		SUPABASE_API_KEY_PUBLIC: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbHl0amdvZWFmdGFkYXBkdHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1Njc2MDQsImV4cCI6MjAxNjE0MzYwNH0.4KSHPde1M68fHOML9SKlTIZBb5f1pdH0zH-Jfq_iG8A",
		SUPABASE_API_KEY_SECRET_ROLE: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbHl0amdvZWFmdGFkYXBkdHllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDU2NzYwNCwiZXhwIjoyMDE2MTQzNjA0fQ.M4vqNlia1KWTDWS0--uXOEZ6VL4IIATF3V30RLHK3a8",
		JWT_SECRET: "bc9e98d35548180d4470115a5e027ad66b05030847f9d1979370ea387b535e05",
	},
	images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kwhfmk0ynn0m23pt.public.blob.vercel-storage.com",
        port: '',
      },
    ],
  },
}