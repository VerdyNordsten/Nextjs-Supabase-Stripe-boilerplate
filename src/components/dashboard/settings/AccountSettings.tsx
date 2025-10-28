"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KeyRound, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AvatarUpload, AvatarUploadRef } from './AvatarUpload'

interface AccountSettingsProps {
  user?: {
    id: string
    email?: string
    last_sign_in_at?: string
    app_metadata?: {
      provider?: string
    }
  } | null
  userProfile?: {
    full_name?: string | null
    email?: string | null
    avatar_url?: string | null
    login_type?: string | null
    profile_image_key?: string | null
  } | null
  updateProfile: (data: { full_name?: string; avatar_url?: string | null; profile_image_key?: string | null }) => Promise<void>
  onError: (error: string) => void
  onSuccess: (message: string) => void
}

export function AccountSettings({ 
  user, 
  userProfile, 
  updateProfile, 
  onError, 
  onSuccess 
}: AccountSettingsProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarKey, setAvatarKey] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const avatarUploadRef = useRef<AvatarUploadRef>(null)

  useEffect(() => {
    if (userProfile?.full_name) {
      setFullName(userProfile.full_name)
    }
    if (userProfile?.avatar_url) {
      setAvatarUrl(userProfile.avatar_url)
    }
    if (userProfile?.profile_image_key) {
      setAvatarKey(userProfile.profile_image_key)
    }
  }, [userProfile])

  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) return
    
    console.log('[AccountSettings] Saving profile:', {
      full_name: fullName,
      avatar_url: avatarUrl,
      profile_image_key: avatarKey
    });
    
    setIsSaving(true)
    try {
      await updateProfile({
        full_name: fullName,
        ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
        ...(avatarKey !== undefined && { profile_image_key: avatarKey })
      })
      
      onSuccess('Profile updated successfully!')
      setHasUnsavedChanges(false)
    } catch (err) {
      console.error('Error saving profile:', err)
      onError('Failed to save profile changes')
    } finally {
      setIsSaving(false)
    }
  }, [user?.id, fullName, avatarUrl, avatarKey, updateProfile, onSuccess, onError])

  useEffect(() => {
    const hasChanges = fullName !== (userProfile?.full_name || '') ||
                      avatarUrl !== userProfile?.avatar_url ||
                      avatarKey !== userProfile?.profile_image_key
    setHasUnsavedChanges(hasChanges)
  }, [fullName, avatarUrl, avatarKey, userProfile])

  // Auto-save when avatar changes
  useEffect(() => {
    if (avatarUrl !== userProfile?.avatar_url || avatarKey !== userProfile?.profile_image_key) {
      if (avatarUrl && avatarKey) {
        console.log('[AccountSettings] Auto-saving profile after avatar change...')
        handleSaveProfile()
      }
    }
  }, [avatarUrl, avatarKey, userProfile?.avatar_url, userProfile?.profile_image_key, handleSaveProfile])

  const handleAvatarChange = (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl)
  }

  const handleAvatarKeyChange = (newAvatarKey: string | null) => {
    setAvatarKey(newAvatarKey)
  }

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Account Information
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Update your account information and profile settings
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <AvatarUpload
              ref={avatarUploadRef}
              currentAvatar={userProfile?.avatar_url}
              fullName={userProfile?.full_name || undefined}
              email={userProfile?.email || user?.email || undefined}
              userId={user?.id || ''}
              onAvatarChange={handleAvatarChange}
              onAvatarKeyChange={handleAvatarKeyChange}
              onError={onError}
              onSuccess={onSuccess}
            />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Full Name
                </label>
                <Input 
                  type="text" 
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Email
                </label>
                <Input 
                  type="email" 
                  value={userProfile?.email || user?.email || ''} 
                  disabled 
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Last Sign In
                </label>
                <p className="text-sm text-gray-600">
                  {user?.last_sign_in_at ? 
                    new Date(user.last_sign_in_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 
                    'N/A'
                  }
                </p>
              </div>

              {(userProfile?.login_type !== 'GOOGLE' && user?.app_metadata?.provider !== 'google') && (
              <div className="pt-2">
                <label className="text-sm font-medium text-gray-900 mb-3 block">
                  Security
                </label>
                <Button 
                  variant="outline" 
                    onClick={() => router.push(`/reset-password?email=${encodeURIComponent(user?.email || '')}`)}
                  className="flex items-center gap-2 border-gray-300"
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex items-center gap-3">
          <Button
            onClick={async () => {
              // First upload avatar if there's a new one
              if (avatarUploadRef.current?.hasNewAvatar) {
                console.log('[AccountSettings] Uploading new avatar...')
                const newAvatarUrl = await avatarUploadRef.current.saveAvatar()
                console.log('[AccountSettings] Avatar uploaded, URL:', newAvatarUrl)
                // Don't save here, let the useEffect handle it
              } else {
                // No new avatar, just save profile
                console.log('[AccountSettings] Saving profile without avatar change...')
                await handleSaveProfile()
              }
            }}
            disabled={isSaving || (!hasUnsavedChanges && !avatarUploadRef.current?.hasNewAvatar)}
            className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Changes
              </>
            )}
          </Button>
          
          {(hasUnsavedChanges || avatarUploadRef.current?.hasNewAvatar) && (
            <p className="text-sm text-orange-600 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              You have unsaved changes
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}