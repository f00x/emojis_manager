import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';

export enum EmojiStatus {
  default,
  deleted,
  favorite
}
//"default"|"deleted"|"favorite"
export interface Emoji {
  key: string,
  url: string,
  status: EmojiStatus

}
type JsonConvert = string | number | object | boolean;

interface CollectionEmoji {
  [key: string]: Emoji
}

interface IndexStatus {
  [key: number]: string[]

}

@Injectable( { providedIn: 'root' } )
export class StorageEmojisService {

  readonly KEY_COOKIE = 'emoji-index';
  public ListEmojis: CollectionEmoji;
  public IndexStatus: IndexStatus;

  constructor(
    private http: HttpClient
    ) {
    let indexSessionStorage = this.getCookies(this.KEY_COOKIE);

    this.IndexStatus = indexSessionStorage ? indexSessionStorage : {};
    this.updateList();
  }

  public getEmojiList(whitelistStatus: EmojiStatus[], search?: string): Emoji[] {

    let listKeyEmoji = []
    let self = this;
    whitelistStatus.forEach(function(statusCode) {
      if (self.IndexStatus[statusCode]) {
        self.IndexStatus[statusCode].forEach(
          function (EmojiCode) {
           // if (!listKeyEmoji.includes(EmojiCode)) {
              listKeyEmoji.push(EmojiCode)
           // }
          }
        )

      }

    })
    console.log('__getEmojiList',whitelistStatus,'__',listKeyEmoji);
    if (search && listKeyEmoji != []) {
      let regularFind = new RegExp('.*' + search.replace(/[^0-9A-z]+/, '.*') + '.*');
      listKeyEmoji = listKeyEmoji.filter(function (keyEmoji) {
        return regularFind.test(keyEmoji)
      })

    }
    if (listKeyEmoji.length > 0) {
      let result = [];
      listKeyEmoji.forEach(function (KeyEmoji) {
        let Emoji = self.ListEmojis[KeyEmoji]
        if (Emoji) {
          result.push(Emoji)
        }
      })
      return result;
    }

    return []
  }
  public setCookies(key: string, valueObject: object) {
    let valueCookie = encodeURIComponent(JSON.stringify(valueObject))
    document.cookie = key + "=" + valueCookie;
  }
  public getCookies(key: string) {
    let regularFilter = new RegExp('/(?:(?:^|.*;\\s*)' + key + '\\s*\\=\\s*([^;]*).*$)|^.*$/')
    let valueCookie = document.cookie.replace(regularFilter, "$1")
    if(valueCookie){
    return JSON.parse(decodeURIComponent(valueCookie));
    }else{return false;}
  }


  private setList(inputObject: object) {
    this.ListEmojis = {}
    for (let key in inputObject) {
      let status: EmojiStatus = this.getStatus(key);
      this.ListEmojis[key] = { key: key, url: inputObject[key], status: status }
      if(!(this.IndexStatus[status] instanceof Array)){
        this.IndexStatus[status]=[]
      }
      this.IndexStatus[status].push(key);

    }
    // console.log('___setList',inputObject,'__',this.ListEmojis);
  }
  private getStatus(keyEmoji): EmojiStatus {
    var result = EmojiStatus.default
    for (let key in this.IndexStatus) {
      if (this.IndexStatus[key].includes(keyEmoji)) {

        let result = key
        break;
      }
    }
    return (result in EmojiStatus) ? result : EmojiStatus.default

  }

  updateList() {
      let self = this
    this.http.get('https://api.github.com/emojis')
      .subscribe(function (Response: object) {
        
        console.log('___Respounse',Response)
        self.setList(Response);
      },
        err => {
          console.log('error update emoji status=' + err.status);
        });
  }
}
