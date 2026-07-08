import useUserStore from '../store/userStore'

export function getUserProfile() {
  return useUserStore.getState().profile
}

export function updateUserProfile(updates) {
  useUserStore.getState().updateProfile(updates)
}

export function loadUserProfile(profile) {
  useUserStore.getState().setUserProfile(profile)
}
