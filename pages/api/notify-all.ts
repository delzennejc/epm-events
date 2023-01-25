import { NextApiRequest, NextApiResponse } from "next"
import _, { now } from 'lodash'
import * as APIEmail from 'sib-api-v3-sdk'
import { supabaseClient } from "../../utils/supabaseClient"
import { string } from "yup";
import { EventType } from "../../store/store.model";
import { frenchDate } from "../../utils/utils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const sendInBlueKey = process.env.SEND_IN_BLUE_KEY;

export interface SendEmails {
    id: string;
    name: string;
    email: string;
    children: number;
    title: string;
    date: string;
    address: string;
    metro: string;
    link: string;
}

/* SENDINBLUE SDK */
APIEmail.ApiClient.instance.authentications['api-key'].apiKey = sendInBlueKey

const sendEmails = async (event: EventType, message: string[], isSub: boolean = true) => {
    try {
        if (isSub) {
            const userSent = await new APIEmail.TransactionalEmailsApi().sendTransacEmail({
                templateId: 4,
                sender:{ email: "coordinationepm.republique@gmail.com", name: "Coordination EPM Event" },
                messageVersions: event?.participants.map((invite) => ({
                    to:[{
                        email: invite.email,
                        name: `${invite.first_name} ${invite.last_name}`,
                    }],
                    params: {
                        message: message,
                        name: `${invite.first_name} ${invite.last_name}`,
                        title: event.title,
                        date: frenchDate(event.date),
                        address: event.address,
                        metro: event.station,
                        link: `https://epmevents.fr/event/${event.id}`,
                    }
                }))
            })
        }
        return 'sent'
    } catch (e) {
        console.error("error", e)
    }
    return null
  }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    if (req.method === 'POST') {
        const { data:event } = await supabaseClient
        .from<EventType>('events')
        .select()
        .eq('id', req.body.eventId)
        .maybeSingle()
        if (event) {
            // const sent = await sendEmails(
            //     {
            //         id: event.id,
            //         title: event.title,
            //         address: event.address,
            //         date: event.date,
            //         station: event.station,
            //         /* @ts-ignore */
            //         participants: [ { email: "prattdelzennejc@gmail.com", first_name: 'JC', last_name: 'Delzenne' } ],
            //     },
            //     req.body.message
            //   )
            const sent = await sendEmails(event, req.body.message)
        }
        res.status(200).json({})
    }
}