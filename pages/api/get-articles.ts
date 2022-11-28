import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next"
import Cors from 'cors'
import _ from 'lodash'
import { supabaseClient } from "../../utils/supabaseClient"

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

const getArticles = async () => {
    try {
        const { data:articles } = await supabaseClient
            .from('articles')
            .select()
        return articles
    } catch(e) {
        console.error(e)
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    await runMiddleware(req, res, cors)
    const articles = await getArticles()
    res.status(200).json(articles)
  }