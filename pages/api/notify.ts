import { NextApiRequest, NextApiResponse } from "next"
import _ from 'lodash'
import * as APIEmail from 'sib-api-v3-sdk'
import { supabaseClient } from "../../utils/supabaseClient"
import { string } from "yup";

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
    extends: { label: string; checked: string; }[];
}

/* SENDINBLUE SDK */
APIEmail.ApiClient.instance.authentications['api-key'].apiKey = sendInBlueKey

const sendEmails = async (req: SendEmails[], isSub: boolean = true) => {
    try {
        if (isSub) {
            const userSent = await new APIEmail.TransactionalEmailsApi().sendTransacEmail({
                templateId: 1,
                sender:{ email: "coordinationepm.republique@gmail.com", name: "Event EPM" },
                messageVersions: req.map((invite) => ({
                    to:[{
                        email: invite.email,
                        name: invite.name,
                    }],
                    params: {
                        name: invite.name,
                        children: invite.children,
                        title: invite.title,
                        date: invite.date,
                        address: invite.address,
                        metro: invite.metro,
                        link: invite.link,
                        extends: invite.extends,
                    }
                }))
            })
        }
        const adminSent = await new APIEmail.TransactionalEmailsApi().sendTransacEmail({
            templateId: isSub ? 2 : 3,
            sender:{ email: "coordinationepm.republique@gmail.com", name: "Event EPM" },
            messageVersions: [{
                to: [
                    {
                        email: 'coordinationepm.republique@gmail.com',
                        name: 'Event EPM',
                    },
                    // {
                    //     email: 'prattjames4@gmail.com',
                    //     name: 'Event EPM',
                    // },
                ],
                params: {
                    invites: req,
                    title: req[0].title,
                }
            }]
        })
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
        const sent = await sendEmails(req.body.invites, req.body.isSub)
        res.status(200).json({})
    }
}