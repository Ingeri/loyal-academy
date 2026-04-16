'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function ProtectedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto py-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome to Loyal Academy</CardTitle>
            <CardDescription>You are now authenticated and ready to learn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-slate-600">
              You have successfully logged in to your Loyal Academy account. Access all your learning materials, track your progress, and enroll in new courses.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard" className="w-full">
                <Button className="w-full" size="lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses" className="w-full">
                <Button variant="outline" className="w-full" size="lg">
                  Browse Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
