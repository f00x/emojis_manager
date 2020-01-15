import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class StorageEmojisService {

  readonly KEY_COOKIE = 'emoji-index';
  public ListEmojis: CollectionEmoji;
  public IndexStatus: IndexStatus;
  public isFirstLoad: boolean = false;
  private EventLoadWatcher = new Subject<boolean>();
  public EventLoad$ = this.EventLoadWatcher.asObservable();

  constructor(
    private http: HttpClient
  ) {
    let indexSessionStorage = this.getCookies(this.KEY_COOKIE);

    this.IndexStatus = indexSessionStorage ? indexSessionStorage : {};
    this.updateList();
  }
  public setStatusEmoji(emoji: Emoji, status: EmojiStatus): this {
    if (!(this.IndexStatus[status] instanceof Array)) {
      this.IndexStatus[status] = []
    }
    this.IndexStatus[status].push(emoji.key);

    let indexStatusOld = this.IndexStatus[emoji.status];
    if (indexStatusOld instanceof Array) {
      let oldIndexStatusId = indexStatusOld.findIndex(function (element) { return element == emoji.key })
      if (oldIndexStatusId !== -1) {
        indexStatusOld.splice(oldIndexStatusId, 1);
      }
    }
    emoji.status = status;
    //не хватает ск длинны хотя стандарт не ограничивает

    let cutIndexForCookie = {};
    if (this.IndexStatus[EmojiStatus.deleted]) {
      cutIndexForCookie[EmojiStatus.deleted] = this.IndexStatus[EmojiStatus.deleted]
    }
    if (this.IndexStatus[EmojiStatus.favorite]) {
      cutIndexForCookie[EmojiStatus.favorite] = this.IndexStatus[EmojiStatus.favorite]
    }

    this.setCookies(this.KEY_COOKIE, cutIndexForCookie);
    return this;
  }
  public getEmojiList(whitelistStatus: EmojiStatus[], search?: string): Emoji[] {

    let listKeyEmoji = []
    let self = this;
    whitelistStatus.forEach(function (statusCode) {
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
    if (search && listKeyEmoji != []) {
      let regularFind = new RegExp('.*' + search.replace(/[^0-9A-z]+/, '.*') + '.*');
      listKeyEmoji = listKeyEmoji.filter(function (keyEmoji) {
        return regularFind.test(keyEmoji)
      })

    }
    if (listKeyEmoji.length > 0) {
      let result = [];
      listKeyEmoji = listKeyEmoji.sort();
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
  protected setCookies(key: string, valueObject: object) {
    let valueCookie = encodeURIComponent(JSON.stringify(valueObject))
    let expireDateTime = new Date();
    expireDateTime.setTime(expireDateTime.getTime() + 6000000)//+100 minutes
    let queryCookie = key + "=" + valueCookie + '; expires=' + expireDateTime.toUTCString();

    document.cookie = queryCookie;
  }
  protected getCookies(key: string) {
    let regularFilter = new RegExp('^\\s' + key + '\\=(.*)$')
    let arrayCookieSplit = document.cookie.split(';')

    let valueCookiefull = arrayCookieSplit.find(function (item) {
      return regularFilter.test(item)
    })
    if (valueCookiefull) {
      let valueCookie = valueCookiefull.replace(regularFilter, "$1")

      return JSON.parse(decodeURIComponent(valueCookie));
    } else { return false; }
  }


  private setList(inputObject: object) {

    this.ListEmojis = {}
    for (let key in inputObject) {
      let status: EmojiStatus = this.getStatus(key);
      this.ListEmojis[key] = { key: key, url: inputObject[key], status: status }

      if (!(this.IndexStatus[status] instanceof Array)) {
        this.IndexStatus[status] = []
      }
      if (this.IndexStatus[status].indexOf(key) === -1) {
        this.IndexStatus[status].push(key);
      }


    }
    this.EventLoadWatcher.next(true);
    this.isFirstLoad = true;
  }
  private getStatus(keyEmoji): EmojiStatus {
    for (let key in this.IndexStatus) {

      if (this.IndexStatus[key].includes(keyEmoji)) {
        if (EmojiStatus[key]) {
          return EmojiStatus[EmojiStatus[key]];
        }
      }
    }
    return EmojiStatus.default

  }

  updateList() {
    let self = this
    this.http.get('https://api.github.com/emojis')
      .subscribe(function (Response: object) {
        self.setList(Response);
      },
        err => {
          console.log('error update emoji status=' + err.status);
        });
  }
}
