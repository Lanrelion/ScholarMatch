"use client"

import dynamic from "next/dynamic"

const InstallPrompt = dynamic(
  () => import("./InstallPrompt"),
  { ssr: false }
)

export default function PWAClient() {
  return <InstallPrompt />
}
