import { supabase } from './client'

const roomIdMap = {
  general: '11111111-1111-1111-1111-111111111111',
  author: '22222222-2222-2222-2222-222222222222',
  recommendations: '33333333-3333-3333-3333-333333333333',
  events: '44444444-4444-4444-4444-444444444444',
}

function normalizeRoomId(roomId) {
  return roomIdMap[roomId] ?? roomId
}

export async function fetchRooms() {
  const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: true })
  return { data, error }
}

export async function fetchMessages(roomId) {
  const normalizedRoomId = normalizeRoomId(roomId)
  const { data, error } = await supabase
    .from('messages')
    .select('id, room_id, profile_id, content, sent_at')
    .eq('room_id', normalizedRoomId)
    .order('sent_at', { ascending: true })

  if (error) {
    return { data: null, error }
  }

  if (!data?.length) {
    return { data: [], error: null }
  }

  const profileIds = [...new Set(data.map((message) => message.profile_id).filter(Boolean))]
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', profileIds)

  const profilesMap = new Map((profilesData ?? []).map((profile) => [profile.id, profile]))
  const enrichedMessages = (data ?? []).map((message) => ({
    ...message,
    profiles: profilesMap.get(message.profile_id) ?? null,
  }))

  return { data: enrichedMessages, error: profilesError }
}

export async function sendMessage(roomId, profileId, content) {
  const normalizedRoomId = normalizeRoomId(roomId)
  const { data, error } = await supabase
    .from('messages')
    .insert({ room_id: normalizedRoomId, profile_id: profileId, content })
    .select('id, room_id, profile_id, content, sent_at')

  if (error) {
    return { data: null, error }
  }

  return {
    data: (data ?? []).map((message) => ({ ...message, profiles: null })),
    error: null,
  }
}
