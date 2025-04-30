import { getUserFromSession } from "@/lib/auth-utils"

export async function ServerAuthCheck() {
  const user = await getUserFromSession()

  return (
    <div className="hidden">
      {/* This component doesn't render anything visible, but makes auth data available */}
      <script
        id="auth-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            isAuthenticated: !!user,
            isAdmin: user?.role === "admin",
            userId: user?.id || null,
            username: user?.username || null,
          }),
        }}
      />
    </div>
  )
}
