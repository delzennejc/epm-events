import { NextApiRequest, NextApiResponse } from "next"
import _ from 'lodash'
import * as APIEmail from 'sib-api-v3-sdk'
import { supabaseClient } from "../../utils/supabaseClient"
import { string } from "yup";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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
APIEmail.ApiClient.instance.authentications['api-key'].apiKey = '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';

const sendEmails = async (req: SendEmails[]) => {
    try {
        const userSent = await new APIEmail.TransactionalEmailsApi().sendTransacEmail({
            templateId: 1,
            sender:{ email: "prattjames4@gmail.com", name: "Event EPM"},
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
                }
            }))
        })
        const adminSent = await new APIEmail.TransactionalEmailsApi().sendTransacEmail({
            templateId: 2,
            sender:{ email: "prattjames4@gmail.com", name: "Event EPM"},
            messageVersions: [{
                to:[{
                    email: 'prattjames4@gmail.com',
                    name: 'Event EPM',
                }],
                params: {
                    invites: req,
                    title: req[0].title,
                }
            }]
        })
        return 'sent'
    } catch (e) {
        console.log("error", e)
    }
    return null
  }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    if (req.method === 'POST') {
        const sent = await sendEmails(req.body)
        res.status(200).json({})
    }
}