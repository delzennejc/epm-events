import { NextApiRequest, NextApiResponse } from "next"
import _ from 'lodash'
import * as APIEmail from 'sib-api-v3-sdk'
import { supabaseClient } from "../../utils/supabaseClient"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export interface SendEmails {
    id: string;
    title: string;
    email: string;
    name: string;
    event: string;
    date: string;
}

/* SENDINBLUE SDK */
APIEmail.ApiClient.instance.authentications['api-key'].apiKey = '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';

const sendEmails = async (req: SendEmails) => {
    try {
        console.log('SEND EMAIL: INDIVIDUAL')
        const data = await new APIEmail.TransactionalEmailsApi().sendTransacEmail({
            templateId: 3,
            sender:{ email: "prattjames4@gmail.com", name: "Event EPM"},
            messageVersions: {
                to:[
                    {
                    email: req.email,
                    name: req.name,
                    },
                ],
                params:{
                    name: req.name,
                    link: `${baseUrl}/${req.id}`
                }
            }
        })
        return data
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
        res.status(200).json('')
    }
  }