import { SnakeGame } from '@/components/snake/snake-game'

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <SnakeGame />
    </main>
  )
}
