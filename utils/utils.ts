// @ts-nocheck
import _ from 'lodash'
import { format, compareDesc, add, formatRelative } from 'date-fns'
import { supabaseClient } from './supabaseClient'
import { fr, enGB } from 'date-fns/locale'
import psl from 'psl'

const formatRelativeLocale: { [key: string]: string } = {
    lastWeek: "eeee",
    yesterday: "'Yesterday'",
    today: "'Today'",
    tomorrow: "'Tomorrow'",
    nextWeek: "'Next' eeee",
    other: 'dd.MM.yyyy',
  };
  
  const locale = {
    ...enGB,
    formatRelative: (token: string) => formatRelativeLocale[token],
  };

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sleep(fn: any, ...args: any) {
    await timeout(500);
    return fn(...args);
}

export const shouldNotInclude = (arr: any[], val: any) => {
    return !arr.includes(val)
}

export function toTimestamp(strDate){
    const datum = Date.parse(strDate);
    return datum/1000;
}

export function flattenObject(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop ? prop+"."+i : ""+i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}

export function unflattenObject(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var result = {}, cur, prop, idx, last, temp;
    for(var p in data) {
        cur = result, prop = "", last = 0;
        do {
            idx = p.indexOf(".", last);
            temp = p.substring(last, idx !== -1 ? idx : undefined);
            cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
            prop = temp;
            last = idx + 1;
        } while(idx >= 0);
        cur[prop] = data[p];
    }
    return result[""];
}

export function formatDistanceDate(date) {
    return formatRelative(new Date(date), new Date(), { locale })
}

export function sortDate(list: any[], key: string = 'created_at', reverse: boolean = false) {
    if (reverse) {
        return list.sort((req1, req2) => {
            return compareDesc(new Date(req1[key]), new Date(req2[key]))
        }).reverse()
    }
    return list.sort((req1, req2) => {
        return compareDesc(new Date(req1[key]), new Date(req2[key]))
    })
}

export function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
  
    if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
  
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
  
    return hostname;
  }

export function extractRootDomain(url): string {
    var domain = extractHostname(url),
    splitArr = domain.split('.'),
    arrLen = splitArr.length;
  
    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
        //this is using a ccTLD
        domain = splitArr[arrLen - 3] + '.' + domain;
      }
    }
    return psl.get(domain);
  }
  
  const urlHostname = url => {
    try {
      return new URL(url).hostname;
    }
    catch(e) { return e; }
  };

  export const frenchDate = (date: Date) => {
    return format(new Date(date), "EEE dd MMMM yyyy, H'h'mm", { locale: fr })
  }

  export const asyncImageMap = async (arr: any[], id: string) => {
    const promises = arr.map(async (obj) => {
        const { data:url } = await supabaseClient.storage
            .from('products')
            .getPublicUrl(`${id}/${obj.name}`)
        return url?.publicURL
    });
   return await Promise.all(promises);
}
