import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import { Key} from 'lucide-react'
import { CardsExplain as CardsExplain } from './cardsExplain'
import { Link } from 'react-router-dom'

export default function Intro() {
    const gif='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWllaW54bjBkNmp6b2YxeG90b2dxMG9wejY1Mjh3N3hiY3RpeHgzaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/WoWm8YzFQJg5i/giphy.gif'
  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full h-screen relative">
        <div
          className="absolute inset-0 dark:brightness-[1] dark:grayscale"
          style={{
            backgroundImage: `url(${gif})`,
            backgroundSize: "100%",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <Card className="bg-[rgba(255,255,255,0.5)] backdrop-blur-sm border shadow-2xl rounded-3xl max-w-3xl mx-auto text-center">
            <CardHeader>
            <h1 
        className="text-6xl font-semibold font-mono text-background">CiteGeist</h1>
            </CardHeader>
            <CardContent className="text-background">
              Discover CiteGeist: Your gateway to smarter research recommendations, tailored insights, and seamless exploration.
            </CardContent>
            <CardFooter className="justify-center">
              <Button asChild>
                <Link to="/signup"><Key className="mr-2" />Sign up</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="w-full py-16 px-4">
        <CardsExplain/>
      </div>
    </div>
  )
}