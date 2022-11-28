import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next"
import _ from 'lodash'
import { supabaseClient } from "../../utils/supabaseClient"

const changeQuote = async () => {
    try {
        const { data:list } = await supabaseClient.storage
            .from('products')
            .list('Aave', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            })
            console.log('List: ', list)
            const urls = await asyncMap(list as any[]);
            console.log('Urls: ', urls)
    } catch(e) {
        console.error(e)
    }
}

const asyncMap = async (arr: any[]) => {
    const promises = arr.map(async (obj) => {
        const { data:url } = await supabaseClient.storage
            .from('products')
            .getPublicUrl(`Aave/${obj.name}`)
        return url?.publicURL
    });
   return await Promise.all(promises);
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    await changeQuote()
    res.status(200).json({
        message: `Bucket Updated.`,
    })
  }