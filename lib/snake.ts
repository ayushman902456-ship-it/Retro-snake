export const GRID_SIZE = 20

export type Point = { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Status = 'idle' | 'running' | 'paused' | 'over'

export interface GameState {
  snake: Point[]
  direction: Direction
  food: Point
  score: number
  status: Status
  justAte: boolean
}

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export function isOpposite(a: Direction, b: Direction) {
  return OPPOSITES[a] === b
}

function samePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y
}

export function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const free: Point[] = []
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) return { x: -1, y: -1 }
  return free[Math.floor(Math.random() * free.length)]
}

export function createInitialState(status: Status = 'idle'): GameState {
  const mid = Math.floor(GRID_SIZE / 2)
  const snake: Point[] = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
  return {
    snake,
    direction: 'right',
    food: randomFood(snake),
    score: 0,
    status,
    justAte: false,
  }
}

export function stepGame(state: GameState, nextDirection?: Direction): GameState {
  if (state.status !== 'running') return state

  const direction =
    nextDirection && !isOpposite(nextDirection, state.direction) ? nextDirection : state.direction

  const head = state.snake[0]
  const vector = VECTORS[direction]
  const newHead = { x: head.x + vector.x, y: head.y + vector.y }

  const hitWall =
    newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID_SIZE || newHead.y >= GRID_SIZE

  const eating = samePoint(newHead, state.food)
  // The tail moves away this tick unless we grow, so it is not a collision target.
  const body = eating ? state.snake : state.snake.slice(0, -1)
  const hitSelf = body.some((segment) => samePoint(segment, newHead))

  if (hitWall || hitSelf) {
    return { ...state, direction, status: 'over', justAte: false }
  }

  const snake = eating ? [newHead, ...state.snake] : [newHead, ...state.snake.slice(0, -1)]

  return {
    snake,
    direction,
    food: eating ? randomFood(snake) : state.food,
    score: eating ? state.score + 1 : state.score,
    status: 'running',
    justAte: eating,
  }
}

export function tickInterval(score: number) {
  const base = 160
  const min = 70
  return Math.max(min, base - score * 4)
}
