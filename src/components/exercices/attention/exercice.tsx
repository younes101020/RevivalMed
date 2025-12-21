"use client"

import { useState, useCallback, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type Position = { row: number; col: number }
type Direction = "horizontal" | "vertical" | "diagonal" | "diagonal-reverse"

interface WordPlacement {
  word: string
  start: Position
  direction: Direction
  positions: Position[]
}

const WORDS = [
  "SARDAIGNE",
  "CORSE",
  "CUBA",
  "CHYPRE",
  "MAJORQUE",
  "CRÈTE",
  "BORNEO",
  "MALTE",
  "BALI",
  "SICILE",
  "JAVA",
  "GROENLAND",
  "ISLANDE",
];
const GRID_SIZE = 12

export function WordSearchExercice() {
  const [grid, setGrid] = useState<string[][]>([])
  const [wordPlacements, setWordPlacements] = useState<WordPlacement[]>([])
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [currentSelection, setCurrentSelection] = useState<Position[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const generateGrid = useCallback(() => {
    const newGrid: string[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(""))
    const placements: WordPlacement[] = []

    const canPlaceWord = (word: string, row: number, col: number, direction: Direction): boolean => {
      const positions: Position[] = []

      for (let i = 0; i < word.length; i++) {
        let newRow = row
        let newCol = col

        if (direction === "horizontal") newCol += i
        if (direction === "vertical") newRow += i
        if (direction === "diagonal") {
          newRow += i
          newCol += i
        }
        if (direction === "diagonal-reverse") {
          newRow += i
          newCol -= i
        }

        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
          return false
        }

        if (newGrid[newRow][newCol] !== "" && newGrid[newRow][newCol] !== word[i]) {
          return false
        }

        positions.push({ row: newRow, col: newCol })
      }

      positions.forEach((pos, i) => {
        newGrid[pos.row][pos.col] = word[i]
      })

      placements.push({
        word,
        start: { row, col },
        direction,
        positions,
      })

      return true
    }

    const directions: Direction[] = ["horizontal", "vertical", "diagonal", "diagonal-reverse"]

    for (const word of WORDS) {
      let placed = false
      let attempts = 0

      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const row = Math.floor(Math.random() * GRID_SIZE)
        const col = Math.floor(Math.random() * GRID_SIZE)

        placed = canPlaceWord(word, row, col, direction)
        attempts++
      }
    }

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === "") {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        }
      }
    }

    setGrid(newGrid)
    setWordPlacements(placements)
    setFoundWords(new Set())
    setSelectedCells(new Set())
    setCurrentSelection([])
    setIsComplete(false)
  }, [])

  useEffect(() => {
    generateGrid()
  }, [generateGrid])

  const positionKey = (pos: Position) => `${pos.row}-${pos.col}`

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true)
    setCurrentSelection([{ row, col }])
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDragging) return

    const lastPos = currentSelection[currentSelection.length - 1]
    if (!lastPos) return

    const rowDiff = row - lastPos.row
    const colDiff = col - lastPos.col

    if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) {
      if (!currentSelection.some((pos) => pos.row === row && pos.col === col)) {
        setCurrentSelection((prev) => [...prev, { row, col }])
      }
    }
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (currentSelection.length > 0) {
      const selectedWord = currentSelection.map((pos) => grid[pos.row][pos.col]).join("")

      for (const placement of wordPlacements) {
        if (foundWords.has(placement.word)) continue

        const forwardMatch =
          placement.positions.every((pos, i) => {
            return currentSelection[i] && currentSelection[i].row === pos.row && currentSelection[i].col === pos.col
          }) && placement.positions.length === currentSelection.length

        const backwardMatch =
          placement.positions.every((pos, i) => {
            const reverseIndex = currentSelection.length - 1 - i
            return (
              currentSelection[reverseIndex] &&
              currentSelection[reverseIndex].row === pos.row &&
              currentSelection[reverseIndex].col === pos.col
            )
          }) && placement.positions.length === currentSelection.length

        if (forwardMatch || backwardMatch) {
          const newFoundWords = new Set(foundWords)
          newFoundWords.add(placement.word)
          setFoundWords(newFoundWords)

          const newSelectedCells = new Set(selectedCells)
          placement.positions.forEach((pos) => {
            newSelectedCells.add(positionKey(pos))
          })
          setSelectedCells(newSelectedCells)

          if (newFoundWords.size === WORDS.length) {
            setIsComplete(true)
          }
          break
        }
      }
    }

    setCurrentSelection([])
  }

  const getCellStyle = (row: number, col: number) => {
    const key = positionKey({ row, col })
    const isSelected = selectedCells.has(key)
    const isCurrentlySelecting = currentSelection.some((pos) => pos.row === row && pos.col === col)

    return cn(
      "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-base font-semibold rounded-md transition-all duration-200 cursor-pointer select-none",
      "hover:scale-105 active:scale-95",
      isSelected && "bg-primary text-primary-foreground shadow-md",
      isCurrentlySelecting && !isSelected && "bg-accent text-accent-foreground scale-105",
      !isSelected && !isCurrentlySelecting && "bg-card hover:bg-muted",
    )
  }

  return (
    <div className="mx-auto space-y-6">
      <Card className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-bold text-primary">{foundWords.size}</div>
              <div className="text-xs text-muted-foreground">{"Found"}</div>
            </div>
            <div className="text-sm text-muted-foreground">{"/"}</div>
            <div className="text-center">
              <div className="text-sm font-bold">{WORDS.length}</div>
              <div className="text-xs text-muted-foreground">{"Total"}</div>
            </div>
          </div>

          <Button onClick={generateGrid} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {"Recommencer"}
          </Button>
        </div>
      </Card>

        <Card className="p-4 md:p-6 hidden">
            <h2 className="text-lg font-semibold mb-4">{"Mots à trouver:"}</h2>
            <div className="flex flex-wrap gap-2">
            {WORDS.map((word) => (
                <Badge
                key={word}
                variant={foundWords.has(word) ? "default" : "outline"}
                className={cn(
                    "text-sm px-4 py-2 transition-all duration-300",
                    foundWords.has(word) && "bg-primary text-primary-foreground",
                )}
                >
                {foundWords.has(word) && <Trophy className="w-3 h-3 mr-1" />}
                {word}
                </Badge>
            ))}
            </div>
        </Card>

        <Card className="p-4 md:p-6">
            <div
            className="inline-block mx-auto"
            onMouseLeave={() => {
                if (isDragging) {
                handleMouseUp()
                }
            }}
            >
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
                {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => (
                    <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellStyle(rowIndex, colIndex)}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                    onTouchStart={(e) => {
                        e.preventDefault()
                        handleMouseDown(rowIndex, colIndex)
                    }}
                    onTouchMove={(e) => {
                        e.preventDefault()
                        const touch = e.touches[0]
                        const element = document.elementFromPoint(touch.clientX, touch.clientY)
                        if (element) {
                        const row = element.getAttribute("data-row")
                        const col = element.getAttribute("data-col")
                        if (row && col) {
                            handleMouseEnter(Number.parseInt(row), Number.parseInt(col))
                        }
                        }
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault()
                        handleMouseUp()
                    }}
                    data-row={rowIndex}
                    data-col={colIndex}
                    >
                    {letter}
                    </div>
                )),
                )}
            </div>
            </div>
          </Card>

      {isComplete && (
        <Card className="p-6 md:p-8 bg-primary text-primary-foreground text-center animate-fade-in">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Trophy className="w-16 h-16 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold">{"Félicitation!"}</h2>
            <p className="text-lg opacity-90">{"Vous avez trouvé tous les mots !"}</p>
            <Button onClick={generateGrid} size="lg" variant="secondary" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              {"Rejouer"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-4 md:p-6 bg-muted hidden">
        <h3 className="font-semibold mb-2">{"Comment jouer :"}</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
            <li>{"• Cliquez et faites glisser sur les lettres pour sélectionner des mots"}</li>
            <li>{"• Les mots peuvent être horizontaux, verticaux ou en diagonale"}</li>
            <li>{"• Les mots peuvent être lus dans les deux sens"}</li>
            <li>{"• Trouvez tous les mots pour gagner !"}</li>
        </ul>
      </Card>
    </div>
  )
}
