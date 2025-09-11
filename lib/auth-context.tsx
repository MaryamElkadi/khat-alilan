"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "REGISTER_FAILURE" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return { ...state, isLoading: true }

    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      }

    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }

    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }

    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  })

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("khat-al-ilan-user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } catch (error) {
        localStorage.removeItem("khat-al-ilan-user")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would be an API call
    if (email && password.length >= 6) {
      const user: User = {
        id: "user-" + Date.now(),
        name: "أحمد محمد",
        email: email,
        phone: "+966501234567",
      }

      localStorage.setItem("khat-al-ilan-user", JSON.stringify(user))
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
      return true
    } else {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    dispatch({ type: "REGISTER_START" })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock registration - in real app, this would be an API call
    if (name && email && password.length >= 6) {
      const user: User = {
        id: "user-" + Date.now(),
        name: name,
        email: email,
        phone: phone,
      }

      localStorage.setItem("khat-al-ilan-user", JSON.stringify(user))
      dispatch({ type: "REGISTER_SUCCESS", payload: user })
      return true
    } else {
      dispatch({ type: "REGISTER_FAILURE" })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("khat-al-ilan-user")
    dispatch({ type: "LOGOUT" })
  }

  const updateProfile = (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates }
      localStorage.setItem("khat-al-ilan-user", JSON.stringify(updatedUser))
      dispatch({ type: "UPDATE_PROFILE", payload: updates })
    }
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
