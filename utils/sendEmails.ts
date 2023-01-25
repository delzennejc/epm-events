import axios from 'axios'
import { SendEmails } from '../pages/api/notify';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function notifyParticipant(invites: SendEmails[], isSub: boolean = true) {
    try {
      const response = await axios.post(`${baseUrl}/api/notify`, { invites, isSub });
    } catch (error) {
      // handle the error
      console.error(error)
    }
}

export async function notifyAllParticipants(eventId: string, message: string[]) {
  try {
    const response = await axios.post(`${baseUrl}/api/notify-all`, { eventId, message });
  } catch (error) {
    // handle the error
    console.error(error)
  }
}