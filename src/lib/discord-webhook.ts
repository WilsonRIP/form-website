interface DiscordEmbed {
  title?: string
  description?: string
  color?: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  timestamp?: string
  footer?: {
    text: string
  }
}

interface DiscordWebhookPayload {
  embeds: DiscordEmbed[]
  username?: string
  avatar_url?: string
}

export async function sendDiscordWebhook(
  webhookUrl: string,
  formTitle: string,
  submissionData: any,
  formFields: any[],
  submissionId: number
): Promise<boolean> {
  try {
    // Parse submission data if it's a string
    const parsedData = typeof submissionData === 'string' ? JSON.parse(submissionData) : submissionData

    // Create fields for the embed
    const fields = formFields
      .map(field => {
        const value = parsedData[field.label]
        if (!value) return null

        let displayValue: string
        if (Array.isArray(value)) {
          displayValue = value.join(', ')
        } else {
          displayValue = String(value)
        }

        // Truncate long values
        if (displayValue.length > 1024) {
          displayValue = displayValue.substring(0, 1021) + '...'
        }

        return {
          name: field.label,
          value: displayValue,
          inline: true
        }
      })
      .filter((field): field is { name: string; value: string; inline: boolean } => field !== null)

    const embed: DiscordEmbed = {
      title: `📝 New Form Submission - ${formTitle}`,
      description: `A new submission has been received for **${formTitle}**`,
      color: 0x5865F2, // Discord blue
      fields: [
        {
          name: 'Submission ID',
          value: `#${submissionId}`,
          inline: true
        },
        {
          name: 'Submitted At',
          value: new Date().toLocaleString(),
          inline: true
        },
        ...fields
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Form Builder Webhook'
      }
    }

    const payload: DiscordWebhookPayload = {
      embeds: [embed],
      username: 'Form Builder',
      avatar_url: 'https://cdn.discordapp.com/emojis/1234567890.png' // You can replace with your own avatar
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending Discord webhook:', error)
    return false
  }
}

export function isValidDiscordWebhookUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname === 'discord.com' && 
           urlObj.pathname.includes('/api/webhooks/') &&
           urlObj.searchParams.has('wait')
  } catch {
    return false
  }
} 