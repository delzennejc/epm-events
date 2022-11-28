import { NextApiRequest, NextApiResponse } from "next"
import axios from 'axios'
import Cors from 'cors'
import _ from 'lodash'
import { supabaseClient } from "../../utils/supabaseClient"
import { flattenObject, toTimestamp, unflattenObject } from "../../utils/utils"

const cors = Cors({
  origin: "*",
  methods: ['POST', 'GET', 'HEAD'],
})

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

interface CreateResearch { 
  content: string;
  url: string; 
  id: string;
}

const getArticle = async (id: string) => {
  try {
      const { data:article } = await supabaseClient
          .from('articles')
          .select()
          .match({ id })
          .maybeSingle()
      return article
  } catch(e) {
      console.error(e)
  }
}

const createResearch = async ({ content, url, id }: CreateResearch) => {
  try {
    const currArticle = await getArticle(id);
    const notes = currArticle.notes ? { data: [{ content, url }, ...currArticle.notes.data] } : { data: [{ content: content, url }] }
    const { data:article } = await supabaseClient
      .from('articles')
      .update({
          notes,
      })
      .match({ id })
      .maybeSingle()
    return article
  } catch(e) {
      console.error(e)
  }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    await runMiddleware(req, res, cors)
    if (req.method === 'POST') {
        const updatedArticle = await createResearch(JSON.parse(req.body))
        res.status(200).json(updatedArticle)
    } else {
        res.status(200).json('Only POST requests')
    }
  }