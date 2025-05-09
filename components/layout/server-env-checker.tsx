import { checkConnection } from "@/lib/db/postgres"

export async function ServerEnvChecker() {
  const dbConnected = await checkConnection().catch(() => false)

  if (!dbConnected) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">Database Connection Warning</p>
        <p>
          Could not connect to the database. Some features may not work properly. If you're in development mode, mock
          data will be used where possible.
        </p>
      </div>
    )
  }

  return null
}
