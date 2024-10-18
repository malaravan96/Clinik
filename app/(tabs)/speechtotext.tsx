import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import { Audio } from 'expo-av'
import axios from 'axios'

// Your BASE_API_URL
const BASE_API_URL = 'https://careappsstg.azurewebsites.net/api'

const getAssemblyAIToken = async () => {
  try {
    const API_ENDPOINT = `${BASE_API_URL}/voice`
    const response = await axios.get(`${API_ENDPOINT}/GetUserToken?userId=test`)
    return response.data['Token']
  } catch (error) {
    console.error('Error fetching AssemblyAI token:', error)
    return null
  }
}

const VoiceTranscriber = () => {
  const [token, setToken] = useState<string | null>(null)
  const socket = useRef<WebSocket | null>(null)
  const recorder = useRef<Audio.Recording | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recordingInstance, setRecordingInstance] = useState<Audio.Recording | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      const assemblyToken = await getAssemblyAIToken()
      if (assemblyToken) {
        setToken(assemblyToken)
      }
    }
    fetchToken()
  }, [])

  const generateTranscript = async () => {
    if (!token) {
      console.error('No token found')
      return
    }

    // If there's an ongoing recording, stop it before starting a new one
    if (recorder.current) {
      try {
        await recorder.current.stopAndUnloadAsync()
        recorder.current = null // Ensure the current recording object is cleared
      } catch (error) {
        console.error('Failed to stop previous recording:', error)
      }
    }

    socket.current = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`)

    const texts: Record<number, string> = {}
    if (socket.current) {
      socket.current.onmessage = (voicePrompt: MessageEvent) => {
        const res = JSON.parse(voicePrompt.data)
        const audioStart: number = Number(res.audio_start) // Explicitly cast audio_start to number
        texts[audioStart] = res.text
        
        // Sort the transcripts based on their start time and join them
        const sortedTranscript = Object.keys(texts)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => texts[Number(key)]) // Convert key back to number when accessing the texts object
          .join(' ')

        setTranscript(sortedTranscript) // Update the transcript in state
      }

      socket.current.onerror = (event) => {
        console.error("WebSocket error:", event)
        socket.current?.close()
      }

      socket.current.onclose = (event) => {
        console.log("WebSocket closed", event.code, event.reason)
        if (event.code !== 1000) {
          console.error("WebSocket closed unexpectedly. Attempting to reconnect...")
          setTimeout(generateTranscript, 1000) // Attempt to reconnect after 1 second
        }
        socket.current = null
      }

      socket.current.onopen = async () => {
        console.log("WebSocket connection opened")

        // Send ping to keep the connection alive every 30 seconds
        const pingInterval = setInterval(() => {
          if (socket.current) {
            socket.current.send(JSON.stringify({ ping: true }))
          }
        }, 30000)

        // Clear ping interval when the WebSocket closes
        if (socket.current) {
          socket.current.onclose = () => {
            clearInterval(pingInterval)
            socket.current = null
          }
        }

        const { granted } = await Audio.requestPermissionsAsync()
        if (!granted) {
          console.error('Audio permission not granted')
          return
        }

        const recording = new Audio.Recording()
        try {
          await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
          recording.setOnRecordingStatusUpdate((status) => {
            if (status.isRecording) {
              recorder.current = recording
            }
          })
          await recording.startAsync()
          setRecordingInstance(recording)
        } catch (error) {
          console.error('Failed to start recording:', error)
        }
      }

      setIsRecording(true)
    }
  }

  const endTranscription = async () => {
    setIsRecording(false)

    if (socket.current) {
      socket.current.send(JSON.stringify({ terminate_session: true }))
      socket.current.close()
    }

    if (recorder.current) {
      try {
        await recorder.current.stopAndUnloadAsync()
        const uri = recorder.current.getURI()

        if (!uri) {
          console.error('No URI found for the recorded audio')
          return
        }

        const audioFile = await fetch(uri)
        const audioBlob = await audioFile.blob()

        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result && socket.current) {
            const base64data = (reader.result as string).split('base64,')[1]
            socket.current?.send(JSON.stringify({ audio_data: base64data }))
          }
        }
        reader.readAsDataURL(audioBlob)

        setRecordingInstance(null)
        recorder.current = null
      } catch (error) {
        console.error('Error stopping recording:', error)
      }
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Real-Time Medical Transcription
      </Text>
      {isRecording ? (
        <Button title="Stop Recording" onPress={endTranscription} />
      ) : (
        <Button title="Start Recording" onPress={generateTranscript} />
      )}
      <Text style={{ marginTop: 20, fontSize: 16 }}>{transcript}</Text>
    </View>
  )
}

export default VoiceTranscriber
