'use client'

import { Card,CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const MessageCard = () => {
  return (
    <div>
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
    </Card>
    </div>
  )
}

export default MessageCard
