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
                sender:{ email: "coordinationepm.republique@gmail.com", name: "Event EPM" },
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
                            Bonsoir ${invite.first_name},
                            Confirmez-vous votre présence pour le restaurant ce dimanche?
                            C'est pour connaître le nombre total d'inscrits et le communiquer au restaurant.
                            Vous avez juste besoin de répondre à ce mail.
                            Très bonne soirée,
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
              .eq('id', '859f057d-f2d8-4f82-a12d-06ab27230a2b')
              .maybeSingle()
      const sent = await sendEmails(event)
      res.status(200).json({})
}