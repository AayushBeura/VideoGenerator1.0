"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { generateVideo } from "@/actions/generate-video"
import { Loader2 } from "lucide-react"

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("")
  const [duration, setDuration] = useState(3)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt) return

    setIsGenerating(true)
    setError(null)
    setVideoUrl(null)

    try {
      const result = await generateVideo(prompt, duration)
      if (result.error) {
        setError(result.error)
      } else if (result.videoUrl) {
        setVideoUrl(result.videoUrl)
      }
    } catch (err) {
      setError("Failed to generate video. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Describe your video</Label>
          <Input
            id="prompt"
            placeholder="A serene mountain landscape with flowing rivers..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="h-20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="duration">Duration (seconds): {duration}</Label>
          </div>
          <Slider
            id="duration"
            min={2}
            max={8}
            step={1}
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            disabled={isGenerating}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isGenerating || !prompt}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            "Generate Video"
          )}
        </Button>
      </form>

      {error && <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}

      {videoUrl && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Your Generated Video</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <video src={videoUrl} controls className="h-full w-full" autoPlay loop />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => window.open(videoUrl)}>
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const a = document.createElement("a")
                a.href = videoUrl
                a.download = `generated-video-${Date.now()}.mp4`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }}
            >
              Download Video
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

