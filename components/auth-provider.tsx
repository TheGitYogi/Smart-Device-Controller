"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
  updateProfile,
  type Auth,
} from "firebase/auth"
import { getDatabase, type Database, ref, set } from "firebase/database"
import { firebaseConfig } from "@/lib/firebase"

// User settings interface
export interface UserSettings {
  currency: string
  temperatureUnit: string
  theme: string
  notifications: boolean
  language: string
  autoConnect: boolean
  automations: Automation[]
  devices: Device[]
}

export interface Automation {
  id: string
  name: string
  condition: {
    type: string
    value: number
  }
  action: {
    type: string
    value: number | boolean
  }
  enabled: boolean
}

export interface Device {
  id: string
  name: string
  type: string
  location: string
  connected: boolean
  lastConnected?: Date
}

// Default user settings
export const defaultSettings: UserSettings = {
  currency: "USD",
  temperatureUnit: "C",
  theme: "dark",
  notifications: true,
  language: "en",
  autoConnect: true,
  automations: [],
  devices: [
    {
      id: "fan-001",
      name: "Living Room Fan",
      type: "ceiling",
      location: "Living Room",
      connected: true,
    },
  ],
}

// Auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  userSettings: UserSettings
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  userSettings: defaultSettings,
  updateUserSettings: async () => {},
})

// Initialize Firebase (with error handling)
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Database | undefined

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getDatabase(app)
} catch (error) {
  console.error("Firebase initialization error:", error)
}

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings)

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setError(new Error("Firebase Auth not initialized"))
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
      },
      (error) => {
        setError(error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      if (!auth) throw new Error("Auth not initialized")
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    setError(null)

    try {
      if (!auth) throw new Error("Auth not initialized")
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Set display name
      await updateProfile(result.user, { displayName })

      // Create user document with default settings
      await set(ref(db, `users/${result.user.uid}/settings`), defaultSettings)
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!auth) throw new Error("Auth not initialized")
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, "users", result.user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), defaultSettings)
      }
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const logout = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!auth) throw new Error("Auth not initialized")
      await signOut(auth)
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update user settings
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!user || !db) return

    try {
      const newSettings = { ...userSettings, ...settings }
      setUserSettings(newSettings)

      // Update Realtime Database
      await set(ref(db, `users/${user.uid}/settings`), newSettings)
    } catch (err) {
      console.error("Error updating user settings:", err)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        userSettings,
        updateUserSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}
