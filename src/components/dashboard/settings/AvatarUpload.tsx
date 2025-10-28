"use client"

import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, Upload } from 'lucide-react'
import { supabaseBrowser as supabase } from '@/utils/supabase-browser'

interface AvatarUploadProps {
  currentAvatar?: string | null
  fullName?: string | null
  email?: string | null
  userId: string
  onAvatarChange: (avatarUrl: string | null) => void
  onAvatarKeyChange?: (avatarKey: string | null) => void
  onError: (error: string) => void
  onSuccess: (message: string) => void
}

export interface AvatarUploadRef {
  hasNewAvatar: boolean
  saveAvatar: () => Promise<string | null>
}

export const AvatarUpload = forwardRef<AvatarUploadRef, AvatarUploadProps>(({
  currentAvatar,
  fullName,
  email,
  userId,
  onAvatarChange,
  onAvatarKeyChange,
  onError,
  onSuccess
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)

  const getInitials = (name?: string | null, email?: string) => {
    if (!email && !name) return 'U'
    if (name) {
      const names = name.split(' ')
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
    }
    return email ? email.substring(0, 1).toUpperCase() : 'U'
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError('Image size must be less than 5MB')
      return
    }

    setNewAvatarFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    onError('')
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    onError('')
    
    try {
      // Delete old avatar from storage if exists
      if (currentAvatar) {
        // Extract the file path from the URL
        const urlParts = currentAvatar.split('/')
        const fileName = urlParts[urlParts.length - 1]
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${fileName}`])
        }
      }

      onAvatarChange(null)
      if (onAvatarKeyChange) {
        onAvatarKeyChange(null)
      }
      setAvatarPreview(null)
      setNewAvatarFile(null)
      onSuccess('Avatar removed successfully!')
    } catch (err) {
      console.error('Error removing avatar:', err)
      onError('Failed to remove avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const uploadAvatar = async (): Promise<{ url: string | null; key: string | null }> => {
    if (!newAvatarFile) return { url: null, key: null }

    try {
      // Delete old avatar if exists
      if (currentAvatar) {
        // Extract the file path from the URL
        const urlParts = currentAvatar.split('/')
        const fileName = urlParts[urlParts.length - 1]
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${fileName}`])
        }
      }

      // Upload new avatar
      const fileExt = newAvatarFile.name.split('.').pop()
      const fileName = `avatar_${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, newAvatarFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      return {
        url: data.publicUrl,
        key: filePath // Store only the path, not the full URL
      }
    } catch (err) {
      console.error('Error uploading avatar:', err)
      throw err
    }
  }

  const saveAvatar = async () => {
    if (!newAvatarFile) return null
    
    setIsUploading(true)
    try {
      const { url: avatarUrl, key: avatarKey } = await uploadAvatar()
      onAvatarChange(avatarUrl)
      if (onAvatarKeyChange) {
        onAvatarKeyChange(avatarKey)
      }
      setNewAvatarFile(null)
      setAvatarPreview(null)
      return avatarUrl
    } catch (err) {
      console.error('Error uploading avatar:', err)
      onError('Failed to upload avatar')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    hasNewAvatar: !!newAvatarFile,
    saveAvatar
  }))

  return (
    <div>
      <label className="text-sm font-medium text-gray-900 mb-3 block">
        Profile Picture
      </label>
      <div className="space-y-4">
        <div className="relative w-52 h-52 overflow-hidden rounded-lg border-2 border-gray-200">
          {avatarPreview || currentAvatar ? (
            <Image
              src={avatarPreview || currentAvatar || ''}
              alt="Profile"
              fill
              className="object-cover"
              sizes="(max-width: 208px) 100vw, 208px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-600 to-pink-400 flex items-center justify-center">
              <span className="text-white text-6xl font-semibold">
                {getInitials(fullName || undefined, email || undefined)}
              </span>
            </div>
          )}
          {(avatarPreview || currentAvatar) && (
            <button
              onClick={handleRemoveAvatar}
              disabled={isUploading}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-md p-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove avatar"
            >
              <Trash2 className="h-4 w-4 text-gray-700" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 border-gray-300"
          >
            <Upload className="h-4 w-4" />
            Upload New
          </Button>
          
          {newAvatarFile && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewAvatarFile(null)
                setAvatarPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="border-gray-300 text-gray-600"
            >
              Cancel
            </Button>
          )}
        </div>
        
        {newAvatarFile && (
          <p className="text-sm text-blue-600">
            New image selected: {newAvatarFile.name}
          </p>
        )}
        
        <p className="text-xs text-gray-500">
          JPG, PNG or GIF (max 5MB)
        </p>
      </div>
    </div>
  )
})

AvatarUpload.displayName = 'AvatarUpload'