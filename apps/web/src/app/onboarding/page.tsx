'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiClient } from '@/lib/api'
import { AlertCircle, ChevronRight, Check } from 'lucide-react'

const INTEREST_OPTIONS = [
  'Intellectual', 'Kinky', 'Roleplay', 'Casual', 'Romantic',
  'Adventure', 'Fitness', 'Creative', 'Geeky', 'Spiritual',
  'Foodie', 'Travel', 'Music', 'Art', 'Books'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    interestedIn: [] as string[],
    city: '',
    region: '',
    interests: [] as string[],
    minAge: 18,
    maxAge: 99,
    maxDistance: 50,
    lookingFor: [] as string[]
  })

  const handleNext = () => {
    setError('')

    // Validation for each step
    if (currentStep === 1) {
      if (!formData.username || !formData.gender) {
        setError('Please fill in all required fields')
        return
      }
    }

    if (currentStep === 2) {
      if (formData.interestedIn.length === 0) {
        setError('Please select at least one gender')
        return
      }
      if (formData.lookingFor.length === 0) {
        setError('Please select what you are looking for')
        return
      }
    }

    if (currentStep === 3) {
      // Submit form
      handleSubmit()
      return
    }

    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      await ApiClient.createProfile({
        username: formData.username,
        gender: formData.gender,
        interestedIn: formData.interestedIn,
        city: formData.city || undefined,
        region: formData.region || undefined,
        interests: formData.interests,
        preferences: {
          minAge: formData.minAge,
          maxAge: formData.maxAge,
          maxDistance: formData.maxDistance,
          lookingFor: formData.lookingFor
        }
      })

      // Redirect to home
      router.push('/home')
    } catch (err: any) {
      setError(err.message || 'Failed to create profile')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item)
    }
    return [...array, item]
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step < currentStep
                      ? 'bg-primary-500 text-white'
                      : step === currentStep
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-24 mx-2 ${
                      step < currentStep ? 'bg-primary-500' : 'bg-gray-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Preferences</span>
            <span>Interests</span>
          </div>
        </div>

        <div className="bg-background-card p-8 rounded-lg border border-gray-800">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Let's get started</h2>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  required
                  placeholder="Choose a unique username"
                  className="w-full px-4 py-3 bg-background border border-gray-800 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be shown to others when you match
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-3">Your Gender *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`px-4 py-3 rounded-lg border transition-colors ${
                        formData.gender === gender
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-background border-gray-800 hover:border-gray-700'
                      }`}
                      onClick={() => setFormData({ ...formData, gender })}
                    >
                      {gender.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location (Optional) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    placeholder="e.g. Barcelona"
                    className="w-full px-4 py-3 bg-background border border-gray-800 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="region" className="block text-sm font-medium mb-2">
                    Region/State
                  </label>
                  <input
                    type="text"
                    id="region"
                    placeholder="e.g. Catalonia"
                    className="w-full px-4 py-3 bg-background border border-gray-800 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Who are you looking for?</h2>

              {/* Interested In */}
              <div>
                <label className="block text-sm font-medium mb-3">Interested In *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['MALE', 'FEMALE', 'NON_BINARY', 'OTHER'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={`px-4 py-3 rounded-lg border transition-colors ${
                        formData.interestedIn.includes(gender)
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-background border-gray-800 hover:border-gray-700'
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          interestedIn: toggleArrayItem(formData.interestedIn, gender)
                        })
                      }
                    >
                      {gender.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  You can select multiple
                </p>
              </div>

              {/* Looking For */}
              <div>
                <label className="block text-sm font-medium mb-3">Looking For *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['CHAT', 'DATING', 'BOTH'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`px-4 py-3 rounded-lg border transition-colors ${
                        formData.lookingFor.includes(type)
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-background border-gray-800 hover:border-gray-700'
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          lookingFor: toggleArrayItem(formData.lookingFor, type)
                        })
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Age Range: {formData.minAge} - {formData.maxAge}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min Age</label>
                    <input
                      type="range"
                      min="18"
                      max="99"
                      className="w-full"
                      value={formData.minAge}
                      onChange={(e) =>
                        setFormData({ ...formData, minAge: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Age</label>
                    <input
                      type="range"
                      min="18"
                      max="99"
                      className="w-full"
                      value={formData.maxAge}
                      onChange={(e) =>
                        setFormData({ ...formData, maxAge: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Max Distance */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Max Distance: {formData.maxDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="500"
                  className="w-full"
                  value={formData.maxDistance}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDistance: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">What interests you?</h2>

              <div>
                <p className="text-gray-400 text-sm mb-4">
                  Select your interests to help find better matches
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                        formData.interests.includes(interest)
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-background border-gray-800 hover:border-gray-700'
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          interests: toggleArrayItem(formData.interests, interest)
                        })
                      }
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Selected: {formData.interests.length} interests
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 border border-gray-800 hover:bg-background-hover text-white font-semibold rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {currentStep === 3 ? (
                isLoading ? 'Creating Profile...' : 'Complete'
              ) : (
                <>
                  Next <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
