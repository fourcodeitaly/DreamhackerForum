"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Shield, ShieldOff } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

export function AdminUsersList() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [dialogAction, setDialogAction] = useState<"promote" | "demote" | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { user: currentUser } = useAuth()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.username?.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data, error } = await supabase.from("users").select("*").order("name")

      if (error) {
        throw error
      }

      setUsers(data || [])
      setFilteredUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromoteToAdmin = (user: any) => {
    setSelectedUser(user)
    setDialogAction("promote")
    setIsDialogOpen(true)
  }

  const handleRemoveAdmin = (user: any) => {
    setSelectedUser(user)
    setDialogAction("demote")
    setIsDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedUser || !dialogAction) return

    setIsProcessing(true)
    try {
      const endpoint = dialogAction === "promote" ? "/api/admin/set-admin" : "/api/admin/remove-admin"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUser.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user role")
      }

      // Update local state
      setUsers(
        users.map((user) => {
          if (user.id === selectedUser.id) {
            return {
              ...user,
              role: dialogAction === "promote" ? "admin" : "user",
            }
          }
          return user
        }),
      )

      toast({
        title: "Success",
        description: data.message || `User ${dialogAction === "promote" ? "promoted to admin" : "demoted from admin"}`,
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setIsDialogOpen(false)
      setSelectedUser(null)
      setDialogAction(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={fetchUsers} variant="outline">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge variant="default" className="bg-amber-600">
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(user.joined_at || user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {user.role === "admin" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAdmin(user)}
                          disabled={user.id === currentUser?.id}
                          title={
                            user.id === currentUser?.id ? "Cannot remove your own admin role" : "Remove admin role"
                          }
                        >
                          <ShieldOff className="h-4 w-4 mr-2" />
                          Remove Admin
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handlePromoteToAdmin(user)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogAction === "promote" ? "Promote to Admin" : "Remove Admin Role"}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogAction === "promote"
                ? `Are you sure you want to give admin privileges to ${selectedUser?.name}? This will grant them full access to manage the forum.`
                : `Are you sure you want to remove admin privileges from ${selectedUser?.name}? They will no longer have access to admin features.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : dialogAction === "promote" ? (
                "Promote"
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
