import { NextApiRequest, NextApiResponse } from "next"
import _ from 'lodash'
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

const sendEmails = async (event: EventType, isSub: boolean = true) => {
    try {
        if (isSub) {
            const userSent = await new APIEmail.TransactionalEmailsApi().sendTransacEmail({
                templateId: 4,
                sender:{ email: "prattdelzennejc@gmail.com", name: "Event EPM" },
                // messageVersions: [{
                //     to:[{
                //         email: 'prattjames4@gmail.com',
                //         name: `Jean-Claude Pratt-Delzennne`,
                //     }],
                //     params: {
                //         message: `
                //             Plus que quelques instants avant de passer un bon moment ensemble au bowling Mouffetard 😊🙏🏾
                //             N'hésitez pas à contacter le pasteur JB ou Marine (au +33661982655) pour se retrouver. 
                            
                //             A bientôt ❤🙏🏽
                //             Rachel
                //         `,
                //         name: `Jean-Claude Pratt-Delzennne`,
                //         title: event.title,
                //         date: frenchDate(event.date),
                //         address: event.address,
                //         metro: event.station,
                //         link: `https://epmevents.fr/event/${event.id}`,
                //     }
                // }]
                messageVersions: event?.participants.map((invite) => ({
                    to:[{
                        email: invite.email,
                        name: `${invite.first_name} ${invite.last_name}`,
                    }],
                    params: {
                        message: `
                            Il est temps de quitter le théatre Déjazet. 
                            Merci à vous de vous être porté volontaire pour nous aider
                            dans ce déménagement. On se donne rendez-vous juste après le culte.
                            À tout à l'heure.
                        `,
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
      const { data:event } = await supabaseClient
              .from('events')
              .select()
              .eq('id', 'e56735e6-ac0f-4dc7-8f9e-4f88080fd0ad')
              .maybeSingle()
      const sent = await sendEmails(event)
      res.status(200).json({})
}