"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Webhook, TestTube, CheckCircle, XCircle } from "lucide-react"
import { formApi } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"

interface WebhookSettingsProps {
  webhookUrl: string
  webhookEnabled: boolean
  onWebhookUrlChange: (url: string) => void
  onWebhookEnabledChange: (enabled: boolean) => void
}

export function WebhookSettings({
  webhookUrl,
  webhookEnabled,
  onWebhookUrlChange,
  onWebhookEnabledChange
}: WebhookSettingsProps) {
  const [isTesting, setIsTesting] = useState(false)

  const { mutate: testWebhook, isPending: isTestingWebhook } = useMutation({
    mutationFn: (url: string) => formApi.testWebhook(url),
    onSuccess: (data) => {
      setIsTesting(true)
      setTimeout(() => setIsTesting(false), 3000)
    },
    onError: () => {
      setIsTesting(true)
      setTimeout(() => setIsTesting(false), 3000)
    }
  })

  const handleTestWebhook = () => {
    if (webhookUrl.trim()) {
      testWebhook(webhookUrl.trim())
    }
  }

  const isValidUrl = webhookUrl.trim() && webhookUrl.includes('discord.com/api/webhooks/')

  return (
    <motion.div
      className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Webhook className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold">Discord Webhook</h3>
          <p className="text-gray-400 text-sm">Get notified when forms are submitted</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-gray-300 text-sm font-medium">
            Enable Discord Notifications
          </label>
          <button
            onClick={() => onWebhookEnabledChange(!webhookEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              webhookEnabled ? 'bg-purple-600' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                webhookEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Webhook URL Input */}
        <div className="space-y-2">
          <label className="text-gray-300 text-sm font-medium">
            Discord Webhook URL
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => onWebhookUrlChange(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={!webhookEnabled}
            />
            <button
              onClick={handleTestWebhook}
              disabled={!webhookEnabled || !isValidUrl || isTestingWebhook}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isTestingWebhook ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  <span>Test</span>
                </>
              )}
            </button>
          </div>
          
          {/* URL Validation */}
          {webhookUrl && !isValidUrl && (
            <p className="text-red-400 text-sm">
              Please enter a valid Discord webhook URL
            </p>
          )}

          {/* Test Result */}
          {isTesting && (
            <div className="flex items-center space-x-2 text-sm">
              {isTestingWebhook ? (
                <>
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-purple-400">Sending test webhook...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Test webhook sent successfully!</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-zinc-800/30 rounded-lg p-4">
          <h4 className="text-gray-300 text-sm font-medium mb-2">How to set up Discord webhook:</h4>
          <ol className="text-gray-400 text-sm space-y-1">
            <li>1. Go to your Discord server settings</li>
            <li>2. Navigate to Integrations → Webhooks</li>
            <li>3. Create a new webhook</li>
            <li>4. Copy the webhook URL and paste it above</li>
            <li>5. Test the webhook to ensure it works</li>
          </ol>
        </div>
      </div>
    </motion.div>
  )
} 