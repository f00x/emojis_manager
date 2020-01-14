import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';
enum EmojiStatus {
  default,
  deleted,
  favorite
}
//"default"|"deleted"|"favorite"
interface Emoji {
  key:string,
  url:string,
  status:EmojiStatus

}
type JsonConvert=string|number|object|
@Injectable({
  providedIn: 'root'
})
interface CollectionEmoji{
  [key:string]:Emoji
}
interface IndexStatus{
  [key: EmojiStatus]:string[]
}

export class StorageEmojisService {
  private const KEY_COOKIE='emoji-index'
  public ListEmojis:CollectionEmoji;
  public IndexStatus:IndexStatus;

  constructor(private http: HttpClient) { 
    let indexSessionStorage=this.getCookies(this.KEY_COOKIE);

    this.IndexStatus=indexSessionStorage?indexSessionStorage:{};
  }
  
  public setCookies(key:string, valueObject:object)
  {
    let valueCookie=encodeURIComponent(JSON.stringify(valueObject))
    document.cookie=key+"="+valueCookie;
  }
  public getCookies(key:string)
  { let regularFilter =new RegExp('/(?:(?:^|.*;\\s*)'+key+'\\s*\\=\\s*([^;]*).*$)|^.*$/')
    let valueCookie=document.cookie.replace(regularFilter, "$1")
    return JSON.parse(decodeURIComponent(valueCookie));
  }

 
  private setList(inputObject:object)
  { this.ListEmojis={}
    for(let key in inputObject )
    { let status:EmojiStatus= this.getStatus(key) ;
      this.ListEmojis[key]={key:key,url:inputObject[key],status:status}
    }
  }
  private getStatus(keyEmoji):EmojiStatus
  { var result=EmojiStatus.default
    for(let key:EmojiStatus in this.IndexStatus)
    {
      if(this.IndexStatus[key].includes(keyEmoji)){
        
        let result=key
        break;
      } 
    }
    return (result in EmojiStatus)?result:EmojiStatus.default

  }
  
  updateList() {
    
    this.http.get('https://api.github.com/emojis')
      .subscribe(function  (Response:Response) {
        Response.body;
        console.log(Response.body)
        this.setList(Response.body);
      },
        err => {
          console.log('error update emoji status=' + err.status);
        });
  }
}
