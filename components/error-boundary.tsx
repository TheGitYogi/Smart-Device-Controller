"use client"

import React from 'react'
import { Button } from "@/components/ui/button"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-4 bg-red-900/20 backdrop-blur-md rounded-lg border border-red-900/40">
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-red-300/70 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 