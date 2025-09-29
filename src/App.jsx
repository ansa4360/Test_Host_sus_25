import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { CheckCircle2, Circle, Trophy, Users, Leaf, MapPin, BookOpen, Lightbulb } from 'lucide-react'
import { sustainabilityBingoItems, learningBingoItems } from './enhanced-bingo-items.js'
import './App.css'

function App() {
  const [sustainabilityItems, setSustainabilityItems] = useState(() => {
    const saved = localStorage.getItem('sustainability-bingo-items')
    return saved ? JSON.parse(saved) : sustainabilityBingoItems
  })
  
  const [learningItems, setLearningItems] = useState(() => {
    const saved = localStorage.getItem('learning-bingo-items')
    return saved ? JSON.parse(saved) : learningBingoItems
  })
  
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('sustainability-bingo-player') || ''
  })
  
  const [showNameInput, setShowNameInput] = useState(!playerName)
  const [activeTab, setActiveTab] = useState('sustainability')

  useEffect(() => {
    localStorage.setItem('sustainability-bingo-items', JSON.stringify(sustainabilityItems))
  }, [sustainabilityItems])

  useEffect(() => {
    localStorage.setItem('learning-bingo-items', JSON.stringify(learningItems))
  }, [learningItems])

  useEffect(() => {
    if (playerName) {
      localStorage.setItem('sustainability-bingo-player', playerName)
    }
  }, [playerName])

  const toggleSustainabilityItem = (id) => {
    setSustainabilityItems(items => items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const toggleLearningItem = (id) => {
    setLearningItems(items => items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const checkBingo = (items) => {
    const grid = []
    for (let i = 0; i < 5; i++) {
      grid.push(items.slice(i * 5, (i + 1) * 5))
    }

    let bingos = 0

    // Check rows
    for (let i = 0; i < 5; i++) {
      if (grid[i].every(item => item.completed)) bingos++
    }

    // Check columns
    for (let j = 0; j < 5; j++) {
      if (grid.every(row => row[j].completed)) bingos++
    }

    // Check diagonals
    if (grid.every((row, i) => row[i].completed)) bingos++
    if (grid.every((row, i) => row[4 - i].completed)) bingos++

    return bingos
  }

  const sustainabilityCompletedCount = sustainabilityItems.filter(item => item.completed).length
  const learningCompletedCount = learningItems.filter(item => item.completed).length
  const sustainabilityProgressPercentage = (sustainabilityCompletedCount / sustainabilityItems.length) * 100
  const learningProgressPercentage = (learningCompletedCount / learningItems.length) * 100
  const sustainabilityBingoCount = checkBingo(sustainabilityItems)
  const learningBingoCount = checkBingo(learningItems)

  const resetGames = () => {
    setSustainabilityItems(sustainabilityBingoItems)
    setLearningItems(learningBingoItems)
    localStorage.removeItem('sustainability-bingo-items')
    localStorage.removeItem('learning-bingo-items')
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (playerName.trim()) {
      setShowNameInput(false)
    }
  }

  const BingoGrid = ({ items, onToggle, type }) => (
    <div className="grid grid-cols-5 gap-2 mb-8 max-w-4xl mx-auto">
      {items.map((item, index) => (
        <Card 
          key={item.id}
          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
            item.completed 
              ? type === 'sustainability' 
                ? 'bg-green-100 border-green-300 shadow-lg' 
                : 'bg-blue-100 border-blue-300 shadow-lg'
              : 'bg-white hover:bg-gray-50'
          } ${item.id === 13 ? 'bg-yellow-100 border-yellow-300' : ''}`}
          onClick={() => item.id !== 13 && onToggle(item.id)}
        >
          <CardContent className="p-3 h-32 flex flex-col justify-between">
            <div className="text-xs text-center leading-tight">
              {item.text}
            </div>
            <div className="flex justify-center mt-2">
              {item.completed ? (
                <CheckCircle2 className={`h-6 w-6 ${type === 'sustainability' ? 'text-green-600' : 'text-blue-600'}`} />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Leaf className="h-12 w-12 text-green-600" />
                <BookOpen className="h-6 w-6 text-blue-600 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to IEPEC 2025 Bingo!</CardTitle>
            <CardDescription>
              Two interactive games to enhance your conference experience in Denver
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Enter your name to get started:
                </label>
                <input
                  id="name"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Start Playing
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              IEPEC 2025 Bingo Games
            </h1>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Grand Hyatt Denver • October 6-8, 2025</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Player: {playerName}</span>
            </div>
          </div>
        </div>

        {/* Tabs for Two Games */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sustainability" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Sustainability Travel
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Conference Learning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sustainability">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Leaf className="h-5 w-5" />
                  Sustainability Travel Bingo
                </CardTitle>
                <CardDescription>
                  Make your conference travel more sustainable with these eco-friendly actions around Denver and the Grand Hyatt.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <p className="text-2xl font-bold text-green-600">{sustainabilityCompletedCount}/25</p>
                    <p className="text-sm text-gray-600">Actions Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{sustainabilityBingoCount}</p>
                    <p className="text-sm text-gray-600">Bingo Lines</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(sustainabilityProgressPercentage)}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                </div>
                <Progress value={sustainabilityProgressPercentage} className="h-3 mb-4" />
                
                {sustainabilityBingoCount > 0 && (
                  <div className="flex items-center justify-center gap-2 text-yellow-600">
                    <Trophy className="h-5 w-5" />
                    <span className="font-semibold">
                      {sustainabilityBingoCount === 1 ? "You got BINGO!" : `You got ${sustainabilityBingoCount} BINGO lines!`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <BingoGrid 
              items={sustainabilityItems} 
              onToggle={toggleSustainabilityItem} 
              type="sustainability"
            />
          </TabsContent>

          <TabsContent value="learning">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Lightbulb className="h-5 w-5" />
                  Conference Learning Bingo
                </CardTitle>
                <CardDescription>
                  Explore new concepts and methodologies from IEPEC 2025 presentations and posters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <p className="text-2xl font-bold text-blue-600">{learningCompletedCount}/25</p>
                    <p className="text-sm text-gray-600">Concepts Learned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{learningBingoCount}</p>
                    <p className="text-sm text-gray-600">Bingo Lines</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{Math.round(learningProgressPercentage)}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                </div>
                <Progress value={learningProgressPercentage} className="h-3 mb-4" />
                
                {learningBingoCount > 0 && (
                  <div className="flex items-center justify-center gap-2 text-yellow-600">
                    <Trophy className="h-5 w-5" />
                    <span className="font-semibold">
                      {learningBingoCount === 1 ? "You got BINGO!" : `You got ${learningBingoCount} BINGO lines!`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <BingoGrid 
              items={learningItems} 
              onToggle={toggleLearningItem} 
              type="learning"
            />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={resetGames}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Reset Both Games
          </Button>
          <Button 
            onClick={() => setShowNameInput(true)}
            variant="outline"
          >
            Change Player
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Enhance your IEPEC 2025 experience with sustainable actions and continuous learning! 🌱📚</p>
          <p className="mt-2">International Energy Program Evaluation Conference • Denver, Colorado</p>
        </div>
      </div>
    </div>
  )
}

export default App
