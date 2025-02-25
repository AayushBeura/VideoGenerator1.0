"use server"

import Replicate from "replicate"

export async function generateVideo(prompt: string, durationSeconds = 3) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return {
        error: "Missing Replicate API token. Please add it to your environment variables.",
      }
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Calculate number of frames based on duration (assuming 8 fps)
    const numFrames = durationSeconds * 8

    // Use Replicate's text-to-video model
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          prompt: prompt,
          video_length: "16_frames", // Options: "14_frames", "16_frames", "25_frames"
          sizing_strategy: "maintain_aspect_ratio",
          motion_bucket_id: 40, // Range: 1-255
          frames_per_second: 8,
        },
      },
    )

    // The output should be a URL to the generated video
    if (typeof output === "string") {
      return { videoUrl: output }
    } else if (Array.isArray(output) && output.length > 0) {
      return { videoUrl: output[0] }
    }

    return {
      error: "Failed to generate video. Please try a different prompt.",
    }
  } catch (error) {
    console.error("Error generating video:", error)
    return {
      error: "An error occurred while generating the video. Please try again.",
    }
  }
}

