import axios from 'axios'
import { SendEmails } from '../pages/api/notify';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendEmail(invites: SendEmails[]) {
    try {
      const response = await axios.post(`${baseUrl}/api/notify`, invites);
    } catch (error) {
      // handle the error
      console.error(error)
    }
  }